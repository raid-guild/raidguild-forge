create table if not exists subscriber_project_interests (
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  project_slug text not null,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (subscriber_id, project_slug)
);

create index if not exists subscriber_project_interests_project_slug_idx
  on subscriber_project_interests(project_slug);
