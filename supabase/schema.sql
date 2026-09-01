create extension if not exists "pgcrypto";
create type public.user_role as enum ('academy_admin','coach','student');
create type public.goal_status as enum ('active','completed','paused');
create type public.workout_status as enum ('planned','in_progress','completed','missed');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text not null, role public.user_role not null default 'student', avatar_url text, phone text, created_at timestamptz not null default now());
create table public.academies (id uuid primary key default gen_random_uuid(), name text not null, owner_id uuid not null references public.profiles(id), created_at timestamptz not null default now());
create table public.academy_members (academy_id uuid references public.academies(id) on delete cascade, profile_id uuid references public.profiles(id) on delete cascade, role public.user_role not null, joined_at timestamptz not null default now(), primary key(academy_id,profile_id));
create table public.students (id uuid primary key default gen_random_uuid(), academy_id uuid not null references public.academies(id) on delete cascade, profile_id uuid references public.profiles(id) on delete set null, coach_id uuid references public.profiles(id) on delete set null, full_name text not null, email text, birth_date date, objective text, active boolean not null default true, joined_at date not null default current_date);
create table public.goals (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.students(id) on delete cascade, title text not null, target_value numeric, current_value numeric not null default 0, unit text, due_date date, status public.goal_status not null default 'active', created_at timestamptz not null default now());
create table public.workouts (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.students(id) on delete cascade, coach_id uuid references public.profiles(id) on delete set null, title text not null, notes text, scheduled_at timestamptz, completed_at timestamptz, status public.workout_status not null default 'planned', created_at timestamptz not null default now());
create table public.workout_exercises (id uuid primary key default gen_random_uuid(), workout_id uuid not null references public.workouts(id) on delete cascade, name text not null, sets integer, reps text, load_kg numeric, rest_seconds integer, position integer not null default 0);
create table public.body_assessments (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.students(id) on delete cascade, assessed_by uuid references public.profiles(id) on delete set null, assessed_at timestamptz not null default now(), weight_kg numeric, height_cm numeric, body_fat_pct numeric, muscle_mass_kg numeric, visceral_fat numeric, metabolic_age integer, notes text);
create table public.messages (id uuid primary key default gen_random_uuid(), sender_id uuid not null references public.profiles(id) on delete cascade, recipient_id uuid not null references public.profiles(id) on delete cascade, body text not null, read_at timestamptz, created_at timestamptz not null default now());

alter table public.profiles enable row level security; alter table public.academies enable row level security; alter table public.academy_members enable row level security; alter table public.students enable row level security; alter table public.goals enable row level security; alter table public.workouts enable row level security; alter table public.workout_exercises enable row level security; alter table public.body_assessments enable row level security; alter table public.messages enable row level security;
create policy "own profile" on public.profiles for all using(id=auth.uid()) with check(id=auth.uid());
create policy "members view academy" on public.academies for select using(exists(select 1 from public.academy_members m where m.academy_id=id and m.profile_id=auth.uid()));
create policy "members view membership" on public.academy_members for select using(profile_id=auth.uid() or exists(select 1 from public.academy_members me where me.academy_id=academy_id and me.profile_id=auth.uid()));
create policy "staff manage students" on public.students for all using(exists(select 1 from public.academy_members m where m.academy_id=academy_id and m.profile_id=auth.uid() and m.role in ('academy_admin','coach')));
create policy "student reads own record" on public.students for select using(profile_id=auth.uid());
create policy "related goals" on public.goals for select using(exists(select 1 from public.students s where s.id=student_id and (s.profile_id=auth.uid() or s.coach_id=auth.uid())));
create policy "coach manages goals" on public.goals for all using(exists(select 1 from public.students s where s.id=student_id and s.coach_id=auth.uid()));
create policy "related workouts" on public.workouts for select using(coach_id=auth.uid() or exists(select 1 from public.students s where s.id=student_id and s.profile_id=auth.uid()));
create policy "coach manages workouts" on public.workouts for all using(coach_id=auth.uid());
create policy "related exercises" on public.workout_exercises for select using(exists(select 1 from public.workouts w join public.students s on s.id=w.student_id where w.id=workout_id and (w.coach_id=auth.uid() or s.profile_id=auth.uid())));
create policy "coach manages exercises" on public.workout_exercises for all using(exists(select 1 from public.workouts w where w.id=workout_id and w.coach_id=auth.uid()));
create policy "related assessments" on public.body_assessments for select using(assessed_by=auth.uid() or exists(select 1 from public.students s where s.id=student_id and s.profile_id=auth.uid()));
create policy "coach manages assessments" on public.body_assessments for all using(assessed_by=auth.uid());
create policy "message participants" on public.messages for select using(sender_id=auth.uid() or recipient_id=auth.uid());
create policy "send own messages" on public.messages for insert with check(sender_id=auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1))); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
