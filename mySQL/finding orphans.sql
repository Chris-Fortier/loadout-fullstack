USE loadout_app;
SELECT * FROM loadouts;
SELECT * FROM users;
SELECT * FROM loadouts WHERE loadouts.parent_id IS NULL;

-- find orphaned items (items with a parent that does not exist)
-- not working yet
SELECT
	parent_name,
    loadouts.name
FROM
	(SELECT
		loadouts.name AS parent_name, id
	FROM loadouts) AS parents
RIGHT JOIN loadouts ON loadouts.parent_id = parents.id
RIGHT JOIN xref_user_loadouts ON xref_user_loadouts.loadout_id = loadouts.id;

-- orphaned loadouts (xref_user_loadouts with no loadouts)
-- not done
SELECT * FROM loadouts
RIGHT JOIN xref_user_loadouts ON xref_user_loadouts.loadout_id = loadouts.id;

-- orphaned xref_user_loadouts (xref_user_loadouts with no users)
SELECT * FROM users
RIGHT JOIN xref_user_loadouts ON xref_user_loadouts.user_id = users.id;

-- orphaned xref_user_loadouts (xref_user_loadouts with no loadouts)
SELECT * FROM loadouts
RIGHT JOIN xref_user_loadouts ON xref_user_loadouts.loadout_id = loadouts.id;


-- this query gets all "subitems" (not not level loadouts)
SELECT * FROM loadouts WHERE parent_id IS NOT NULL;

-- find orphaned items (items with a parent that does not exist)
-- works!
SELECT
	parent_name,
    subitems.name,
    subitems.created_at
FROM
	(SELECT
		loadouts.name AS parent_name, id
	FROM loadouts) AS parents
RIGHT JOIN (SELECT * FROM loadouts WHERE parent_id IS NOT NULL) AS subitems
	ON subitems.parent_id = parents.id
WHERE parent_name IS NULL;

-- find orphaned loadouts (top level loadouts that can be shared)
-- loadout with no user loadouts
-- WIP
SELECT
	parent_name,
    subitems.name,
    subitems.created_at
FROM
	(SELECT
		loadouts.name AS parent_name, id
	FROM xref_user_loadouts)
RIGHT JOIN (SELECT * FROM loadouts WHERE parent_id IS NOT NULL) AS subitems
	ON subitems.parent_id = parents.id
WHERE parent_name IS NULL