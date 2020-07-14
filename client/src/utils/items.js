// import { processAllItems } from "./processItems";
// import { v4 as getUuid } from "uuid";
import axios from "axios";
// import {
//    // movePageToDifferentItem,
//    refreshPage,
// } from "./movePageToDifferentItem";
// import store from "../store/store";
// import actions from "../store/actions";

// this file will store functions relating to changing items in the loadouts

// returns the item object from an itemIndexPath
export function getItemFromPath(gear, itemIndexPath) {
   let copyOfGear = gear;
   let currentItem = copyOfGear;
   for (let i in itemIndexPath) {
      currentItem = currentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
   }
   return currentItem;
}

// returns the parent item object from an itemIndexPath
export function getParentItemFromPath(gear, itemIndexPath) {
   let copyOfGear = gear;
   let parentItem = copyOfGear;
   for (let i = 0; i < itemIndexPath.length - 1; i++) {
      parentItem = parentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
   }
   return parentItem;
}

// updates the name of an item
export function renameItem(itemId, newName) {
   console.log("will rename " + itemId + " to " + newName);

   // do an api call to rename an item on server
   axios
      .post(
         "/api/v1/loadouts/set-name?itemId=" + itemId + "&newName=" + newName
      )
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });
}

// add an item
export function addItemTo(parentId, newItemId) {
   // server update
   axios
      .post(
         "/api/v1/loadouts/insert?parentId=" +
            parentId +
            "&name=new%20item&newItemId=" +
            newItemId
      )
      .then((res) => {
         console.log("axios res", res);
         newItemId = res.data;
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });

   // client side part (this is too keep what we see consistent with the database until it refreshes from the database)

   return newItemId; // returns the uuid for the new item
   // console.log("store", store);
   // // const newChildItems = store.childItems;
   // store.dispatch({
   //    type: actions.STORE_CHILD_ITEMS,
   //    payload: [],
   // });
}

// // add an item that can contain other items
// export function addContainerTo(gear, itemIndexPath) {
//    // get the actual item I want to add an item inside
//    const currentItem = getItemFromPath(gear, itemIndexPath);

//    // meat of what this funtion does
//    currentItem.items.push({
//       name: "New Container",
//       id: getUuid(),
//       parentId: currentItem.id,
//       isPacked: false,
//       items: [], // having this lets it contain other items
//    }); // add a new item inside the current item

//    // this must happen whenever something in the loadout changes
//    processAllItems(gear);
// }

export function setItemStatus(itemId, newStatus) {
   // server update
   axios
      .post(
         "/api/v1/loadouts/set-status?newStatus=" +
            newStatus +
            "&itemId=" +
            itemId
      )
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });
}

export function setDescendantsStatus(itemId, newStatus) {
   // server update
   axios
      .post(
         "/api/v1/loadouts/set-descendants-status?newStatus=" +
            newStatus +
            "&itemId=" +
            itemId
      )
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });
}

// delete an item
export function deleteItem(itemId) {
   console.log("deleting this item", itemId);

   // server update
   axios
      .post("/api/v1/loadouts/delete?itemId=" + itemId)
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });

   // client side part (this is too keep what we see consistent with the database until it refreshes from the database)
   // refreshPage(item.parentId);
}
