import actions from "../store/actions";
import store from "../store/store";
import axios from "axios";

// this version uses changes the current item id in the store

// move page to a different item
export default function movePageToDifferentItem(itemId, levelChange = 0) {
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

      // this part gets data from the database
      axios
         .get("/api/v1/item-info?itemId=" + itemId)
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
         .get("/api/v1/child-items?itemId=" + itemId)
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
