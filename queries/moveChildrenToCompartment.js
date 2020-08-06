// this moves all the child items of an item to a new item

const moveChildrenToCompartment = `
UPDATE loadout_app.loadouts 
SET 
    parent_id = ? -- destination
WHERE
    (parent_id = ?) -- origin
AND \`status\` != 4; -- do not move compartments
`;

module.exports = moveChildrenToCompartment;
