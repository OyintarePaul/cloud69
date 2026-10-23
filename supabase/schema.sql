-- Cloud69 schema. Run top to bottom in the Supabase SQL editor.
-- Chunk 1: enum and tables

create type upload_status as enum ('uploading', 'ready');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  quota_bytes bigint not null default 524288000,
  used_bytes bigint not null default 0 check (used_bytes >= 0)
);

create table folders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references folders(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 255),
  trashed_at timestamptz,
  trash_batch_id uuid,
  is_trash_root boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references folders(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 255),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  mime_type text not null default 'application/octet-stream',
  storage_path text not null unique,
  status upload_status not null default 'uploading',
  uploader_tab_id uuid,
  last_heartbeat_at timestamptz not null default now(),
  trashed_at timestamptz,
  trash_batch_id uuid,
  is_trash_root boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe by default: RLS on, no policies yet (everything denied until chunk 6).
alter table profiles enable row level security;
alter table folders enable row level security;
alter table files enable row level security;



-- Chunk 2: profile row per user (R3)

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end
$$;

-- Only the trigger should run this, never a client.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that signed in before this trigger existed.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;



-- Chunk 3: maintained updated_at (R12)

create function public.touch_folder_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.name is distinct from old.name
     or new.parent_id is distinct from old.parent_id
     or new.trashed_at is distinct from old.trashed_at then
    new.updated_at := now();
  end if;
  return new;
end
$$;

create function public.touch_file_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.name is distinct from old.name
     or new.folder_id is distinct from old.folder_id
     or new.status is distinct from old.status
     or new.trashed_at is distinct from old.trashed_at then
    new.updated_at := now();
  end if;
  return new;
end
$$;

revoke execute on function public.touch_folder_updated_at() from public, anon, authenticated;
revoke execute on function public.touch_file_updated_at() from public, anon, authenticated;

create trigger folders_touch_updated_at
  before update on public.folders
  for each row execute function public.touch_folder_updated_at();

create trigger files_touch_updated_at
  before update on public.files
  for each row execute function public.touch_file_updated_at();






-- Chunk 4: indexes and uniqueness

-- Live names are unique per parent, case-insensitive. Files and folders are
-- separate namespaces (R13). These are the safety net behind auto-rename
-- (files) and the inline duplicate error (folders).
create unique index folders_live_name_uniq
  on public.folders (
    owner_id,
    coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid),
    lower(name)
  )
  where trashed_at is null;

create unique index files_live_name_uniq
  on public.files (
    owner_id,
    coalesce(folder_id, '00000000-0000-0000-0000-000000000000'::uuid),
    lower(name)
  )
  where trashed_at is null;

-- Listings (file listings also filter status = 'ready', R14)
create index folders_list_idx
  on public.folders (owner_id, parent_id)
  where trashed_at is null;

create index files_list_idx
  on public.files (owner_id, folder_id)
  where trashed_at is null;

-- Search: trigram GIN on lower(name)
create extension if not exists pg_trgm with schema extensions;

create index folders_name_trgm_idx
  on public.folders using gin (lower(name) extensions.gin_trgm_ops);

create index files_name_trgm_idx
  on public.files using gin (lower(name) extensions.gin_trgm_ops);

-- Purge
create index folders_trashed_at_idx
  on public.folders (trashed_at)
  where trashed_at is not null;

create index files_trashed_at_idx
  on public.files (trashed_at)
  where trashed_at is not null;

create index files_status_heartbeat_idx
  on public.files (status, last_heartbeat_at);



-- Chunk 5: reserve-first quota (R2, R3)

create function public.reserve_quota()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set used_bytes = used_bytes + new.size_bytes
  where id = new.owner_id
    and used_bytes + new.size_bytes <= quota_bytes;

  if found then
    return new;
  end if;

  if not exists (select 1 from public.profiles where id = new.owner_id) then
    raise exception 'PROFILE_MISSING';
  end if;

  raise exception 'QUOTA_EXCEEDED';
end
$$;

create function public.release_quota()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set used_bytes = greatest(0, used_bytes - old.size_bytes)
  where id = old.owner_id;
  return old;
end
$$;

