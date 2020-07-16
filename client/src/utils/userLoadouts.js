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
         // const loadoutUsers = res.data;
         // const thisLoadoutUser = loadoutUsers.filter((loadoutUser) => {
         //    return loadoutUser.userId === this.props.currentUser.id;
         // });
         // thisLoadoutUser[0].username =
         //    thisLoadoutUser[0].username + " (YOU)";
         // this.setState({
         //    thisLoadoutUser: thisLoadoutUser,
         //    otherLoadoutUsers: loadoutUsers.filter((loadoutUser) => {
         //       return loadoutUser.userId !== this.props.currentUser.id;
         //    }),
         // });
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
