-- finds the details and derived details of a given item

-- helper queries
USE `loadout_app`;
SELECT * FROM `users`;
SELECT * FROM `loadouts`;

-- get an item from an id
SELECT 
    `loadouts`.`name`,
    `loadouts`.`status`,
    `loadouts`.`id`,
    `loadouts`.`parent_id`
FROM
    `loadouts`
WHERE
    `loadouts`.`id` = '41b9bde9-4731-44d2-b471-d46d21aca680'; -- day pack
    
-- count the number of items an item contains
SELECT
	COUNT(`loadouts`.`id`) AS `num_children` FROM `loadouts`
WHERE
    `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680'; -- day pack

-- count the number of unpacked items an item contains
SELECT
	COUNT(`loadouts`.`id`) AS `num_packed_children` FROM `loadouts`
WHERE
    `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680' -- day pack
    AND `loadouts`.`status` = 0;
    
-- get the name of the parent item
SELECT 
    `loadouts`.`name` AS `parent_name`
FROM
    `loadouts`
WHERE
	`loadouts`.`id` = '42655170-7e10-4431-8d98-c2774f6414a4'; -- day pack's parent
    
-- get the name of the parent item when given the item is instead of parent id
SELECT 
    `loadouts`.`name` AS `parent_name`
FROM
    `loadouts`
WHERE
	`loadouts`.`id` = '42655170-7e10-4431-8d98-c2774f6414a4'; -- day pack's parent
    
SELECT
    `parent_loadouts`.`name` AS `parent_name`,
    `loadouts`.`name` AS `name`
FROM
    `loadouts` AS `parent_loadouts`
        INNER JOIN
    `loadouts` ON `parent_loadouts`.`id` = `loadouts`.`parent_id`
WHERE
	`loadouts`.`id` = '41b9bde9-4731-44d2-b471-d46d21aca680';
    
-- all the above at once
SELECT 
    (SELECT 
            `loadouts`.`name`
        FROM
            `loadouts`
        WHERE
            `loadouts`.`id` = '41b9bde9-4731-44d2-b471-d46d21aca680') AS `name`,
    (SELECT 
            `loadouts`.`status`
        FROM
            `loadouts`
        WHERE
            `loadouts`.`id` = '41b9bde9-4731-44d2-b471-d46d21aca680') AS `status`,
    (SELECT 
            `loadouts`.`id`
        FROM
            `loadouts`
        WHERE
            `loadouts`.`id` = '41b9bde9-4731-44d2-b471-d46d21aca680') AS `id`,
    (SELECT 
            `parent_loadouts`.`name`
        FROM
            `loadouts` AS `parent_loadouts`
                INNER JOIN
            `loadouts` ON `parent_loadouts`.`id` = `loadouts`.`parent_id`
        WHERE
            `loadouts`.`id` = '41b9bde9-4731-44d2-b471-d46d21aca680') AS `parent_name`,
    (SELECT 
            COUNT(`loadouts`.`id`)
        FROM
            `loadouts`
        WHERE
            `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680') AS `num_children`,
    (SELECT 
            COUNT(`loadouts`.`id`)
        FROM
            `loadouts`
        WHERE
            `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680'
                AND `loadouts`.`status` = 0) AS `num_packed_children`
	