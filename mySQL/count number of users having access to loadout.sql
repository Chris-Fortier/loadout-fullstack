
SELECT * FROM xref_user_loadouts;
SELECT * FROM users;
SELECT * FROM loadouts;

-- count the users that have access to each loadout
SELECT 
    xref_user_loadouts.loadout_id, COUNT(*) AS num_users
FROM
    xref_user_loadouts
GROUP BY xref_user_loadouts.loadout_id;

-- fancer user loadouts query with more data
SELECT 
    xref_user_loadouts.loadout_id,
    can_edit,can_pack,is_admin,
    num_children, num_packed,
    loadouts.`name`
FROM
    (SELECT 
        loadouts.parent_id,
        COUNT(*) AS num_children,
        SUM(case when `status` = 1 then 1 else 0 end) AS num_packed
    FROM
        loadouts
    GROUP BY loadouts.parent_id) AS children_counts
        RIGHT JOIN
    xref_user_loadouts ON children_counts.parent_id = xref_user_loadouts.loadout_id
    INNER JOIN
    loadouts ON loadout_id = loadouts.id
WHERE
    xref_user_loadouts.user_id = '0e3e3882-1264-467c-94bf-f9850b7edbd4';