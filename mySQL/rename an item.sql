-- rename an item
USE `loadout_app`;
SELECT * FROM `loadouts`;

UPDATE `loadout_app`.`loadouts` 
SET 
    `name` = 'sleepwear3'
WHERE
    (`id` = '0674f34b-f0d8-4eac-bbc1-213d37acdf3f');


SELECT * FROM `loadouts`
WHERE
    (`id` = '0674f34b-f0d8-4eac-bbc1-213d37acdf3f');