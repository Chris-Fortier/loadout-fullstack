-- https://www.mysqltutorial.org/mysql-adjacency-list-tree/
-- To query a single path from bottom to top e.g., from iOS to Electronics, you use the following statement:

SELECT * FROM loadouts;

WITH RECURSIVE loadouts_path (id, `name`, parent_id) AS
(
  SELECT id, `name`, parent_id
    FROM loadouts
    WHERE id = '5155398c-7974-498a-a098-70bd63f8b207' -- child node (ibuprofen)
  UNION ALL
  SELECT l.id, l.`name`, l.parent_id
    FROM loadouts_path AS lp JOIN loadouts AS l
      ON lp.parent_id = l.id
)
SELECT * FROM loadouts_path;