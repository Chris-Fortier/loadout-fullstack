// this deletes an existing user loadout given the user and loadout ids

const deleteUserLoadoutByIds = `
   DELETE FROM
      loadout_app.xref_user_loadouts 
   WHERE
      user_id = ? AND
      loadout_id = ?
`;

module.exports = deleteUserLoadoutByIds;
