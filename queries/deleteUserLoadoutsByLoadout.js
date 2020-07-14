// this will delete all of the user loadouts associated with a loadout, this needs to be done before deleting a loadout

const deleteUserLoadoutsByLoadout = `
   DELETE FROM
      loadout_app.xref_user_loadouts
   WHERE
      loadout_id = ?;
`;

module.exports = deleteUserLoadoutsByLoadout;
