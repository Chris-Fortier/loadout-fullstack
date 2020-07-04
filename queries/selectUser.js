// returns the user from the database that matches the email and password
// test: http://localhost:3060/api/v1/users?userId=84fbbb78-b2a2-11ea-b3de-0242ac130004&password=6B34FE24AC2FF8103F6FCE1F0DA2EF57 shows the chris user
const selectUser = `
   SELECT
      id, email, created_at
   FROM
      users
   WHERE
      email = ?
      AND password = ?
   LIMIT 1;
   `;

module.exports = selectUser;
