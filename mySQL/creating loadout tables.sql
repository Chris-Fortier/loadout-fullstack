SHOW DATABASES;

-- select the line or a line within a group of lines then hit ctrl enter to execute

-- run this to create the database (usually only needs to be done once per app)
CREATE DATABASE loadout_app;

-- run this to select this database to work with it
USE loadout_app;

-- create the users table DONE
CREATE TABLE users(
	`id` CHAR(36) PRIMARY KEY, /* fixed length of string uuid */
    `email` VARCHAR(320) NOT NULL, /* 320 is the longest possible email address */
    `password` VARCHAR(128) NOT NULL, /* hashed password, 128 is to future proof if we want to use 128-character hashes */
    `created_at` BIGINT UNSIGNED NOT NULL/* must be snake case as SQL is not case sensitive */
);

-- create loadouts table DONE
CREATE TABLE `loadouts`(
	`id` CHAR(36) PRIMARY KEY, /* fixed length of string uuid */
	`name` VARCHAR(64) NOT NULL, -- name of the loadout
	`created_at` BIGINT UNSIGNED NOT NULL, -- when the loadout was created
	`last_edit_at` BIGINT UNSIGNED NOT NULL, -- time the loadout was last edited
	`last_pack_at` BIGINT UNSIGNED NOT NULL, -- time the loadout was last packed/unpacked
	`creator_id` CHAR(36) NOT NULL, -- foreign key, user who created the loadout
    CONSTRAINT `fk_loadout_creator_id`
		FOREIGN KEY (`creator_id`) --  the key in this table
        REFERENCES `users`(`id`) --  the key in the other table
        ON UPDATE CASCADE -- makes it so if the id is updated, it will update wherever it was referenced
        ON DELETE RESTRICT
);

-- this deletes the loadouts table
-- DROP TABLE `loadouts`;


-- create user_loadouts table DONE
-- this is a bridge table that defines which loadouts a user has access to
CREATE TABLE `xref_user_loadouts`(
	`id` CHAR(36) PRIMARY KEY, /* fixed length of string uuid */
	`user_id` CHAR(36) NOT NULL, -- foreign key, user
	`loadout_id` CHAR(36) NOT NULL, -- foreign key, loadout
	`can_edit` TINYINT(1) NOT NULL, -- whether this user has edit priveliges on this loadout
	`can_pack` TINYINT(1) NOT NULL, -- whether this user has packing priveliges on this loadout
	`is_admin` TINYINT(1) NOT NULL, -- can rename, delete, share, unshare, assign priveledges, etc.
    CONSTRAINT `fk_xref_user_loadouts_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_xref_user_loadouts_loadout` FOREIGN KEY (`loadout_id`)
        REFERENCES `loadouts` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
-- I got warnings when creating this table


-- create the gear table DONE
CREATE TABLE `gear`(

	`id` CHAR(36) PRIMARY KEY, /* fixed length of string uuid */
	`name` VARCHAR(64) NOT NULL, -- name of the loadout
	`parent_id` CHAR(36) NOT NULL, -- foreign key, the parent piece of gear, or a loadout if top level
	`is_packed` TINYINT(1) NOT NULL -- whether this item is currently packed
--     CONSTRAINT `fk_xref_gear_parent_id` FOREIGN KEY (`parent_id`)
--         REFERENCES `gear` (`id`), -- can we do a self reference?
--         `loadouts` (`id`) -- multiple references?
--         ON UPDATE CASCADE ON DELETE RESTRICT

);
-- I got warnings when creating this table
-- DROP TABLE `gear`;




-- this shows a list of all the tables
SHOW TABLES;

DESC `users`;