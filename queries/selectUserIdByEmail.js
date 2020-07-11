// this runs a query on the database to get a user from an email
// this one doesn't return anything but the user id
const selectUserIdByEmail = `
   SELECT 
      id
   FROM
      users
   WHERE
      email = ?
   LIMIT 1;
   `;

module.exports = selectUserIdByEmail;
