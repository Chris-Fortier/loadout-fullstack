// returns the loadouts that a given user has access to
// test: http://localhost:3060/api/v1/child-items/?itemId=41b9bde9-4731-44d2-b471-d46d21aca680 shows all items inside daypack
const selectChildItemsOld = `
   SELECT 
      loadouts.name,
      loadouts.status,
      loadouts.id
   FROM
      loadouts
   WHERE
      loadouts.parent_id = ?
   ORDER BY
      loadouts.status ASC,
      loadouts.name ASC;
   `;

// this version also gets the number of child items each child item has
const selectChildItems = `
   SELECT 
      loadouts.name,
      loadouts.status,
      loadouts.id,
      num_children
   FROM
      (SELECT loadouts.parent_id, IFNULL(COUNT(*),1) AS num_children FROM loadouts GROUP BY loadouts.parent_id) AS counts
   RIGHT JOIN
      loadouts ON counts.parent_id = loadouts.id
   WHERE
      loadouts.parent_id = ?;
   `;

module.exports = selectChildItems;
