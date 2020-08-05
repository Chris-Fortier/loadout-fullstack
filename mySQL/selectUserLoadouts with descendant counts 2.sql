USE loadout_app;
SELECT * FROM loadouts;

-- '42655170-7e10-4431-8d98-c2774f6414a4' is One-Night Camping Trip

-- count descendants of a single item
SELECT
	SUM(CASE WHEN `parent_id` = '42655170-7e10-4431-8d98-c2774f6414a4' THEN 1 ELSE 0 END) AS num_children,
	SUM(CASE WHEN `parent_id` = '42655170-7e10-4431-8d98-c2774f6414a4' AND `status` = 1 THEN 1 ELSE 0 END) AS num_packed_children,
	SUM(CASE WHEN `parent_id` = '42655170-7e10-4431-8d98-c2774f6414a4' AND `status` = 0 THEN 1 ELSE 0 END) AS num_unpacked_children,
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
	  where      parent_id = '42655170-7e10-4431-8d98-c2774f6414a4'
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
select id from cte);

-- Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.  To disable safe mode, toggle the option in Preferences -> SQL Editor and reconnect.
