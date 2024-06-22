# skillsync-suprema

## Supabase Documentation

### Authentication:

When a user creates an account they get a user ID in the auth.users table. This table is read-only so we cant add user data to it.
For user data there is a trigger attached to the auth.users table that adds the user to the `public.user_profiles` table. This copies over the user_id as a foreign key and the user's email and the users name, if it was specified in the sign in metadata.
```
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

We also need a way to differentiate users that have confirmed their email and users who have not. For this we have another trigger in on the auth.users table to check for the `auth.users.email_confirmed_at` value being updated. When it is then we set the `public.user_profiles.email_confimed` to true.
```
create or replace function public.update_email_confirmation()
returns trigger as $$
begin
  if new.email_confirmed_at is not null and 
  old.email_confirmed_at is null then 
    update public.user_profiles set email_confirmed = true
    where public.user_profiles.id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger email_confirmed_trigger
  after update of email_confirmed_at on auth.users
  for each row execute procedure public.update_email_confirmation()
```

### Profile Pictures:
Profile Pictures are stored in the `avatars` bucket. To give a user a profile picture you update the users public.`user_profiles.avatar_url` to the filename of their PFP.

### Tables:

**user_profiles**

`name`: (string) user's name

`email`: (string) user's email. Is not currently synced with `auth.users.email` this should be fixed.

`location`: (string) user's location

`school`: (string) user's school

`grad_year`: (string) user's grad year

`program`: (string) user's school program

`specialization`: (string) user's school specialization

`industry`: (string) user's industry

`skill_sets`: (jsonb) a JSON list of string containing the user's skills (Supabase handles conversion to/from JSONB so we treat it like JSON)

`linkedin`: (string) a link to the user's linkedin

`github`: (string) a link to the user's github

`work_eligibility`: (jsonb) a JSON list of strings containing the countries the user is eligible to work from (Supabase handles conversion to/from JSONB so we treat it like JSON)

`date_of_birth`: (string) the birth date of the user in DD/MM/YYYY format

`gender`: (string) the gender of the user

`race`: (string) the race of the user

`email_confirmed`: (bool) whether or not the user confirmed their email

`avatar_url`: the filename of the user's avatar. The actual avatar is stored in the `avatars` bucket