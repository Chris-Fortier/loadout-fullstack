// sets teh status of all the descendants of an entire loadout or item to something and sets the last pack date
// used for unpack all feature
const setLoadoutDescendantsStatus = `
UPDATE loadout_app.loadouts SET status = ?, last_pack_at = ? WHERE id IN (
	with recursive cte (id, parent_id,
				 status,
				 last_pack_at) as (
	  select     id,
				 parent_id,
				 status,
				 last_pack_at
	  from       loadouts
	  where      parent_id = ?
	  union all
	  select     p.id,
				 p.parent_id,
				 p.status,
				 p.last_pack_at
	  from       loadouts p
	  inner join cte
			  on p.parent_id = cte.id
)
select id from cte);
`;

module.exports = setLoadoutDescendantsStatus;
