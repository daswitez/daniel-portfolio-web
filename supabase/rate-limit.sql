-- Rate limiting for the portfolio's AI chat (/api/chat).
-- Run once in Supabase → SQL Editor. Stores only counters: no chats, no raw IPs
-- (visitors are identified by a salted SHA-256 hash computed on the server).

create table if not exists public.chat_rate_limits (
  key text primary key,
  count integer not null default 0,
  window_start timestamptz not null default now()
);

-- Row Level Security on with NO policies: the public (anon) key can't read or
-- write this table at all. Only the server, with the service role key, can.
alter table public.chat_rate_limits enable row level security;

-- Counts one hit for `p_key` and returns true while it's within `p_limit`
-- hits per `p_window_seconds`. Atomic, so parallel requests can't slip through.
create or replace function public.hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  insert into public.chat_rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case
          when r.window_start < now() - make_interval(secs => p_window_seconds) then 1
          else r.count + 1
        end,
        window_start = case
          when r.window_start < now() - make_interval(secs => p_window_seconds) then now()
          else r.window_start
        end
  returning count into current_count;

  return current_count <= p_limit;
end;
$$;

-- Only the service role may call it.
revoke all on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;

-- Optional housekeeping: delete counters older than two days (run now and then,
-- or schedule it with pg_cron).
-- delete from public.chat_rate_limits where window_start < now() - interval '2 days';
