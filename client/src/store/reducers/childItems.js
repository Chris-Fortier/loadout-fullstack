import actions from "../actions";

export default function childItems(childItems = [], action) {
   // default for state is an empty array TODO: should be empty array?

   // action has two things in it: action.payload and action.type

   // let newChildItems = { ...childItems }; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.STORE_CHILD_ITEMS:
         console.log("FIRED STORE_CHILD_ITEMS");

         // update the data in props (this is what makes the change appear in the ui)
         // i needed to push completely new objects otherwise the redux state is unaware that the data changed
         const newChildItems = [];
         for (let c in action.payload) {
            newChildItems.push({ ...action.payload[c] });
         }

         return newChildItems; // [{},{}]
      default:
         return childItems;
   }
}
