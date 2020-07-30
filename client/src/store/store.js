import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import combineReducers from "./combineReducers";
const initialState = {
   currentUser: {},
   currentItem: {
      id: "", // the uuid of the current item
   },
   currentUserLoadout: {},
   userLoadouts: [],
   currentLoadoutUserLoadouts: [], // stores the userLoadouts of the current loadout
   isEditMode: false,
   currentLoadout: [], // stores the entire current loadout and all its descendants
};
const store = createStore(combineReducers, initialState, composeWithDevTools());
export default store;
