// sets permissions on a user loadout
// test:
const setUserLoadout = `
UPDATE loadout_app.xref_user_loadouts 
SET 
    can_pack = ?,
    can_edit = ?,
    is_admin = ?
WHERE
    (xref_user_loadouts.user_id = ?
    AND xref_user_loadouts.loadout_id = ?);
`;

module.exports = setUserLoadout;
