import actions from "../actions";

// stores all the user loadouts of the current loadout

export default function isEditMode(isEditMode = false, action) {
   switch (action.type) {
      case actions.SET_EDIT_MODE:
         console.log("FIRED SET_EDIT_MODE");
         return action.payload;
      default:
         return isEditMode;
   }
}
