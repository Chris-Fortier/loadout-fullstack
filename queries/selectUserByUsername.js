// this runs a query on the database to get a user from an username
const selectUserByUsername = `
   SELECT 
      *
   FROM
      users
   WHERE
      username = ?
   LIMIT 1;
   `;

module.exports = selectUserByUsername;
