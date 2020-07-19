// this updates the password of a user in the database

const setUserPassword = `
   UPDATE loadout_app.users 
   SET 
      password = ?
   WHERE
      id = ?;
`;

module.exports = setUserPassword;
