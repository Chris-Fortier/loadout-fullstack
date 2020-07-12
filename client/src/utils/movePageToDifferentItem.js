import actions from "../store/actions";
import store from "../store/store";
import axios from "axios";

// this version uses changes the current item id in the store

// move page to a different item
export function movePageToDifferentItem(
   itemId,
   levelChange = 0,
   newCurrentLoadout = null
) {
   console.log("movePageToDifferentItem()...itemId:", itemId);

   if (itemId !== null) {
      // dispatching some blank data while we wait for the db response so it won't look strange having old data there for a split second
      store.dispatch({
         type: actions.STORE_CURRENT_ITEM,
         payload: {},
      });
      store.dispatch({
         type: actions.STORE_CHILD_ITEMS,
         payload: [],
      });

      // this stores the current user loadout, which has the user's permissions for this loadout
      // this only happens when entering a new loadout
      if (newCurrentLoadout !== null) {
         store.dispatch({
            type: actions.STORE_CURRENT_USER_LOADOUT,
            payload: newCurrentLoadout,
         });
      }

      // this part gets data from the database
      axios
         .get("/api/v1/loadouts/info?itemId=" + itemId)
         .then((res) => {
            // handle success
            console.log("setCurrentItem res.data[0]", res.data[0]);

            store.dispatch({
               type: actions.STORE_CURRENT_ITEM,
               payload: res.data[0],
            }); // dispatching an action
         })
         .catch((error) => {
            // handle error
            console.log(error);
         });

      // TODO how can I do this?
      // this.setState({ isEditMode: false, isShowingUnpackConfirmation: false }); // get out of edit mode if the current item changes

      axios
         .get("/api/v1/loadouts/children?itemId=" + itemId)
         .then((res) => {
            // handle success
            console.log("queryChildItems res.data", res.data);

            store.dispatch({
               type: actions.STORE_CHILD_ITEMS,
               payload: res.data,
            }); // dispatching an action
         })
         .catch((error) => {
            // handle error
            console.log(error);
         });

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

// refresh the current page from the database
// simpler version that does not clear out data first and does not scroll the page
export function refreshPage(itemId) {
   console.log("refreshPage()...itemId:", itemId);

   // this part gets data from the database
   axios
      .get("/api/v1/loadouts/info?itemId=" + itemId)
      .then((res) => {
         // handle success
         store.dispatch({
            type: actions.STORE_CURRENT_ITEM,
            payload: res.data[0],
         }); // dispatching an action
      })
      .catch((error) => {
         // handle error
         console.log(error);
      });

   // TODO how can I do this?
   // this.setState({ isEditMode: false, isShowingUnpackConfirmation: false }); // get out of edit mode if the current item changes

   axios
      .get("/api/v1/loadouts/children?itemId=" + itemId)
      .then((res) => {
         // handle success
         console.log("queryChildItems res.data", res.data);

         store.dispatch({
            type: actions.STORE_CHILD_ITEMS,
            payload: res.data,
         }); // dispatching an action
      })
      .catch((error) => {
         // handle error
         console.log(error);
      });
}
