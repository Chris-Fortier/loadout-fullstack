// returns the loadouts that a given user has access to
// test: http://localhost:3060/api/v1/user-loadouts/?userId=84fbbb78-b2a2-11ea-b3de-0242ac130004
const selectUserLoadouts = `
   SELECT
      users.email,
      loadouts.name AS loadout_name,
      can_edit,
      can_pack,
      is_admin
   FROM
      users
   INNER JOIN
      xref_user_loadouts ON user_id = users.id
   INNER JOIN
      loadouts ON loadouts.id = xref_user_loadouts.loadout_id
   WHERE
      users.id = ?
   `;

module.exports = selectUserLoadouts;
