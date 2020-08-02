
SELECT * FROM loadouts;
SELECT * FROM users;

-- get the permissions a given user has for a given item
-- this will find the root node, then join it with the xref user loadout associated with the given user

SELECT can_pack, can_edit, is_admin FROM (

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
SELECT * FROM loadouts_path WHERE parent_id IS null) AS root_node
INNER JOIN (SELECT * FROM xref_user_loadouts WHERE user_id = '0e3e3882-1264-467c-94bf-f9850b7edbd4') AS permissions ON root_node.id = permissions.loadout_id;