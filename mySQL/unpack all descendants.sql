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
	  where      parent_id = '41b9bde9-4731-44d2-b471-d46d21aca680'
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
