USE `loadout`;
SELECT * FROM `users`;

-- a log in
SELECT 
    `users`.`id`
FROM
    `users`
WHERE
    `users`.`email` = 'chris@gmail.com'
        AND `users`.`password` = '6B34FE24AC2FF8103F6FCE1F0DA2EF57';
