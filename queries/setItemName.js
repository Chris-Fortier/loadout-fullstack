// this updated the name of an item or loadout in the database

// new syntax, with this method we just pass an object and the database will use it if all the keys match
const setItemName = `
   UPDATE loadout_app.loadouts
   SET
      name = ?,
      last_edit_at = ?
   WHERE
      id = ?;
`;

// const setItemName = `
//    SELECT * FROM loadouts
//    WHERE
//       (id = ?);
// `;

module.exports = setItemName;
