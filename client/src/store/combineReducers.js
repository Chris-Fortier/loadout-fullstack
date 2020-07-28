// This makes it possible to namespace stuff but combineReducer is still the one thing that redux accesses.
import { combineReducers } from "redux";
import currentUser from "./reducers/currentUser";
import currentItem from "./reducers/currentItem";
import currentLevel from "./reducers/currentLevel";
import currentUserLoadout from "./reducers/currentUserLoadout";
import userLoadouts from "./reducers/userLoadouts";
import currentLoadoutUserLoadouts from "./reducers/currentLoadoutUserLoadouts";
import isEditMode from "./reducers/isEditMode";
import currentLoadout from "./reducers/currentLoadout";

export default combineReducers({
   currentUser,
   currentItem,
   currentLevel,
   currentUserLoadout,
   userLoadouts, // stores all the curent user's userLoadouts
   currentLoadoutUserLoadouts, // stores all the user loadouts for the current loadout
   isEditMode,
   currentLoadout, // stores the entire current loadout and all its descendants
});
