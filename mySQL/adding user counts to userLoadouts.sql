USE loadout_app;
SELECT * FROM users;
SELECT * FROM loadouts;
SELECT * FROM xref_user_loadouts;


-- main one
SELECT 
    xref_user_loadouts.loadout_id,
    can_edit,
    can_pack,
    is_admin,
    num_children,
    num_packed,
    num_users,
    loadouts.`name`
FROM
    (SELECT 
        loadouts.parent_id,
            loadouts.id AS loadout_id,
            COUNT(*) AS num_children,
            SUM(CASE
                WHEN `status` = 1 THEN 1
                ELSE 0
            END) AS num_packed
    FROM
        loadouts
    GROUP BY loadouts.parent_id) AS children_counts
        RIGHT JOIN
    (SELECT 
        xref_user_loadouts.loadout_id, COUNT(*) AS num_users
    FROM
        xref_user_loadouts
    GROUP BY xref_user_loadouts.loadout_id) AS user_counts ON user_counts.loadout_id = children_counts.parent_id
        RIGHT JOIN
    xref_user_loadouts ON user_counts.loadout_id = xref_user_loadouts.loadout_id
        INNER JOIN
    loadouts ON xref_user_loadouts.loadout_id = loadouts.id
WHERE
    xref_user_loadouts.user_id = '0e3e3882-1264-467c-94bf-f9850b7edbd4';


-- first part (children_counts)
SELECT 
	 loadouts.parent_id,
     loadouts.id AS loadout_id,
	 COUNT(*) AS num_children,
	 SUM(case when `status` = 1 then 1 else 0 end) AS num_packed
  FROM
	 loadouts
  GROUP BY loadouts.parent_id;

-- second part (user_counts)
SELECT 
	xref_user_loadouts.loadout_id,
	 COUNT(*) AS num_users
  FROM
	 xref_user_loadouts
  GROUP BY xref_user_loadouts.loadout_id;
  
-- testing (2nd two parts only)
  SELECT 
  xref_user_loadouts.loadout_id,
  can_edit,can_pack,is_admin,
  num_users,
  loadouts.`name`
FROM
  (SELECT 
	xref_user_loadouts.loadout_id,
	 COUNT(*) AS num_users
  FROM
	 xref_user_loadouts
  GROUP BY xref_user_loadouts.loadout_id) AS user_counts
  
	 RIGHT JOIN
  xref_user_loadouts ON user_counts.loadout_id = xref_user_loadouts.loadout_id
  INNER JOIN
  loadouts ON xref_user_loadouts.loadout_id = loadouts.id
WHERE
  xref_user_loadouts.user_id = '0e3e3882-1264-467c-94bf-f9850b7edbd4';
  
-- fist two joins only
-- main one
SELECT 
  xref_user_loadouts.loadout_id,
  can_edit,can_pack,is_admin,
  num_children, num_packed, num_users,
  loadouts.`name`
FROM
  (SELECT 
	 loadouts.parent_id,
     loadouts.id AS loadout_id,
	 COUNT(*) AS num_children,
	 SUM(case when `status` = 1 then 1 else 0 end) AS num_packed
  FROM
	 loadouts
  GROUP BY loadouts.parent_id) AS children_counts
  
  INNER JOIN (SELECT 
	xref_user_loadouts.loadout_id,
	 COUNT(*) AS num_users
  FROM
	 xref_user_loadouts
  GROUP BY xref_user_loadouts.loadout_id) AS user_counts ON user_counts.loadout_id = children_counts.parent_id
  
	 RIGHT JOIN
  xref_user_loadouts ON user_counts.loadout_id = xref_user_loadouts.loadout_id
  INNER JOIN
  loadouts ON xref_user_loadouts.loadout_id = loadouts.id
WHERE
  xref_user_loadouts.user_id = '0e3e3882-1264-467c-94bf-f9850b7edbd4';