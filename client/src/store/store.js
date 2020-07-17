import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import combineReducers from "./combineReducers";
const initialState = {
   // from white bear
   currentUser: {},
   // currentLoadout: {
   //    gear: [],
   //    itemIndexPath: [], // the default path of what item we are looking at ([2, 8, 0] is a good test)
   //    id: "", // the uuid of the current loadout
   // },
   currentItem: {
      id: "", // the uuid of the curren item
   },
   childItems: [],
   currentLevel: 0,
   currentUserLoadout: {},
   userLoadouts: [],
   currentLoadoutUserLoadouts: [], // stores the userLoadouts of the current loadout
   isEditMode: false,
};
const store = createStore(combineReducers, initialState, composeWithDevTools());
export default store;
