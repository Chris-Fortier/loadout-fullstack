SELECT * FROM loadouts;

-- https://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query

-- select all descendants
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
select * from cte;

UPDATE `loadout_app`.`loadouts` SET `status` = '0' WHERE (`id` = '0674f34b-f0d8-4eac-bbc1-213d37acdf3f');
