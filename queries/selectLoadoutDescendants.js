// selects all the items descendants of an entire loadout or item
const selectLoadoutDescendants = `
   with recursive cte (
      id,
      name,
      parent_id,
      status,
      created_at,
      last_edit_at,
      last_pack_at) as (
         select
            id,
            name,
            parent_id,
            status,
            created_at,
            last_edit_at,
            last_pack_at
         from loadouts
         where parent_id = ?
         union all
         select
            p.id,
            p.name,
            p.parent_id,
            p.status,
            p.created_at,
            p.last_edit_at,
            p.last_pack_at
         from loadouts p
         inner join cte
         on p.parent_id = cte.id
      )
   select * from cte;
`;

module.exports = selectLoadoutDescendants;
