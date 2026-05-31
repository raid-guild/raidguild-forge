create extension if not exists pgcrypto;

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  email_hash text not null unique,
  unsubscribe_token_hash text unique,
  source text,
  verified_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscribers
  add column if not exists unsubscribe_token_hash text unique;

alter table subscribers
  add column if not exists unsubscribed_at timestamptz;

create table if not exists subscriber_preferences (
  subscriber_id uuid primary key references subscribers(id) on delete cascade,
  learn boolean not null default true,
  games boolean not null default true,
  marketplace boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists email_confirmations (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_confirmations_subscriber_id_idx
  on email_confirmations(subscriber_id);

create index if not exists email_confirmations_unconfirmed_idx
  on email_confirmations(token_hash, expires_at)
  where confirmed_at is null;
