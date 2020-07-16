-- unpack an item
SELECT * FROM `loadouts`WHERE
    `id` = '0674f34b-f0d8-4eac-bbc1-213d37acdf3f';

UPDATE `loadout_app`.`loadouts` 
SET 
    `status` = 0,
    `last_pack_at` = 123
WHERE
    (`id` = '0674f34b-f0d8-4eac-bbc1-213d37acdf3f');
