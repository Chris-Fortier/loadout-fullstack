// this creates a new user on the database

// new syntax, with this method we just pass an object and the database will use it if all the keys match
const insertItem = `
   INSERT INTO loadouts SET ?;
`;

module.exports = insertItem;
