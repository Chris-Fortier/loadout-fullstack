import actions from "../actions";

export default function userLoadouts(userLoadouts = [], action) {
   // default for state is an empty array

   // let newUserLoadouts = [...action.payload]; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.STORE_USER_LOADOUTS:
         return [...action.payload]; // make a copy of it as we cannot change the original one in place
      default:
         return userLoadouts;
   }
}
