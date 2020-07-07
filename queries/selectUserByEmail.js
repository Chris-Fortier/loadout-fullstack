// this runs a query on the database to get a user from an email
const selectUserByEmail = `
   SELECT 
      *
   FROM
      users
   WHERE
      email = ?
   LIMIT 1;
   `;

module.exports = selectUserByEmail;