revoke execute on function public.reserve_quota() from public, anon, authenticated;
revoke execute on function public.release_quota() from public, anon, authenticated;

create trigger files_reserve
  before insert on public.files
  for each row execute function public.reserve_quota();

create trigger files_release
  after delete on public.files
  for each row execute function public.release_quota();




  -- Chunk 6: locked-down writes and RLS (R1, R2)

-- Tables: browser can only read
revoke all on public.profiles, public.folders, public.files from anon, authenticated;
grant select on public.profiles, public.folders, public.files to authenticated;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy folders_select_own on public.folders
  for select to authenticated
  using (owner_id = (select auth.uid()));

create policy files_select_own on public.files
  for select to authenticated
  using (owner_id = (select auth.uid()));

-- Storage: bucket 'files', first path segment must be the caller's user id
create policy files_objects_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy files_objects_delete_own on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Insert additionally requires a reserved, still-uploading row (R2)
create policy files_objects_insert_pending on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.files f
      where f.storage_path = name
        and f.owner_id = (select auth.uid())
        and f.status = 'uploading'
    )
  );



-- Chunk 7a: name helpers, create_folder, rename_item

-- Internal helper: mirrors the zod nameSchema as a backstop. No client grants.
create function public.validate_name(p text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare n text := btrim(p);
begin
  if n is null or char_length(n) < 1 or char_length(n) > 255 then
    raise exception 'INVALID_NAME';
  end if;
  if n ~ '[/\\]' or n ~ '[\x01-\x1f\x7f]' then
    raise exception 'INVALID_NAME';
  end if;
  if n = '.' or n = '..' then
    raise exception 'INVALID_NAME';
  end if;
  return n;
end
$$;

-- Best-effort suggestion; the unique indexes remain the real guarantee.
create function public.next_available_name(p_parent uuid, p_name text, p_kind text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  zero constant uuid := '00000000-0000-0000-0000-000000000000';
  orig text;
  base text;
  ext text := '';
  m text[];
  candidate text;
  i int := 0;
  taken boolean;
begin
  if uid is null then raise exception 'UNAUTHORIZED'; end if;
  if p_kind not in ('file', 'folder') then raise exception 'INVALID_KIND'; end if;

  orig := public.validate_name(p_name);
  base := orig;

  if p_kind = 'file' then
    -- split at the last dot; a leading dot (.env) is not an extension
    m := regexp_match(orig, '^(.+)(\.[^.]+)$');
    if m is not null then
      base := m[1];
      ext := m[2];
    end if;
  end if;

  loop
    candidate := case when i = 0 then orig
                      else base || ' (' || i || ')' || ext end;
    if p_kind = 'folder' then
      select exists (
        select 1 from public.folders
        where owner_id = uid
          and coalesce(parent_id, zero) = coalesce(p_parent, zero)
          and lower(name) = lower(candidate)
          and trashed_at is null
      ) into taken;
    else
      select exists (
        select 1 from public.files
        where owner_id = uid
          and coalesce(folder_id, zero) = coalesce(p_parent, zero)
          and lower(name) = lower(candidate)
          and trashed_at is null
      ) into taken;
    end if;
    exit when not taken;
    i := i + 1;
  end loop;

  return candidate;
end
$$;

create function public.create_folder(p_parent uuid, p_name text)
returns public.folders
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  nm text;
  ptrashed timestamptz;
  r public.folders;
begin
  if uid is null then raise exception 'UNAUTHORIZED'; end if;
  nm := public.validate_name(p_name);

  -- parent must be live, checked under a share lock (R4)
  if p_parent is not null then
    select f.trashed_at into ptrashed
    from public.folders f
    where f.id = p_parent and f.owner_id = uid
    for share;
    if not found then raise exception 'NOT_FOUND'; end if;
    if ptrashed is not null then raise exception 'PARENT_TRASHED'; end if;
  end if;

  begin
    insert into public.folders (owner_id, parent_id, name)
    values (uid, p_parent, nm)
    returning * into r;
  exception when unique_violation then
    raise exception 'DUPLICATE_NAME';
  end;

  return r;
end
$$;

create function public.rename_item(p_kind text, p_id uuid, p_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  nm text;
begin
  if uid is null then raise exception 'UNAUTHORIZED'; end if;
  if p_kind not in ('file', 'folder') then raise exception 'INVALID_KIND'; end if;
  nm := public.validate_name(p_name);

  if p_kind = 'folder' then
    perform 1 from public.folders
    where id = p_id and owner_id = uid and trashed_at is null
    for update;
    if not found then raise exception 'NOT_FOUND'; end if;

    begin
      update public.folders set name = nm where id = p_id;
    exception when unique_violation then
      raise exception 'DUPLICATE_NAME';
    end;
  else
    perform 1 from public.files
    where id = p_id and owner_id = uid and trashed_at is null and status = 'ready'
    for update;
    if not found then raise exception 'NOT_FOUND'; end if;

    begin
      update public.files set name = nm where id = p_id;
    exception when unique_violation then
      raise exception 'DUPLICATE_NAME';
    end;
  end if;

  return nm;
end
$$;

-- Execute rights: helper gets none; RPCs only for signed-in users.
revoke execute on function public.validate_name(text) from public, anon, authenticated;

revoke execute on function public.next_available_name(uuid, text, text) from public, anon;
revoke execute on function public.create_folder(uuid, text) from public, anon;
revoke execute on function public.rename_item(text, uuid, text) from public, anon;
grant execute on function public.next_available_name(uuid, text, text) to authenticated;
grant execute on function public.create_folder(uuid, text) to authenticated;
grant execute on function public.rename_item(text, uuid, text) to authenticated;




-- Chunk 7b: upload lifecycle RPCs

create function public.create_file_row(
  p_folder uuid, p_name text, p_size bigint, p_mime text, p_tab_id uuid)
returns table (file_id uuid, object_name text, final_name text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  nm text;
  mime text;
  ptrashed timestamptz;
  new_id uuid := gen_random_uuid();
  path text;
  candidate text;
  attempts int := 0;
begin
  if uid is null then raise exception 'UNAUTHORIZED'; end if;
  nm := public.validate_name(p_name);

  if p_size is null or p_size < 1 or p_size > 52428800 then
    raise exception 'INVALID_SIZE';
  end if;

  mime := coalesce(nullif(btrim(p_mime), ''), 'application/octet-stream');
  if char_length(mime) > 255 then mime := 'application/octet-stream'; end if;

  -- parent must be live, checked under a share lock (R4)
  if p_folder is not null then
    select f.trashed_at into ptrashed
    from public.folders f
    where f.id = p_folder and f.owner_id = uid
    for share;
    if not found then raise exception 'NOT_FOUND'; end if;
    if ptrashed is not null then raise exception 'PARENT_TRASHED'; end if;
  end if;

  path := uid::text || '/' || new_id::text;

  loop
    candidate := public.next_available_name(p_folder, nm, 'file');
    begin
      insert into public.files
        (id, owner_id, folder_id, name, size_bytes, mime_type, storage_path, uploader_tab_id)
      values
        (new_id, uid, p_folder, candidate, p_size, mime, path, p_tab_id);
      exit;
    exception when unique_violation then
      attempts := attempts + 1;
      if attempts >= 10 then raise exception 'DUPLICATE_NAME'; end if;
    end;
  end loop;

  file_id := new_id;
  object_name := path;
  final_name := candidate;
  return next;
end
$$;

create function public.complete_upload(p_file_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'UNAUTHORIZED'; end if;

  update public.files
  set status = 'ready'
  where id = p_file_id and owner_id = uid and status = 'uploading';

  if not found then raise exception 'NOT_FOUND'; end if;
end
$$;

create function public.fail_upload(p_file_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'UNAUTHORIZED'; end if;

  delete from public.files
  where id = p_file_id and owner_id = uid and status = 'uploading';

  return found;
end
$$;

create function public.heartbeat(p_file_ids uuid[], p_tab_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  n integer;
begin
  if uid is null then raise exception 'UNAUTHORIZED'; end if;
  if p_file_ids is null or cardinality(p_file_ids) = 0 then return 0; end if;
  if cardinality(p_file_ids) > 500 then raise exception 'TOO_MANY_IDS'; end if;

  update public.files
  set last_heartbeat_at = now()
  where id = any (p_file_ids) and owner_id = uid and status = 'uploading';

  get diagnostics n = row_count;
  return n;
end
$$;

revoke execute on function public.create_file_row(uuid, text, bigint, text, uuid) from public, anon;
revoke execute on function public.complete_upload(uuid) from public, anon;
revoke execute on function public.fail_upload(uuid) from public, anon;
revoke execute on function public.heartbeat(uuid[], uuid) from public, anon;
grant execute on function public.create_file_row(uuid, text, bigint, text, uuid) to authenticated;
grant execute on function public.complete_upload(uuid) to authenticated;
grant execute on function public.fail_upload(uuid) to authenticated;
grant execute on function public.heartbeat(uuid[], uuid) to authenticated;




-- Chunk 7c: trash_items, restore_batch, trash indexes

create index if not exists folders_trash_batch_idx
  on public.folders (trash_batch_id) where trash_batch_id is not null;
create index if not exists files_trash_batch_idx
  on public.files (trash_batch_id) where trash_batch_id is not null;
create index if not exists folders_parent_idx on public.folders (parent_id);
create index if not exists files_folder_idx on public.files (folder_id);

create or replace function public.trash_items(p_file_ids uuid[], p_folder_ids uuid[])
returns uuid[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_files uuid[];
  v_folders uuid[];
  v_batches uuid[] := '{}';
  v_batch uuid;
  v_id uuid;
  v_trashed timestamptz;
  v_tb uuid;
  v_status public.upload_status;
begin
  if v_uid is null then raise exception 'UNAUTHORIZED'; end if;

  if coalesce(cardinality(p_file_ids), 0) + coalesce(cardinality(p_folder_ids), 0) > 500 then
    raise exception 'TOO_MANY_IDS';
  end if;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_files
  from unnest(coalesce(p_file_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_folders
  from unnest(coalesce(p_folder_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  if cardinality(v_files) = 0 and cardinality(v_folders) = 0 then
    return '{}'::uuid[];
  end if;

  -- every id must exist, be yours, and be live (files must also be ready)
  if (select count(*) from public.folders f
      where f.id = any(v_folders) and f.owner_id = v_uid and f.trashed_at is null)
     <> cardinality(v_folders) then
    raise exception 'NOT_FOUND';
  end if;
  if (select count(*) from public.files fl
      where fl.id = any(v_files) and fl.owner_id = v_uid
        and fl.trashed_at is null and fl.status = 'ready')
     <> cardinality(v_files) then
    raise exception 'NOT_FOUND';
  end if;

  -- folder roots
  foreach v_id in array v_folders loop
    select f.trashed_at, f.trash_batch_id into v_trashed, v_tb
    from public.folders f
    where f.id = v_id and f.owner_id = v_uid
    for update;

    if not found then raise exception 'NOT_FOUND'; end if;
    if v_trashed is not null then
      -- already trashed earlier in this same call (inside another named folder): skip
      if v_tb = any(v_batches) then continue; end if;
      raise exception 'NOT_FOUND';
    end if;

    v_batch := gen_random_uuid();

    -- step 1: lock every live folder in the subtree
    perform 1 from public.folders f
    where f.id in (
      with recursive t(id) as (
        select r.id from public.folders r where r.id = v_id
        union all
        select c.id from public.folders c join t on c.parent_id = t.id
        where c.trashed_at is null and c.owner_id = v_uid
      )
      select t.id from t
    )
    order by f.id
    for update;

    -- step 2a: mark the folders (separate statement, fresh snapshot)
    with recursive t(id) as (
      select r.id from public.folders r where r.id = v_id
      union all
      select c.id from public.folders c join t on c.parent_id = t.id
      where c.trashed_at is null and c.owner_id = v_uid
    )
    update public.folders f
    set trashed_at = now(), trash_batch_id = v_batch, is_trash_root = (f.id = v_id)
    from t
    where f.id = t.id and f.trashed_at is null;

    -- catch folders created at the same moment, until none are left
    loop
      update public.folders f
      set trashed_at = now(), trash_batch_id = v_batch, is_trash_root = false
      where f.owner_id = v_uid and f.trashed_at is null
        and f.parent_id in (
          select p.id from public.folders p where p.trash_batch_id = v_batch
        );
      exit when not found;
    end loop;

    -- step 2b: mark every live file in those folders (includes uploading rows)
    update public.files fl
    set trashed_at = now(), trash_batch_id = v_batch, is_trash_root = false
    where fl.owner_id = v_uid and fl.trashed_at is null
      and fl.folder_id in (
        select p.id from public.folders p where p.trash_batch_id = v_batch
      );

    v_batches := v_batches || v_batch;
  end loop;

  -- file roots
  foreach v_id in array v_files loop
    select fl.trashed_at, fl.trash_batch_id, fl.status into v_trashed, v_tb, v_status
    from public.files fl
    where fl.id = v_id and fl.owner_id = v_uid
    for update;

    if not found then raise exception 'NOT_FOUND'; end if;
    if v_trashed is not null then
      if v_tb = any(v_batches) then continue; end if;
      raise exception 'NOT_FOUND';
    end if;
    if v_status <> 'ready' then raise exception 'NOT_FOUND'; end if;

    v_batch := gen_random_uuid();
    update public.files fl
    set trashed_at = now(), trash_batch_id = v_batch, is_trash_root = true
    where fl.id = v_id;

    v_batches := v_batches || v_batch;
  end loop;

  return v_batches;
end $$;

revoke execute on function public.trash_items(uuid[], uuid[]) from public, anon;
grant execute on function public.trash_items(uuid[], uuid[]) to authenticated;


create or replace function public.restore_batch(p_batch_id uuid)
returns table (item_kind text, item_id uuid, final_name text, new_parent_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_kind text;
  v_root_id uuid;
  v_name text;
  v_parent uuid;
  v_target uuid;
  v_candidate text;
  v_try int := 0;
begin
  if v_uid is null then raise exception 'UNAUTHORIZED'; end if;

  -- lock every row in the batch (folders first, then files, always in id order)
  perform 1 from public.folders f
  where f.trash_batch_id = p_batch_id and f.owner_id = v_uid
  order by f.id for update;
  perform 1 from public.files fl
  where fl.trash_batch_id = p_batch_id and fl.owner_id = v_uid
  order by fl.id for update;

  -- find the batch root
  select 'folder', f.id, f.name, f.parent_id
    into v_kind, v_root_id, v_name, v_parent
  from public.folders f
  where f.trash_batch_id = p_batch_id and f.owner_id = v_uid and f.is_trash_root;

  if not found then
    select 'file', fl.id, fl.name, fl.folder_id
      into v_kind, v_root_id, v_name, v_parent
    from public.files fl
    where fl.trash_batch_id = p_batch_id and fl.owner_id = v_uid and fl.is_trash_root;

    if not found then raise exception 'NOT_FOUND'; end if;
  end if;

  -- original parent if it is live, otherwise the top level (null)
  v_target := null;
  if v_parent is not null then
    select f.id into v_target
    from public.folders f
    where f.id = v_parent and f.owner_id = v_uid and f.trashed_at is null
    for share;
  end if;

  -- restore the root, auto-renaming on a name clash
  v_candidate := public.next_available_name(v_target, v_name, v_kind);
  loop
    v_try := v_try + 1;
    begin
      if v_kind = 'folder' then
        update public.folders f
        set name = v_candidate, parent_id = v_target,
            trashed_at = null, trash_batch_id = null, is_trash_root = false
        where f.id = v_root_id;
      else
        update public.files fl
        set name = v_candidate, folder_id = v_target,
            trashed_at = null, trash_batch_id = null, is_trash_root = false
        where fl.id = v_root_id;
      end if;
      exit;
    exception when unique_violation then
      if v_try >= 10 then raise exception 'DUPLICATE_NAME'; end if;
      v_candidate := public.next_available_name(v_target, v_name, v_kind);
    end;
  end loop;

  -- restore everything else in the batch (names cannot clash inside the root)
  update public.folders f
  set trashed_at = null, trash_batch_id = null, is_trash_root = false
  where f.trash_batch_id = p_batch_id and f.owner_id = v_uid;

  update public.files fl
  set trashed_at = null, trash_batch_id = null, is_trash_root = false
  where fl.trash_batch_id = p_batch_id and fl.owner_id = v_uid;

  return query select v_kind, v_root_id, v_candidate, v_target;
end $$;

revoke execute on function public.restore_batch(uuid) from public, anon;
grant execute on function public.restore_batch(uuid) to authenticated;




-- Chunk 7d: move_items

create or replace function public.move_items(
  p_file_ids uuid[],
  p_folder_ids uuid[],
  p_target uuid
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_files uuid[];
  v_folders uuid[];
  v_id uuid;
  v_name text;
  v_parent uuid;
  v_trashed timestamptz;
  v_status public.upload_status;
  v_candidate text;
  v_try int;
  v_moved int := 0;
begin
  if v_uid is null then raise exception 'UNAUTHORIZED'; end if;

  if coalesce(cardinality(p_file_ids), 0) + coalesce(cardinality(p_folder_ids), 0) > 500 then
    raise exception 'TOO_MANY_IDS';
  end if;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_files
  from unnest(coalesce(p_file_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_folders
  from unnest(coalesce(p_folder_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  if cardinality(v_files) = 0 and cardinality(v_folders) = 0 then
    return 0;
  end if;

  -- folder moves run one at a time per user, so two moves can't create a loop
  if cardinality(v_folders) > 0 then
    perform pg_advisory_xact_lock(hashtextextended('move_items:' || v_uid::text, 0));
  end if;

  -- every id must exist, be yours, and be live (files must also be ready)
  if (select count(*) from public.folders f
      where f.id = any(v_folders) and f.owner_id = v_uid and f.trashed_at is null)
     <> cardinality(v_folders) then
    raise exception 'NOT_FOUND';
  end if;
  if (select count(*) from public.files fl
      where fl.id = any(v_files) and fl.owner_id = v_uid
        and fl.trashed_at is null and fl.status = 'ready')
     <> cardinality(v_files) then
    raise exception 'NOT_FOUND';
  end if;

  -- destination must be a live folder of yours (null = top level)
  if p_target is not null then
    select f.trashed_at into v_trashed
    from public.folders f
    where f.id = p_target and f.owner_id = v_uid
    for share;

    if not found then raise exception 'NOT_FOUND'; end if;
    if v_trashed is not null then raise exception 'PARENT_TRASHED'; end if;

    -- no moving a folder into itself or one of its own subfolders
    if cardinality(v_folders) > 0 then
      if exists (
        with recursive up(id, parent_id) as (
          select f.id, f.parent_id from public.folders f where f.id = p_target
          union all
          select f.id, f.parent_id from public.folders f join up on f.id = up.parent_id
        )
        select 1 from up where up.id = any(v_folders)
      ) then
        raise exception 'INVALID_TARGET';
      end if;
    end if;
  end if;

  -- move folders
  foreach v_id in array v_folders loop
    select f.name, f.parent_id, f.trashed_at into v_name, v_parent, v_trashed
    from public.folders f
    where f.id = v_id and f.owner_id = v_uid
    for update;

    if not found or v_trashed is not null then raise exception 'NOT_FOUND'; end if;
    if v_parent is not distinct from p_target then continue; end if;

    v_try := 0;
    v_candidate := public.next_available_name(p_target, v_name, 'folder');
    loop
      v_try := v_try + 1;
      begin
        update public.folders f
        set parent_id = p_target, name = v_candidate
        where f.id = v_id;
        exit;
      exception when unique_violation then
        if v_try >= 10 then raise exception 'DUPLICATE_NAME'; end if;
        v_candidate := public.next_available_name(p_target, v_name, 'folder');
      end;
    end loop;
    v_moved := v_moved + 1;
  end loop;

  -- move files
  foreach v_id in array v_files loop
    select fl.name, fl.folder_id, fl.trashed_at, fl.status
      into v_name, v_parent, v_trashed, v_status
    from public.files fl
    where fl.id = v_id and fl.owner_id = v_uid
    for update;

    if not found or v_trashed is not null or v_status <> 'ready' then
      raise exception 'NOT_FOUND';
    end if;
    if v_parent is not distinct from p_target then continue; end if;

    v_try := 0;
    v_candidate := public.next_available_name(p_target, v_name, 'file');
    loop
      v_try := v_try + 1;
      begin
        update public.files fl
        set folder_id = p_target, name = v_candidate
        where fl.id = v_id;
        exit;
      exception when unique_violation then
        if v_try >= 10 then raise exception 'DUPLICATE_NAME'; end if;
        v_candidate := public.next_available_name(p_target, v_name, 'file');
      end;
    end loop;
    v_moved := v_moved + 1;
  end loop;

  return v_moved;
end $$;

revoke execute on function public.move_items(uuid[], uuid[], uuid) from public, anon;
grant execute on function public.move_items(uuid[], uuid[], uuid) to authenticated;



-- Chunk 7e: collect_subtree_files, delete_item_rows

create or replace function public.collect_subtree_files(p_file_ids uuid[], p_folder_ids uuid[])
returns table (file_id uuid, storage_path text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_files uuid[];
  v_folders uuid[];
begin
  if v_uid is null then raise exception 'UNAUTHORIZED'; end if;

  if coalesce(cardinality(p_file_ids), 0) + coalesce(cardinality(p_folder_ids), 0) > 500 then
    raise exception 'TOO_MANY_IDS';
  end if;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_files
  from unnest(coalesce(p_file_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_folders
  from unnest(coalesce(p_folder_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  if cardinality(v_files) = 0 and cardinality(v_folders) = 0 then
    return;
  end if;

  -- only your own trash roots can be named
  if (select count(*) from public.folders f
      where f.id = any(v_folders) and f.owner_id = v_uid
        and f.trashed_at is not null and f.is_trash_root)
     <> cardinality(v_folders) then
    raise exception 'NOT_FOUND';
  end if;
  if (select count(*) from public.files fl
      where fl.id = any(v_files) and fl.owner_id = v_uid
        and fl.trashed_at is not null and fl.is_trash_root)
     <> cardinality(v_files) then
    raise exception 'NOT_FOUND';
  end if;

  -- every file under the named roots, ignoring trash batches (R6)
  return query
  with recursive tree(id) as (
    select f.id from public.folders f
    where f.id = any(v_folders) and f.owner_id = v_uid
    union all
    select c.id from public.folders c
    join tree on c.parent_id = tree.id
    where c.owner_id = v_uid
  )
  select fl.id, fl.storage_path
  from public.files fl
  where fl.owner_id = v_uid
    and (fl.id = any(v_files) or fl.folder_id in (select tree.id from tree))
  order by fl.id
  limit 1000;
end $$;

revoke execute on function public.collect_subtree_files(uuid[], uuid[]) from public, anon;
grant execute on function public.collect_subtree_files(uuid[], uuid[]) to authenticated;


create or replace function public.delete_item_rows(p_file_ids uuid[], p_folder_ids uuid[])
returns table (files_deleted integer, folders_deleted integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_files uuid[];
  v_folders uuid[];
  v_id uuid;
  v_trashed timestamptz;
  v_n int;
  v_files_deleted int := 0;
  v_folders_deleted int := 0;
begin
  if v_uid is null then raise exception 'UNAUTHORIZED'; end if;

  if coalesce(cardinality(p_file_ids), 0) + coalesce(cardinality(p_folder_ids), 0) > 500 then
    raise exception 'TOO_MANY_IDS';
  end if;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_files
  from unnest(coalesce(p_file_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  select coalesce(array_agg(distinct t.x order by t.x), '{}'::uuid[]) into v_folders
  from unnest(coalesce(p_folder_ids, '{}'::uuid[])) as t(x) where t.x is not null;

  -- files first: only your own trashed rows; quota is released by the delete trigger
  if cardinality(v_files) > 0 then
    delete from public.files fl
    where fl.id = any(v_files) and fl.owner_id = v_uid and fl.trashed_at is not null;
    get diagnostics v_files_deleted = row_count;
  end if;

  -- then folders: only trashed ones with no file rows left anywhere beneath them
  foreach v_id in array v_folders loop
    select f.trashed_at into v_trashed
    from public.folders f
    where f.id = v_id and f.owner_id = v_uid
    for update;

    if not found or v_trashed is null then continue; end if;

    if exists (
      with recursive tree(id) as (
        select f.id from public.folders f where f.id = v_id
        union all
        select c.id from public.folders c join tree on c.parent_id = tree.id
      )
      select 1 from public.files fl where fl.folder_id in (select tree.id from tree)
    ) then
      continue;
    end if;

    delete from public.folders f where f.id = v_id and f.owner_id = v_uid;
    get diagnostics v_n = row_count;
    v_folders_deleted := v_folders_deleted + v_n;
  end loop;

  return query select v_files_deleted, v_folders_deleted;
end $$;

revoke execute on function public.delete_item_rows(uuid[], uuid[]) from public, anon;
grant execute on function public.delete_item_rows(uuid[], uuid[]) to authenticated;




-- Chunk 7f: get_breadcrumbs, search_items

create or replace function public.get_breadcrumbs(p_folder_id uuid)
returns table (id uuid, name text, depth integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'UNAUTHORIZED'; end if;
  if p_folder_id is null then return; end if;

  if not exists (
    select 1 from public.folders f
    where f.id = p_folder_id and f.owner_id = v_uid and f.trashed_at is null
  ) then
    raise exception 'NOT_FOUND';
  end if;

  return query
  with recursive up(fid, fname, fparent, lvl) as (
    select f.id, f.name, f.parent_id, 0
    from public.folders f
    where f.id = p_folder_id and f.owner_id = v_uid
    union all
    select f.id, f.name, f.parent_id, up.lvl + 1
    from public.folders f
    join up on f.id = up.fparent
    where f.owner_id = v_uid
  )
  select up.fid, up.fname, (max(up.lvl) over () - up.lvl)::integer
  from up
  order by up.lvl desc;
end $$;

revoke execute on function public.get_breadcrumbs(uuid) from public, anon;
grant execute on function public.get_breadcrumbs(uuid) to authenticated;


create or replace function public.search_items(p_q text)
returns table (
  item_kind text,
  item_id uuid,
  item_name text,
  parent_id uuid,
  parent_path text,
  mime_type text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_q text;
  v_escaped text;
  v_pattern text;
  v_prefix text;
begin
  if v_uid is null then raise exception 'UNAUTHORIZED'; end if;

  v_q := lower(btrim(coalesce(p_q, '')));
  if char_length(v_q) < 3 then return; end if;

  v_escaped := replace(replace(replace(v_q, '\', '\\'), '%', '\%'), '_', '\_');
  v_pattern := '%' || v_escaped || '%';
  v_prefix := v_escaped || '%';

  return query
  with matches as (
    select 'folder'::text as mkind, f.id as mid, f.name as mname,
           f.parent_id as mparent, null::text as mmime
    from public.folders f
    where f.owner_id = v_uid and f.trashed_at is null
      and lower(f.name) like v_pattern escape '\'
    union all
    select 'file'::text, fl.id, fl.name, fl.folder_id, fl.mime_type
    from public.files fl
    where fl.owner_id = v_uid and fl.trashed_at is null and fl.status = 'ready'
      and lower(fl.name) like v_pattern escape '\'
  ),
  ranked as (
    select m.*,
           row_number() over (
             order by (lower(m.mname) like v_prefix escape '\') desc,
                      char_length(m.mname), lower(m.mname), m.mid
           ) as rn
    from matches m
  )
  select r.mkind, r.mid, r.mname, r.mparent, coalesce(p.path, ''), r.mmime
  from ranked r
  left join lateral (
    with recursive up(fid, fname, fparent, lvl) as (
      select f.id, f.name, f.parent_id, 0
      from public.folders f
      where f.id = r.mparent and f.owner_id = v_uid
      union all
      select f.id, f.name, f.parent_id, up.lvl + 1
      from public.folders f
      join up on f.id = up.fparent
      where f.owner_id = v_uid
    )
    select string_agg(up.fname, ' / ' order by up.lvl desc) as path from up
  ) p on true
  where r.rn <= 50
  order by r.rn;
end $$;

revoke execute on function public.search_items(text) from public, anon;
grant execute on function public.search_items(text) to authenticated;
