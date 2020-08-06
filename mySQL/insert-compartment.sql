SELECT * FROM loadouts;


-- count all the child compartments of an item
SELECT count(*) AS num_compartments FROM loadouts
WHERE
    (`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680') -- origin: day pack
AND `status` = 4; -- only count compartments

-- if there are 0 compartments
-- move all the child items of an item to a new item
UPDATE `loadout_app`.`loadouts` 
SET 
    `parent_id` = '0aceeaf2-31dc-4635-b50d-9c00a6eb2a83' -- destination: new compartment
WHERE
    (`parent_id` = '41b9bde9-4731-44d2-b471-d46d21aca680') -- origin: day pack
AND `status` != 4; -- do not move compartments
