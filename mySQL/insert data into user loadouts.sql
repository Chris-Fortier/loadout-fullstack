-- insert my data into user loadouts DONE
INSERT INTO `xref_user_loadouts` (
	`id`,
    `user_id`,
    `loadout_id`,
    `can_edit`,
    `can_pack`,
    `is_admin`
)
VALUES (
   '5482d8fc-6e63-4d1d-a6ee-b82344507b52',
   '84fbbb78-b2a2-11ea-b3de-0242ac130004',
   '42655170-7e10-4431-8d98-c2774f6414a4',
   1,
   1,
   1
),
(
   '31a80063-0693-4ce2-8a14-e35cfdf91a55',
   'a7f1132e-5f08-48ef-b792-30e27b7b5215',
   '42655170-7e10-4431-8d98-c2774f6414a4',
   1,
   1,
   0
),
(
   'b219ee94-c18f-43f8-99c2-05c50ddeabb7',
   '186774df-6dd0-425f-9b86-a1c95cbbdb10',
   '42655170-7e10-4431-8d98-c2774f6414a4',
   0,
   0,
   0
),
(
   '691f4b4f-6842-4faf-a8ab-ba60d571f6df',
   '84fbbb78-b2a2-11ea-b3de-0242ac130004',
   'e0364b00-f7fc-469c-ab82-8de3487bcc0b',
   1,
   1,
   1
),
(
   '6d0834c4-ea69-4142-802d-52bb70351769',
   '186774df-6dd0-425f-9b86-a1c95cbbdb10',
   'e0364b00-f7fc-469c-ab82-8de3487bcc0b',
   0,
   0,
   0
);


-- show the data table
SELECT * FROM `xref_user_loadouts`