USE loadout_app;
SELECT * FROM `users` order by `last_login_at` DESC;
SELECT * FROM `loadouts` WHERE `parent_id` IS NULL; -- get all top level loadouts
SELECT * FROM `xref_user_loadouts`;
SELECT * FROM `loadouts`;