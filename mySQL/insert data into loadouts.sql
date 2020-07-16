-- insert my data into loadouts DONE
INSERT INTO `loadouts` (
	`id`,
    `name`,
    `created_at`,
    `last_edit_at`,
    `last_pack_at`,
    `parent_id`,
    `status`
)
VALUES (
   '42655170-7e10-4431-8d98-c2774f6414a4',
   'One-Night Camping Trip',
   1592939977877,
   1592940077877,
   1592940177877,
   NULL,
   0
),
(
   'e0364b00-f7fc-469c-ab82-8de3487bcc0b',
   'Day at Punchcode',
   1592940277877,
   1592940377877,
   1592940477877,
   NULL,
   0
);

-- show the data table
SELECT * FROM `loadouts`