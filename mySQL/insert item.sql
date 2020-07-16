-- create an item
SELECT * FROM `loadouts`WHERE
    `id` = '0674f34b-f0d8-4eac-bbc1-213d37acdf3f';

INSERT INTO `users` (
	`id`,
    `email`,
    `password`,
    `created_at`
)
VALUES (
	'6eb4cf5f-f8d8-4e7c-9663-764438da6e18',
	'mike@gmail.com',
	'replace_me',
	1591840193000
)