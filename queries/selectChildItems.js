// returns the loadouts that a given user has access to
// test: http://localhost:3060/api/v1/loadouts/children/?itemId=41b9bde9-4731-44d2-b471-d46d21aca680 shows all items inside daypack

// this version also gets the number of child items each child item has
const selectChildItems = `
   SELECT 
      loadouts.name, loadouts.status, loadouts.id, loadouts.parent_id, num_children, num_packed_children
   FROM
      (SELECT 
         loadouts.parent_id,
         COUNT(*) AS num_children,
         SUM(case when \`status\` = 1 then 1 else 0 end) AS num_packed_children
      FROM
         loadouts
      GROUP BY loadouts.parent_id) AS children_counts
         RIGHT JOIN
      loadouts ON children_counts.parent_id = loadouts.id
   WHERE
      loadouts.parent_id = ?
   ORDER BY
	   loadouts.created_at ASC;
   `;

module.exports = selectChildItems;
