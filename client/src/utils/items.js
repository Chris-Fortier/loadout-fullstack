// import { processAllItems } from "./processItems";
// import { v4 as getUuid } from "uuid";
import axios from "axios";
import {
   // movePageToDifferentItem,
   refreshPage,
} from "./movePageToDifferentItem";
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
export function renameItem(item, newName) {
   // console.log("rename " + this.props.item.name + " to " + newName);
   // console.log("itemIndexPath:", itemIndexPath);
   // get the actual item I want to change based on the index path
   // const currentItem = getItemFromPath(gear, itemIndexPath);
   // meat of what this funtion does
   // currentItem.name = newName;
   // this must happen whenever something in the loadout changes
   // processAllItems(gear);
   // do an api call to rename an item
   // axios
   //    .get("/api/v1/loadouts/rename-item", )
   //    .then((res) => {
   //       // handle success
   //       console.log("setCurrentItem res.data[0]", res.data[0]);
   //       store.dispatch({
   //          type: actions.STORE_CURRENT_ITEM,
   //          payload: res.data[0],
   //       }); // dispatching an action
   //    })
   //    .catch((error) => {
   //       // handle error
   //       console.log(error);
   //    });
}

// add an item
export function addItemTo(parentId) {
   // server update
   axios
      .post("/api/v1/loadouts/insert?parentId=" + parentId + "&name=new%20item")
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });

   // client side part (this is too keep what we see consistent with the database until it refreshes from the database)
   refreshPage(parentId);
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

export function setItemStatus(item, newStatus) {
   // server update
   axios
      .post(
         "/api/v1/loadouts/set-status?newStatus=" +
            newStatus +
            "&itemId=" +
            item.id
      )
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });

   // client side part (this is too keep what we see consistent with the database)
   item.status = newStatus;
   // this.forceUpdate();
   // refreshPage(item.parentId);
}

// delete an item
export function deleteItem(item) {
   console.log("deleting this item", item);

   // server update
   axios
      .post("/api/v1/loadouts/delete?itemId=" + item.id)
      .then((res) => {
         console.log("axios res", res);
      })
      .catch((error) => {
         // handle error
         console.log("axios error", error);
      });

   // client side part (this is too keep what we see consistent with the database until it refreshes from the database)
   refreshPage(item.parentId);
}
