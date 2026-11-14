-- Portfolio backend schema: enquiries, Cal.com bookings and rate limiting.
-- Run once in the Supabase SQL editor (or with `supabase db push`).
-- All tables have Row Level Security enabled with NO policies, so the public
-- anon key cannot read or write anything. Only the service-role key used by the
-- Netlify Functions (server-side) can access these tables.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- enquiries
create table if not exists public.enquiries (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique,
  created_at       timestamptz not null default now(),
  full_name        text not null check (char_length(full_name) between 2 and 120),
  email            text not null check (char_length(email) <= 200),
  company          text check (company is null or char_length(company) <= 160),
  service          text not null,
  budget_currency  text not null check (budget_currency in ('KES', 'USD')),
  budget           text not null,
  timeline         text not null,
  description      text not null check (char_length(description) between 30 and 4000),
  consent          boolean not null default false,
  status           text not null default 'new' check (status in ('new', 'replied', 'won', 'lost', 'spam')),
  owner_notified   boolean not null default false,
  visitor_confirmed boolean not null default false,
  ip_hash          text,
  user_agent       text,
  origin           text,
  notes            text
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_email_idx on public.enquiries (lower(email));

-- ----------------------------------------------------------------- bookings
create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  cal_uid             text not null unique,
  cal_booking_id      bigint,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  last_event          text not null,
  status              text not null check (status in ('accepted', 'pending', 'cancelled', 'rejected', 'rescheduled')),
  event_type          text,
  title               text,
  start_time          timestamptz,
  end_time            timestamptz,
  attendee_name       text,
  attendee_email      text,
  attendee_timezone   text,
  location            text,
  notes               text,
  cancellation_reason text,
  rescheduled_from    text,
  payload             jsonb
);

create index if not exists bookings_start_time_idx on public.bookings (start_time desc);

-- ------------------------------------------------------------- rate limits
create table if not exists public.rate_limit_hits (
  id          bigint generated always as identity primary key,
  bucket      text not null,
  key_hash    text not null,
  created_at  timestamptz not null default now()
);

create index if not exists rate_limit_hits_lookup_idx on public.rate_limit_hits (bucket, key_hash, created_at desc);

-- Records a hit and returns false when `p_max` hits already exist inside the
-- window. Old rows are pruned opportunistically.
create or replace function public.hit_rate_limit(
  p_bucket text,
  p_key text,
  p_window_seconds integer,
  p_max integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  hits integer;
begin
  delete from public.rate_limit_hits where created_at < now() - interval '2 days';

  select count(*) into hits
  from public.rate_limit_hits
  where bucket = p_bucket
    and key_hash = p_key
    and created_at > now() - make_interval(secs => p_window_seconds);

  if hits >= p_max then
    return false;
  end if;

  insert into public.rate_limit_hits (bucket, key_hash) values (p_bucket, p_key);
  return true;
end;
$$;

-- ----------------------------------------------------------------- security
alter table public.enquiries enable row level security;
alter table public.bookings enable row level security;
alter table public.rate_limit_hits enable row level security;

revoke all on public.enquiries, public.bookings, public.rate_limit_hits from anon, authenticated;
revoke all on function public.hit_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, text, integer, integer) to service_role;
