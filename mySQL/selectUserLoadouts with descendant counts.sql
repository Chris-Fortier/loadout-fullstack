-- https://stackoverflow.com/questions/36662203/recursive-sql-count-number-of-descendants-in-hierarchical-structure

SELECT * FROM loadouts;

WITH RECURSIVE cte AS (
    SELECT m.id as start_id,
        m.id,
        m.name,
        m.parent_id,
        1 AS level
    FROM loadouts AS m

    UNION ALL

    SELECT cte.start_id,
        m.id,
        m.name,
        m.parent_id,
        cte.level + 1 AS level
    FROM loadouts AS m
    INNER JOIN cte ON cte.id = m.parent_id
),
cte_distinct AS (
    SELECT DISTINCT start_id, id 
    FROM cte
)
SELECT cte_distinct.start_id,
    m.name,
    COUNT(*)-1 AS descendants_count
    -- SUM(CASE WHEN `status` = 1 THEN 1 ELSE 0 END) AS packed_descendants_count,
FROM cte_distinct
INNER JOIN loadouts AS m ON m.id = cte_distinct.start_id
GROUP BY cte_distinct.start_id, m.name
ORDER BY descendants_count DESC;