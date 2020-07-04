import actions from "../actions";

export default function currentLoadout(currentLoadout = {}, action) {
   // default for state is an empty array

   // action has two things in it: action.payload and action.type

   let newCurrentLoadout = { ...currentLoadout }; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.STORE_CURRENT_LOADOUT:
         console.log("FIRED STORE_CURRENT_LOADOUT");
         newCurrentLoadout.gear = action.payload;
         return newCurrentLoadout; // [{},{}]
      // case actions.INCREMENT_QUEUE_INDEX:
      //    newCurrentLoadout.index += 1;
      //    return newCurrentLoadout;
      // case actions.DECREMENT_QUEUE_INDEX:
      //    newCurrentLoadout.index -= 1;
      //    return newCurrentLoadout;
      // case actions.RESET_QUEUE:
      //    newCurrentLoadout.cards = [];
      //    newCurrentLoadout.index = 0;
      //    return newCurrentLoadout;
      case actions.CHANGE_ITEM_INDEX_PATH:
         console.log("FIRED CHANGE_ITEM_INDEX_PATH");
         newCurrentLoadout.itemIndexPath = action.payload;
         return newCurrentLoadout;
      case actions.CLEAR_CURRENT_LOADOUT:
         console.log("FIRED CLEAR_LOADOUT");
         newCurrentLoadout.gear = [];
         newCurrentLoadout.itemIndexPath = [];
         return newCurrentLoadout;
      default:
         return currentLoadout;
   }
}
