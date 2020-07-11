// this runs a query on the database to get a user from an username
// this one doesn't return anything but the user id
const selectUserIdByUsername = `
   SELECT 
      id
   FROM
      users
   WHERE
      username = ?
   LIMIT 1;
   `;

module.exports = selectUserIdByUsername;
