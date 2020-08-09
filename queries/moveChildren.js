// this moves all the child items of a parent item to a new parent item

const moveChildren = `
UPDATE loadout_app.loadouts 
SET 
    parent_id = ? -- destination
WHERE
    (parent_id = ?); -- origin
`;

module.exports = moveChildren;
