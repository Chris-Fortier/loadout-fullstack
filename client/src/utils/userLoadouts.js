import axios from "axios";
import actions from "../store/actions";
import store from "../store/store";

// user loadout client side axios calls

// gets user loadouts for the current user via the user's token
export function getUserLoadouts() {
   axios
      .get("/api/v1/user-loadouts/")
      .then((res) => {
         console.log("axios res", res);
         const loadouts = res.data;

         // put the user loadouts in the store
         store.dispatch({
            type: actions.STORE_USER_LOADOUTS,
            payload: loadouts,
         });

         // clear the current loadout user loadouts
         store.dispatch({
            type: actions.STORE_CURRENT_LOADOUT_USER_LOADOUTS,
            payload: [],
         });

         // clear the current user loadout
         store.dispatch({
            type: actions.STORE_CURRENT_USER_LOADOUT,
            payload: {},
         });

         // clear the current item
         store.dispatch({
            type: actions.STORE_CURRENT_ITEM,
            payload: {},
         });

         // TODO: is this redundant?
         store.dispatch({
            type: actions.STORE_CURRENT_LOADOUT,
            payload: [],
         });
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });
}

// gets all the user loadouts for a loadout
export function getUserLoadoutsForALoadout(loadoutId) {
   console.log("refreshing page...");
   axios
      .get("/api/v1/loadout-users?loadoutId=" + loadoutId)
      .then((res) => {
         console.log("axios res", res);

         store.dispatch({
            type: actions.STORE_CURRENT_LOADOUT_USER_LOADOUTS,
            payload: res.data,
         });
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });
}
