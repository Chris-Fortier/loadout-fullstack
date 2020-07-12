// this will delete all of a user's user loadouts, this needs to be done before deleting a user

const deleteUserLoadoutsByUser = `
   DELETE FROM
      loadout_app.xref_user_loadouts
   WHERE
      user_id = ?;
`;

module.exports = deleteUserLoadoutsByUser;
