// this runs a query on the database to get a user from an username
const selectUserById = `
   SELECT 
      *
   FROM
      users
   WHERE
      id = ?
   LIMIT 1;
   `;
module.exports = selectUserById;
