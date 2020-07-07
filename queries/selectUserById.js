// this runs a query on the database to get a user from an email
const selectUserById = `
   SELECT 
      id, email, created_at
   FROM
      users
   WHERE
      id = ?
   LIMIT 1;
   `;
module.exports = selectUserById;
