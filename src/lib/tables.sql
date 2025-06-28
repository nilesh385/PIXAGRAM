create table users (
  id uuid not null unique default gen_random_uuid() primary key,
  user_id text not null unique default auth.jwt()->>'sub',
  email text not null unique,
  username text not null unique,
  fullname text not null unique,
  image text,
  followings text[] default '{}',
  followers text[] default '{}',
  blocked text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;


create policy "Users can see their own profile"
on "public"."users"
as PERMISSIVE
for SELECT
to authenticated
using (
((select auth.jwt()->>'sub') = (user_id)::text)
);

create policy "Users must insert their own data"
on "public"."users"
as PERMISSIVE
for INSERT
to authenticated
with check (
((select auth.jwt()->>'sub') = (user_id)::text)
);

create policy "User can update their own "
on "public"."users"
as PERMISSIVE
for UPDATE
to authenticated
using (
((select auth.jwt()->>'sub') = (user_id)::text)
);

create policy "User can delete their own data only"
on "public"."users"
as PERMISSIVE
for DELETE
to authenticated
using (
((select auth.jwt()->>'sub') = (user_id)::text)

);




CREATE POLICY "Allow authenticated users to view images in their users table"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'images'
  AND EXISTS (SELECT 1 FROM public.users WHERE public.users.user_id = (auth.jwt() ->> 'sub'))
);