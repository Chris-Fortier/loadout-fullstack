// this creates a loadout user, a new existing person who can access an existing loadout

// new syntax, with this method we just pass an object and the database will use it if all the keys match
const insertUserLoadout = `
   INSERT INTO xref_user_loadouts SET ?;
`;

module.exports = insertUserLoadout;
