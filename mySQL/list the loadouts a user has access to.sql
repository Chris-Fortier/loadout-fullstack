-- List all the loadouts chris@gmail.com (84fbbb78-b2a2-11ea-b3de-0242ac130004) has access to (in order to display his Loadouts menu) DONE

USE loadout_app;

-- these just show the data we can use
SELECT * FROM `users`;
SELECT * FROM `loadouts`;
SELECT * FROM `xref_user_loadouts`;

-- current version
SELECT 
    `users`.`email`,
    `loadouts`.`name` AS `loadout_name`,
    can_edit,
    can_pack,
    is_admin,
    loadouts.id AS loadout_id
FROM
    `users`
        INNER JOIN
    `xref_user_loadouts` ON `user_id` = `users`.`id`
        INNER JOIN
    `loadouts` ON `loadouts`.`id` = `xref_user_loadouts`.`loadout_id`
WHERE
    `users`.`id` = '0e3e3882-1264-467c-94bf-f9850b7edbd4'
    
