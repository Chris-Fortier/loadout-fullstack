// this file copied from white bear

import actions from "../actions";

export default function currentUser(currentUser = {}, action) {
   // default for state is an empty object

   // let newCurrentUser = { ...currentUser }; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.UPDATE_CURRENT_USER:
         return action.payload;
      default:
         return currentUser;
   }
}
