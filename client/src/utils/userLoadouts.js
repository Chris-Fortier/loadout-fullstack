import axios from "axios";
import actions from "../store/actions";
import store from "../store/store";

// user loadout client side axios calls

// example removeUserLoadout(this.props.loadoutUser.userId, this.props.loadoutUser.loadoutId)
export function removeUserLoadout(userId, loadoutId) {
   // server update
   axios
      .put(
         "/api/v1/user-loadouts/delete?userId=" +
            userId +
            "&loadoutId=" +
            loadoutId
      )
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });

   // refreshPage();
}

// gets user loadouts for the current user via the user's token
export function getUserLoadouts() {
   axios
      // .get(
      //    "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/loadouts.json"
      // )
      .get("/api/v1/user-loadouts/")
      .then((res) => {
         console.log("axios res", res);
         const loadouts = res.data;
         store.dispatch({
            type: actions.STORE_USER_LOADOUTS,
            payload: loadouts,
         });
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });
}
