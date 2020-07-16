-- Who are all the users that have acces to One-Night Camping Trip (42655170-7e10-4431-8d98-c2774f6414a4)? DONE




-- these just show the data we can use
SELECT * FROM `loadouts`;
SELECT 
    *
FROM
    `xref_user_loadouts`;

-- this is what columns you want in your join table
SELECT
    `users`.`email`,
    `loadouts`.`name` AS `loadout_name`,
    `xref_user_loadouts`.`can_edit`,
    `xref_user_loadouts`.`can_pack`,
    `xref_user_loadouts`.`is_admin`
FROM
    `users`
        INNER JOIN
    `xref_user_loadouts` ON `user_id` = `users`.`id`
        INNER JOIN
    `loadouts` ON `loadouts`.`id` = `xref_user_loadouts`.`loadout_id`
WHERE
	`loadouts`.`id` = '42655170-7e10-4431-8d98-c2774f6414a4'