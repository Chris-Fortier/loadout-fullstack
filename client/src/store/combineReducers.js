// This makes it possible to namespace stuff but combineReducer is still the one thing that redux accesses.
import { combineReducers } from "redux";
import currentUser from "./reducers/currentUser";
import currentLoadout from "./reducers/currentLoadout";
import currentItem from "./reducers/currentItem";
import childItems from "./reducers/childItems";

export default combineReducers({
   currentUser,
   currentLoadout,
   currentItem,
   childItems,
});
