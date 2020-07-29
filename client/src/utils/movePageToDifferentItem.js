import actions from "../store/actions";
import store from "../store/store";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { getUserLoadouts } from "./userLoadouts";
import { processLoadout } from "./items";

// this version uses changes the current item id in the store

// move page to a different item
export function movePageToDifferentItem(
   itemId,
   levelChange = 0,
   newCurrentLoadout = null,
   backRoute = "/item-list" // where the user would go when clicking on the back link
) {
   console.log("movePageToDifferentItem()...itemId:", itemId);

   if (itemId !== null) {
      // dispatching some blank data while we wait for the db response so it won't look strange having old data there for a split second
      store.dispatch({
         type: actions.STORE_CURRENT_ITEM,
         payload: {},
      });

      // this stores the current user loadout, which has the user's permissions for this loadout
      // this only happens when entering a new loadout
      if (newCurrentLoadout !== null) {
         store.dispatch({
            type: actions.STORE_CURRENT_USER_LOADOUT,
            payload: newCurrentLoadout,
         });

         // get all the items in the new current loadout
         axios
            .get("/api/v1/loadouts/select-descendants?itemId=" + itemId)
            .then((res) => {
               // handle success

               const currentLoadout = res.data;

               // store them
               store.dispatch({
                  type: actions.STORE_CURRENT_LOADOUT,
                  payload: processLoadout(currentLoadout),
               });
            })
            .catch((error) => {
               // handle error
               console.log(error);
            });
      }

      // // this part gets data from the database
      // axios
      //    .get("/api/v1/loadouts/info?itemId=" + itemId)
      //    .then((res) => {
      //       // handle success
      //       console.log("setCurrentItem res.data[0]", res.data[0]);

      //       const currentItem = res.data[0];
      //       currentItem.backRoute = backRoute;

      //       store.dispatch({
      //          type: actions.STORE_CURRENT_ITEM,
      //          payload: currentItem,
      //       }); // dispatching an action
      //    })
      //    .catch((error) => {
      //       // handle error
      //       console.log(error);
      //    });

      store.dispatch({
         type: actions.STORE_CURRENT_ITEM,
         payload: { id: itemId, backRoute },
      }); // dispatching an action

      // change the current level
      if (levelChange !== 0) {
         store.dispatch({
            type: actions.CHANGE_CURRENT_LEVEL,
            payload: levelChange,
         }); // dispatching an action
      }
   } else {
      console.log("Going to loadouts page");
   }

   window.scrollTo(0, 0); // sets focus to the top of the page
}

// refreshes the page every interval
// interval is in ms
export function refreshPeriodically(interval) {
   setInterval(() => {
      console.log("interval hit", store.getState().currentItem.id);
      // if the auth token exists
      if (localStorage.authTokenLoadout !== undefined) {
         // if the auth token has expired
         console.log(
            "time left",
            Date.now() - jwtDecode(localStorage.authTokenLoadout).exp * 1000
         );
         if (Date.now() > jwtDecode(localStorage.authTokenLoadout).exp * 1000) {
            // send to landing page
            console.log("auth token has expired, sending to landing page");
            window.location.replace("/");
         } else {
            // we need to refresh the contents of the page
            // if they are looking at a loadout
            if (window.location.href.endsWith("item-list")) {
               //  TODO: refresh the current loadout
               //  TODO: refresh the user loadout in case the permissions externally changed
            } else if (window.location.href.endsWith("loadout-list")) {
               // if they are looking at the My Loadouts page
               getUserLoadouts(); // refresh the user loadouts from DB
            } else if (window.location.href.endsWith("loadout-sharing")) {
               // if they are looking at a Sharing Settings page
               // getUserLoadoutsForALoadout(store.getState().currentItem.id);
               // TODO: external changes messes with my checks for whether or not rollouts should appear, perhaps the rollouts should only show on the click of something, not just if the states don't match
            }
         }
      }
   }, interval);
}
