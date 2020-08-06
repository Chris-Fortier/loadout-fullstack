// this counts all the child compartments of an item

const countChildCompartments = `
SELECT count(*) AS num_compartments FROM loadouts
WHERE
    (parent_id = ?)
AND \`status\` = 4;
`;

module.exports = countChildCompartments;
