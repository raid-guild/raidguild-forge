import { query } from "@/lib/subscribe/db";
import {
  createEmailHash,
  hashConfirmationToken,
  normalizeEmail,
} from "@/lib/subscribe/crypto";
import type { SubscriberPreferences } from "@/lib/subscribe/preferences";

type SubscriberRow = {
  id: string;
  verified_at: string | null;
};

export async function upsertSubscriber({
  email,
  preferences,
  shouldUpdatePreferences = true,
  source,
  projectInterests,
  unsubscribeToken,
}: {
  email: string;
  preferences: SubscriberPreferences;
  shouldUpdatePreferences?: boolean;
  projectInterests?: string[];
  source?: string;
  unsubscribeToken: string;
}) {
  const normalizedEmail = normalizeEmail(email);
  const emailHash = createEmailHash(normalizedEmail);
  const unsubscribeTokenHash = hashConfirmationToken(unsubscribeToken);

  const subscriberResult = await query<SubscriberRow>(
    `
      insert into subscribers (
        email,
        email_hash,
        unsubscribe_token_hash,
        source,
        updated_at
      )
      values ($1, $2, $3, $4, now())
      on conflict (email) do update
      set unsubscribe_token_hash = excluded.unsubscribe_token_hash,
          source = coalesce(excluded.source, subscribers.source),
          updated_at = now()
      returning id, verified_at
    `,
    [normalizedEmail, emailHash, unsubscribeTokenHash, source ?? null],
  );

  const subscriber = subscriberResult.rows[0];

  if (shouldUpdatePreferences) {
    await query(
      `
        insert into subscriber_preferences (subscriber_id, learn, games, marketplace, updated_at)
        values ($1, $2, $3, $4, now())
        on conflict (subscriber_id) do update
        set learn = excluded.learn,
            games = excluded.games,
            marketplace = excluded.marketplace,
            updated_at = now()
      `,
      [subscriber.id, preferences.learn, preferences.games, preferences.marketplace],
    );
  } else {
    await query(
      `
        insert into subscriber_preferences (subscriber_id, learn, games, marketplace, updated_at)
        values ($1, false, false, false, now())
        on conflict (subscriber_id) do nothing
      `,
      [subscriber.id],
    );
  }

  if (projectInterests?.length) {
    for (const projectSlug of projectInterests) {
      await query(
        `
          insert into subscriber_project_interests (
            subscriber_id,
            project_slug,
            source,
            updated_at
          )
          values ($1, $2, $3, now())
          on conflict (subscriber_id, project_slug) do update
          set source = coalesce(excluded.source, subscriber_project_interests.source),
              updated_at = now()
        `,
        [subscriber.id, projectSlug, source ?? null],
      );
    }
  }

  return {
    id: subscriber.id,
    verifiedAt: subscriber.verified_at,
    email: normalizedEmail,
  };
}

export async function createConfirmation({
  subscriberId,
  token,
}: {
  subscriberId: string;
  token: string;
}) {
  const tokenHash = hashConfirmationToken(token);

  await query(
    `
      update email_confirmations
      set expires_at = now()
      where subscriber_id = $1
        and confirmed_at is null
        and expires_at > now()
    `,
    [subscriberId],
  );

  await query(
    `
      insert into email_confirmations (subscriber_id, token_hash, expires_at)
      values ($1, $2, now() + interval '7 days')
    `,
    [subscriberId, tokenHash],
  );
}

export async function confirmSubscriber(token: string) {
  const tokenHash = hashConfirmationToken(token);

  const result = await query<{ id: string }>(
    `
      with consumed as (
        update email_confirmations
        set confirmed_at = now()
        where token_hash = $1
          and confirmed_at is null
          and expires_at > now()
        returning subscriber_id
      )
      update subscribers
      set verified_at = coalesce(verified_at, now()),
          unsubscribed_at = null,
          updated_at = now()
      where id = (select subscriber_id from consumed)
      returning id
    `,
    [tokenHash],
  );

  return result.rows.length > 0;
}

export async function unsubscribeSubscriber(token: string) {
  const tokenHash = hashConfirmationToken(token);

  const result = await query<{ id: string }>(
    `
      update subscribers
      set unsubscribed_at = coalesce(unsubscribed_at, now()),
          updated_at = now()
      where unsubscribe_token_hash = $1
      returning id
    `,
    [tokenHash],
  );

  return result.rows.length > 0;
}
