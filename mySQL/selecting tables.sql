USE loadout_app;
SELECT username, created_at, last_login_at FROM `users` order by `last_login_at` DESC; -- get users
SELECT * FROM `loadouts` WHERE `parent_id` IS NULL; -- get all top level loadouts
SELECT * FROM `xref_user_loadouts`;
SELECT * FROM `loadouts`;
SELECT * FROM users;