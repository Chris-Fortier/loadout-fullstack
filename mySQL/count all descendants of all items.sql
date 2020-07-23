USE loadout_app;
SELECT * FROM loadouts;

-- count descendants of all items from a common ancestor
SELECT
	parents.name,
    parent_idas,
    descendants.num_descendants,
    num_packed_descendants,
    num_unpacked_descendants
FROM
(SELECT
	parent_id AS parent_idas,
	COUNT(*) AS num_descendants,
	SUM(CASE WHEN `status` = 1 THEN 1 ELSE 0 END) AS num_packed_descendants,
	SUM(CASE WHEN `status` = 0 THEN 1 ELSE 0 END) AS num_unpacked_descendants
FROM loadouts WHERE id IN (
	with recursive cte (id, name, parent_id,
				 status,
				 created_at,
				 last_edit_at,
				 last_pack_at) as (
	  select     id,
				 name,
				 parent_id,
				 status,
				 created_at,
				 last_edit_at,
				 last_pack_at
	  from       loadouts
	  where      parent_id = '42655170-7e10-4431-8d98-c2774f6414a4' -- starting point for loadout
	  union all
	  select     p.id,
				 p.name,
				 p.parent_id,
				 p.status,
				 p.created_at,
				 p.last_edit_at,
				 p.last_pack_at
	  from       loadouts p
	  inner join cte
			  on p.parent_id = cte.id
)
select id from cte) group by parent_id) AS descendants
RIGHT JOIN loadouts AS parents ON parent_idas = parents.id;

