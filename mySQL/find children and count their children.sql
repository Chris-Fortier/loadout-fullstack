-- gets each child of a given item, this is the shell query around other queries
SELECT 
      loadouts.name,
      loadouts.status,
      loadouts.id
   FROM
      loadouts
   WHERE
      loadouts.parent_id = '41b9bde9-4731-44d2-b471-d46d21aca680';


-- gets number of children for each item within a parent item
SELECT 
    loadouts.name, loadouts.status, loadouts.id, num_children
FROM
    (SELECT 
        loadouts.parent_id, COUNT(*) AS num_children
    FROM
        loadouts
    GROUP BY loadouts.parent_id) AS children_counts
        RIGHT JOIN
    loadouts ON children_counts.parent_id = loadouts.id
WHERE
    loadouts.parent_id = '41b9bde9-4731-44d2-b471-d46d21aca680';
      
-- gets number of PACKED children for each item within a parent item
SELECT 
    loadouts.name, loadouts.status, loadouts.id, num_packed_children
FROM
    (SELECT 
        loadouts.parent_id, COUNT(*) AS num_packed_children
    FROM
        loadouts
    WHERE
        status = 1
    GROUP BY loadouts.parent_id) AS packed_counts
        RIGHT JOIN
    loadouts ON packed_counts.parent_id = loadouts.id
WHERE
    loadouts.parent_id = '41b9bde9-4731-44d2-b471-d46d21aca680';

-- trying to combine
SELECT 
    loadouts.name, loadouts.status, loadouts.id, num_children, num_packed
FROM
    (SELECT 
        loadouts.parent_id,
        COUNT(*) AS num_children,
        SUM(case when `status` = 1 then 1 else 0 end) AS num_packed
    FROM
        loadouts
    GROUP BY loadouts.parent_id) AS children_counts
        RIGHT JOIN
    loadouts ON children_counts.parent_id = loadouts.id;
-- WHERE
--    loadouts.parent_id = '41b9bde9-4731-44d2-b471-d46d21aca680';
