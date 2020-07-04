// This makes it possible to namespace stuff but combineReducer is still the one thing that redux accesses.
import { combineReducers } from "redux";
import currentUser from "./reducers/currentUser";
import currentLoadout from "./reducers/currentLoadout";

export default combineReducers({
   currentUser,
   currentLoadout,
});
