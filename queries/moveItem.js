// move an item to a new location (its descendants go with it)
const moveItem = `
   UPDATE loadout_app.loadouts 
   SET 
      parent_id = ?
   WHERE
      (id = ?);
`;

module.exports = moveItem;
