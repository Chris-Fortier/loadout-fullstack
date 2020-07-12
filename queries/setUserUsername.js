// this updates the username of a user in the database

const setUserUsername = `
   UPDATE loadout_app.users 
   SET 
      username = ?
   WHERE
      id = ?;
`;

module.exports = setUserUsername;
