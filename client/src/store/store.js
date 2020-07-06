import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import combineReducers from "./combineReducers";
const initialState = {
   // from white bear
   currentUser: {},
   currentLoadout: {
      gear: [],
      itemIndexPath: [], // the default path of what item we are looking at ([2, 8, 0] is a good test)
      id: "", // the uuid of the current loadout
   },
   currentItem: {
      id: "", // the uuid of the curren item
   },
   childItems: [],

   // // from ItemList state

   // isShowingPacked: true,
   // isPackedOnBottom: true,
   // isEditMode: false,
   // isShowingUnpackConfirmation: false,

   // subItemDisplayMode: "numUnpackedDescendants",
   // // subItemDisplayMode can be "packedChildrenOutOfTotalChildren" or "numUnpackedDescendants"

   // rootItem: gear, // stores all the item data from the abolsute root
   // currentItem: gear, // stores the item data where the item of this page is at the root level
   // itemIndexPath: [],
};
const store = createStore(combineReducers, initialState, composeWithDevTools());
export default store;
