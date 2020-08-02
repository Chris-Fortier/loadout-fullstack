// returns the permissions that a given user has for a given item
// test:
const selectUserPermissionsForItem = `
SELECT can_pack, can_edit, is_admin FROM (

   WITH RECURSIVE loadouts_path (id, \`name\`, parent_id) AS
   (
     SELECT id, \`name\`, parent_id
       FROM loadouts
       WHERE id = ? -- child node (ibuprofen)
     UNION ALL
     SELECT l.id, l.\`name\`, l.parent_id
       FROM loadouts_path AS lp JOIN loadouts AS l
         ON lp.parent_id = l.id
   )
   SELECT * FROM loadouts_path WHERE parent_id IS null) AS root_node
   INNER JOIN (SELECT * FROM xref_user_loadouts WHERE user_id = ?) AS permissions ON root_node.id = permissions.loadout_id;
`;

module.exports = selectUserPermissionsForItem;
