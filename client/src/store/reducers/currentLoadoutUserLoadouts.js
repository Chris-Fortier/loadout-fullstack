import actions from "../actions";

// stores all the user loadouts of the current loadout

export default function currentLoadoutUserLoadouts(
   currentLoadoutUserLoadouts = [],
   action
) {
   switch (action.type) {
      case actions.STORE_CURRENT_LOADOUT_USER_LOADOUTS:
         console.log("FIRED STORE_CURRENT_LOADOUT_USER_LOADOUTS");
         return [...action.payload]; // make a copy of it as we cannot change the original one in place
      default:
         return currentLoadoutUserLoadouts;
   }
}
