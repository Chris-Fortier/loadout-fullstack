-- finds the items inside of a parent item and sorts them by packed status and then by name

USE `loadout_app`;
SELECT * FROM `users`;
SELECT * FROM `loadouts`;

-- get the items inside of a given parent item
SELECT 
    `loadouts`.`name`,
    `loadouts`.`status`
FROM
    `loadouts`
WHERE
    `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680' -- day pack
ORDER BY
	`loadouts`.`status` ASC, -- put packed on bottom
    `loadouts`.`name` ASC; -- then sort A-Z on name
    
-- get the number of unpacked children for a given item
SELECT 
    COUNT(`loadouts`.`id`) AS `num_packed_children`
FROM
    `loadouts`
WHERE
    `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680'
        AND `loadouts`.`status` = 0;
        
--
SELECT 
    COUNT(`loadouts`.`id`) AS `num_packed_children`
FROM
    `loadouts` AS `parent_loadouts`
        INNER JOIN
    `loadouts` ON `parent_loadouts`.`id` = `loadouts`.`parent_id`
WHERE
    `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680'
        AND `loadouts`.`status` = 0;
        
-- returns counts of all the unpacked subitems for a given item
SELECT 
    `loadouts`.`parent_id`, COUNT(*) AS `count`
FROM
    `loadouts`
WHERE
    `loadouts`.`status` = 0
GROUP BY `loadouts`.`parent_id`;

-- gets all the children of a given item with their counts of their children
SELECT 
    `num_children`,
    `loadouts`.`name`,
    `loadouts`.`id`,
    `loadouts`.`status`
FROM
    (SELECT 
        `loadouts`.`parent_id`, IFNULL(COUNT(*),1) AS `num_children`
    FROM
        `loadouts`
    GROUP BY `loadouts`.`parent_id`) AS `counts`
        RIGHT JOIN -- right join makes it use all items in the loadout and joins them where they have counts
    `loadouts` ON `counts`.`parent_id` = `loadouts`.`id`
        WHERE
        -- `loadouts`.`status` = 1
        `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680';

-- WHERE
--    `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680';
    
-- get the items inside of a given parent item and include counts of unpacked descendants
SELECT 
    `loadouts`.`name`,
    `loadouts`.`status`
FROM
    `loadouts`
WHERE
    `loadouts`.`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680'; -- day pack


-- gets number of child for each item within a parent item
SELECT 
      loadouts.name,
      loadouts.status,
      loadouts.id,
      num_children
   FROM
      (SELECT loadouts.parent_id, IFNULL(COUNT(*),1) AS num_children FROM loadouts GROUP BY loadouts.parent_id) AS counts
   RIGHT JOIN
      loadouts ON counts.parent_id = loadouts.id
   WHERE
      loadouts.parent_id = '41b9bde9-4731-44d2-b471-d46d21aca680';