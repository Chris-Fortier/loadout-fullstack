// This makes it possible to namespace stuff but combineReducer is still the one thing that redux accesses.
import { combineReducers } from "redux";
import currentUser from "./reducers/currentUser";
import currentItem from "./reducers/currentItem";
import childItems from "./reducers/childItems";
import currentLevel from "./reducers/currentLevel";
import currentUserLoadout from "./reducers/currentUserLoadout";

export default combineReducers({
   currentUser,
   currentItem,
   childItems,
   currentLevel,
   currentUserLoadout,
});
