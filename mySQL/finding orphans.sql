SELECT * FROM loadouts;

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
RIGHT JOIN xref_user_loadouts ON xref_user_loadouts.loadout_id = loadouts.id

