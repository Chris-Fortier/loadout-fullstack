import axios from "axios";
// import store from "../store/store";

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

// processes all the items in a loadout, counting items and subitems, given a list of items (loadout)
// this is a pure function
export function processLoadout(loadout) {
   // initialize values in each item
   for (let i in loadout) {
      loadout[i].numChildren = 0;
      loadout[i].numResolvedChildren = 0;
      loadout[i].numUnresolvedChildren = 0;
      loadout[i].numDescendants = 0;
      loadout[i].numResolvedDescendants = 0;
      loadout[i].numUnresolvedDescendants = 0;
      loadout[i].contentSummary = "";
   }

   // increment an ancestor's counter by 1 and then do it again to its ancestor unless its null
   function incrementAncestorCounter(index, status) {
      if (loadout[index].parentId !== null) {
         // find its parent and add to its numDescendants counter
         for (let a in loadout) {
            // check if that is its grandparent
            if (loadout[index].parentId === loadout[a].id) {
               loadout[a].numDescendants++;
               if (status === 1) {
                  // count if it has a resolved status
                  loadout[a].numResolvedDescendants++;
               } else {
                  // count if it has an unresolved status
                  loadout[a].numUnresolvedDescendants++;
               }

               // continue incrementing counters on all ancestors
               incrementAncestorCounter(a);
            }
         }
      }
   }

   // add each item to its parent and ancestor counters
   for (let i in loadout) {
      // find its parent and add to its numChildren counter
      for (let p in loadout) {
         // check if that is its parent
         if (loadout[i].parentId === loadout[p].id) {
            loadout[i].parentName = loadout[p].name;
            loadout[p].numChildren++;
            loadout[p].numDescendants++;
            if (loadout[i].status === 1) {
               // count if it has a resolved status
               loadout[p].numResolvedChildren++;
               loadout[p].numResolvedDescendants++;
            } else {
               // count if it has an unresolved status
               loadout[p].numUnresolvedChildren++;
               loadout[p].numUnresolvedDescendants++;
            }
            // increment counters on all ancestors starting with the parent
            incrementAncestorCounter(p, loadout[i].status);
         }
      }
   }

   // get content summaries
   for (let i in loadout) {
      if (loadout[i].numUnresolvedDescendants > 0) {
         loadout[i].contentSummary =
            loadout[i].numUnresolvedDescendants + " left";
      } else if (loadout[i].status === 0) {
         loadout[i].contentSummary = "ready";
      }
   }

   // assign all children of an item to a certain level, then continue with its grandchildren
   function assignLevel(parentId, level) {
      // find each child
      for (let c in loadout) {
         if (loadout[c].parentId === parentId) {
            loadout[c].level = level;
            assignLevel(loadout[c].id, level + 1); // assign this item's children levels and so on
         }
      }
   }

   // get each item's level starting with the root node
   assignLevel(null, 1); // start with 1 instead of 0 because 0 is for the My Loadouts level, root node of a loadout is level 1

   return loadout;
}
