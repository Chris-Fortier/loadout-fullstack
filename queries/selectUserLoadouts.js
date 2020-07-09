// returns the loadouts that a given user has access to
// test: http://localhost:3060/api/v1/user-loadouts/?userId=84fbbb78-b2a2-11ea-b3de-0242ac130004
// const selectUserLoadouts = `
//    SELECT
//       users.email,
//       loadouts.name AS loadout_name,
//       can_edit,
//       can_pack,
//       is_admin,
//       loadouts.id AS loadout_id
//    FROM
//       users
//    INNER JOIN
//       xref_user_loadouts ON user_id = users.id
//    INNER JOIN
//       loadouts ON loadouts.id = xref_user_loadouts.loadout_id
//    WHERE
//       users.id = ?
//    `;
const selectUserLoadouts = `
   SELECT 
      xref_user_loadouts.loadout_id,
      can_edit,can_pack,is_admin,
      num_children, num_packed,
      loadouts.\`name\`
   FROM
      (SELECT 
         loadouts.parent_id,
         COUNT(*) AS num_children,
         SUM(case when \`status\` = 1 then 1 else 0 end) AS num_packed
      FROM
         loadouts
      GROUP BY loadouts.parent_id) AS children_counts
         RIGHT JOIN
      xref_user_loadouts ON children_counts.parent_id = xref_user_loadouts.loadout_id
      INNER JOIN
      loadouts ON loadout_id = loadouts.id
   WHERE
      xref_user_loadouts.user_id = ?;
   `;

module.exports = selectUserLoadouts;
