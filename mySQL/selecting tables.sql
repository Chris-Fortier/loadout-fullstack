USE loadout_app;
SELECT * FROM `users`;
SELECT * FROM `loadouts` WHERE `parent_id` IS NULL; -- get all top level loadouts
SELECT * FROM `xref_user_loadouts`;