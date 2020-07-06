import actions from "../actions";

export default function childItems(childItems = {}, action) {
   // default for state is an empty array

   // action has two things in it: action.payload and action.type

   let newChildItems = { ...childItems }; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.STORE_CHILD_ITEMS:
         console.log("FIRED STORE_CHILD_ITEMS");
         newChildItems = action.payload;
         return newChildItems; // [{},{}]
      default:
         return childItems;
   }
}
