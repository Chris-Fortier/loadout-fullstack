// this deletes an existing user loadout

const deleteUserLoadout = `
   DELETE FROM
      loadout_app.xref_user_loadouts 
   WHERE
      id = ?;
`;

module.exports = deleteUserLoadout;
