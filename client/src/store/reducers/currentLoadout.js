import actions from "../actions";

export default function currentLoadout(currentLoadout = [], action) {
   // default for state is an empty array

   // let newUserLoadouts = [...action.payload]; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.STORE_CURRENT_LOADOUT:
         console.log("FIRED STORE_CURRENT_LOADOUT");
         return [...action.payload]; // make a copy of it as we cannot change the original one in place
      default:
         return currentLoadout;
   }
}
