SELECT * FROM users;
SELECT * FROM xref_user_loadouts;
SELECT * FROM loadouts;

SELECT can_edit, can_pack, is_admin FROM xref_user_loadouts
WHERE xref_user_loadouts.user_id = 'a7ce95c7-d9ca-4788-912e-a4e91b7f7e66'
AND xref_user_loadouts.loadout_id = '244331be-05f0-4dd5-ad8e-dc279a74d2aa'
LIMIT 1