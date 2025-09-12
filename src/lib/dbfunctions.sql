-- Follow user (atomic)
create or replace function public.follow_user(
  follower_id text,
  followings_id text
) returns void language plpgsql as $$
begin
  if follower_id = followings_id then
    raise exception 'cannot follow yourself';
  end if;

  -- Add followings_id to follower's followings array if not present
  update public.users
  set followings = coalesce(followings, array[]::text[]) || followings_id
  where user_id = follower_id
    and NOT (followings_id = any(coalesce(followings, array[]::text[])));

  -- Add follower_id to followings user's followers array if not present
  update public.users
  set followers = coalesce(followers, array[]::text[]) || follower_id
  where user_id = followings_id
    and NOT (follower_id = any(coalesce(followers, array[]::text[])));
end;
$$;

-- Unfollow user (atomic)
create or replace function public.unfollow_user(
  follower_id text,
  followings_id text
) returns void language plpgsql as $$
begin
  if follower_id = followings_id then
    raise exception 'cannot unfollow yourself';
  end if;

  update public.users
  set followings = array_remove(coalesce(followings, array[]::text[]), followings_id)
  where user_id = follower_id;

  update public.users
  set followers = array_remove(coalesce(followers, array[]::text[]), follower_id)
  where user_id = followings_id;
end;
$$;
