USE loadout_app;

SELECT * FROM xref_user_loadouts;
SELECT * FROM users;




-- so i can see the bridge table
SELECT 
    users.email,
    loadouts.name AS loadout_name,
    xref_user_loadouts.can_edit,
    xref_user_loadouts.can_pack,
    xref_user_loadouts.is_admin,
    xref_user_loadouts.user_id,
    xref_user_loadouts.loadout_id
FROM
    users
        INNER JOIN
    xref_user_loadouts ON user_id = users.id
        INNER JOIN
    loadouts ON loadouts.id = xref_user_loadouts.loadout_id;
    
INSERT INTO `loadout_app`.`xref_user_loadouts`
(`id`,
`user_id`,
`loadout_id`,
`can_edit`,
`can_pack`)
VALUES
('sdf',
'e3681c20-dba5-4685-ac73-aec88f8daa50',
'e3681c20-dba5-4685-ac73-aec88f8daa50',
'1',
'1');



SELECT 
      *
   FROM
      xref_user_loadouts
   WHERE
      user_id = '0e3e3882-1264-467c-94bf-f9850b7edbd4' AND
      loadout_id = '42655170-7e10-4431-8d98-c2774f6414a4'
   LIMIT 1;