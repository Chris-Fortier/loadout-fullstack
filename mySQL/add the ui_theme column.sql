-- add a new column for user preference of color themes
ALTER TABLE users ADD COLUMN ui_theme TINYINT NOT NULL DEFAULT 0;

SELECT * FROM users;