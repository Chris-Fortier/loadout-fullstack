// returns the users that have access to a given loadout
// test: http://localhost:3060/api/v1/loadout-users?loadoutId=42655170-7e10-4431-8d98-c2774f6414a4 shows all users who have access to "One-Night Camping Trip"
const selectLoadoutUsers = `
   SELECT
      users.email,
      loadouts.name AS loadout_name,
      xref_user_loadouts.can_edit,
      xref_user_loadouts.can_pack,
      xref_user_loadouts.is_admin,
      xref_user_loadouts.id AS id
   FROM
      users
   INNER JOIN
      xref_user_loadouts ON user_id = users.id
   INNER JOIN
      loadouts ON loadouts.id = xref_user_loadouts.loadout_id
   WHERE
      loadouts.id = ?
   `;

module.exports = selectLoadoutUsers;
