import actions from "../actions";

export default function currentUserLoadout(currentUserLoadout = {}, action) {
   // default for state is an empty object

   // let newCurrentUser = { ...currentUserLoadout }; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.STORE_CURRENT_USER_LOADOUT:
         return action.payload;
      default:
         return currentUserLoadout;
   }
}
