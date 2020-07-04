// returns the loadouts that a given user has access to
// test: http://localhost:3060/api/v1/child-items/?itemId=41b9bde9-4731-44d2-b471-d46d21aca680 shows all items inside daypack
const selectChildItems = `
   SELECT 
      loadouts.name,
      loadouts.status
   FROM
      loadouts
   WHERE
      loadouts.parent_id = ?
   ORDER BY
      loadouts.status ASC,
      loadouts.name ASC;
   `;

module.exports = selectChildItems;
