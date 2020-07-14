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
   currentLevel: 0, // TODO the default should be zero, testing a different one
   currentUserLoadout: {},
   userLoadouts: [],
};
const store = createStore(combineReducers, initialState, composeWithDevTools());
export default store;
