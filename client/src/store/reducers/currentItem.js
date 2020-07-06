import actions from "../actions";

export default function currentItem(currentItem = {}, action) {
   // default for state is an empty array

   // action has two things in it: action.payload and action.type

   let newCurrentItem = { ...currentItem }; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.STORE_CURRENT_ITEM:
         console.log("FIRED STORE_CURRENT_ITEM");
         newCurrentItem = action.payload;
         return newCurrentItem; // [{},{}]
      default:
         return currentItem;
   }
}
