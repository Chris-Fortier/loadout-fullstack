// returns the details and derived information from a single item based on the item's id
// test: http://localhost:3060/api/v1/item-info/?itemId=41b9bde9-4731-44d2-b471-d46d21aca680 shows all items inside daypack
const selectItemInfo = `
   SELECT 
      (SELECT 
            loadouts.name
         FROM
            loadouts
         WHERE
            loadouts.id = ?) AS name,
      (SELECT 
            loadouts.status
         FROM
            loadouts
         WHERE
            loadouts.id = ?) AS status,
      (SELECT 
            loadouts.id
         FROM
            loadouts
         WHERE
            loadouts.id = ?) AS id,
      (SELECT 
            loadouts.parent_id
         FROM
            loadouts
         WHERE
            loadouts.id = ?) AS parent_id,
      (SELECT
            parent_loadouts.name
         FROM
            loadouts AS parent_loadouts
         INNER JOIN
            loadouts ON parent_loadouts.id = loadouts.parent_id
         WHERE
            loadouts.id = ?) AS parent_name,
      (SELECT 
            COUNT(loadouts.id)
         FROM
            loadouts
         WHERE
            loadouts.parent_id = ?) AS num_children,
      (SELECT 
            COUNT(loadouts.id)
         FROM
            loadouts
         WHERE
            loadouts.parent_id = ?
                  AND loadouts.status = 1) AS num_packed_children;
   `;

module.exports = selectItemInfo;
