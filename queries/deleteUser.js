// this deletes an existing user

const deleteUser = `
   DELETE FROM loadout_app.users 
   WHERE
      id = ?;
`;

module.exports = deleteUser;
