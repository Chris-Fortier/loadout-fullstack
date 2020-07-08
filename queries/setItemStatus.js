// this updates the status of an item in the database to unpacked

const setItemStatus = `
   UPDATE loadout_app.loadouts
   SET
      status = ?,
      last_pack_at = ?
   WHERE
      id = ?;
`;

module.exports = setItemStatus;
