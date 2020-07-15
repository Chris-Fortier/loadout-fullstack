// returns the loadouts that a given user has access to
// test: http://localhost:3060/api/v1/user-loadouts/?userId=84fbbb78-b2a2-11ea-b3de-0242ac130004
const selectUserLoadouts = `
   SELECT 
      xref_user_loadouts.loadout_id,
      can_edit, can_pack, is_admin,
      num_children, num_packed,
      num_users,
      loadouts.\`name\`
   FROM
      (SELECT 
         loadouts.parent_id,
            loadouts.id AS loadout_id,
            COUNT(*) AS num_children,
            SUM(CASE WHEN \`status\` = 1 THEN 1 ELSE 0 END) AS num_packed
      FROM
         loadouts
      GROUP BY loadouts.parent_id) AS children_counts
         RIGHT JOIN
      (SELECT 
         xref_user_loadouts.loadout_id, COUNT(*) AS num_users
      FROM
         xref_user_loadouts
      GROUP BY xref_user_loadouts.loadout_id) AS user_counts ON user_counts.loadout_id = children_counts.parent_id
         RIGHT JOIN
      xref_user_loadouts ON user_counts.loadout_id = xref_user_loadouts.loadout_id
         INNER JOIN
      loadouts ON xref_user_loadouts.loadout_id = loadouts.id
   WHERE
      xref_user_loadouts.user_id = ?;
   `;

module.exports = selectUserLoadouts;
