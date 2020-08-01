import actions from "../actions";

export default function moveableItems(moveableItemIds = [], action) {
   // default for state is an empty array

   switch (action.type) {
      // case actions.ADD_MOVEABLE_ITEM_ID:
      //    console.log("FIRED ADD_MOVEABLE_ITEM_ID");
      //    return [...moveableItemIds, action.payload]; // add the new item to the end
      case actions.TOGGLE_MOVEABLE_ITEM_ID:
         console.log("FIRED TOGGLE_MOVEABLE_ITEM_ID");
         if (moveableItemIds.includes(action.payload)) {
            // the item id already is in the array, remove it
            const index = moveableItemIds.indexOf(action.payload);
            if (index > -1) {
               moveableItemIds.splice(index, 1);
            }
            return [...moveableItemIds];
         } else {
            return [...moveableItemIds, action.payload]; // add the new item to the end
         }
      case actions.CLEAR_MOVEABLE_ITEM_IDS:
         console.log("FIRED CLEAR_MOVEABLE_ITEM_IDS");
         return []; // clear the array
      default:
         return moveableItemIds;
   }
}
