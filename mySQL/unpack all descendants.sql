USE loadout_app;
SELECT * FROM loadouts;

UPDATE `loadout_app`.`loadouts` SET `status` = '0', `last_pack_at` = '999' WHERE id IN (
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
	  where      parent_id = '42655170-7e10-4431-8d98-c2774f6414a4' -- One-Night Camping Trip
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
select id from cte)
AND `status` != 4; -- this line makes it not unpack compartments

-- Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.  To disable safe mode, toggle the option in Preferences -> SQL Editor and reconnect.
