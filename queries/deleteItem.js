// this deletes an existing item

const deleteItem = `
   DELETE FROM loadout_app.loadouts 
   WHERE
      id = ?;
`;

module.exports = deleteItem;
