-- insert my data into users DONE
INSERT INTO `users` (
	`id`,
    `email`,
    `password`,
    `created_at`
)
VALUES (
   '84fbbb78-b2a2-11ea-b3de-0242ac130004',
   'chris@gmail.com',
   '6B34FE24AC2FF8103F6FCE1F0DA2EF57',
   1592622759657
),
(
   '186774df-6dd0-425f-9b86-a1c95cbbdb10',
   'mike@gmail.com',
   '18126E7BD3F84B3F3E4DF094DEF5B7DE',
   1592886218911
),
(
   'a7f1132e-5f08-48ef-b792-30e27b7b5215',
   'tina@gmail.com',
   'EF2AFE0EA76C76B6B4B1EE92864C4D5C',
   1593103713607
);

-- show the data table
SELECT * FROM `users`