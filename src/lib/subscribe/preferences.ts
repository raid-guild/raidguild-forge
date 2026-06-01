export type SubscriberPreferences = {
  learn: boolean;
  games: boolean;
  marketplace: boolean;
};

export const defaultSubscriberPreferences: SubscriberPreferences = {
  learn: true,
  games: true,
  marketplace: true,
};

export function normalizePreferences(
  preferences: Partial<SubscriberPreferences> | undefined,
) {
  const normalized = {
    learn: preferences?.learn ?? defaultSubscriberPreferences.learn,
    games: preferences?.games ?? defaultSubscriberPreferences.games,
    marketplace: preferences?.marketplace ?? defaultSubscriberPreferences.marketplace,
  };

  return normalized;
}
