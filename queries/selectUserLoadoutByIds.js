// this returns a user loadout given the user id and loadout id, used to check if it already exists
const selectUserLoadoutByIds = `
   SELECT 
      *
   FROM
      xref_user_loadouts
   WHERE
      user_id = ? AND
      loadout_id = ?
   LIMIT 1;
   `;

module.exports = selectUserLoadoutByIds;
