import axios from "axios";
import store from "../store/store";
import actions from "../store/actions";

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
      .put("/api/v1/loadouts/set-name?itemId=" + itemId + "&newName=" + newName)
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
      .put(
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
      .delete("/api/v1/loadouts/delete?itemId=" + itemId)
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
   console.log("processLoadout()...");

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

   // send data up the chain
   for (let i in loadout) {
      const thisItem = loadout[i]; // item that's data we are sending up
      let ancestorId = thisItem.parentId; // the nearest ancestor

      // determine how this will be counted
      let descendantCount = 0;
      let resolvedDescendantCount = 0;
      let unresolvedDescendantCount = 0;
      let thisIsUnResolved = false;
      if (thisItem.status !== 4) {
         descendantCount = 1;
      }
      if (thisItem.status === 1 || thisItem.status === 2) {
         resolvedDescendantCount = 1;
      }
      if (thisItem.status === 0 || thisItem.status === 3) {
         unresolvedDescendantCount = 1;
         thisIsUnResolved = true;
      }

      // do stuff for each ancestor
      while (ancestorId !== null) {
         // get the ancestor item
         const ancestorItem = loadout.find((item) => {
            return item.id === ancestorId;
         });

         // if this item is not an orphan
         if (ancestorItem !== undefined) {
            // add to counters
            ancestorItem.numDescendants += descendantCount;
            ancestorItem.numResolvedDescendants += resolvedDescendantCount;
            ancestorItem.numUnresolvedDescendants += unresolvedDescendantCount;

            // unpack any ancestor if this item is unresolved
            if (thisIsUnResolved) {
               // if it is set to packed, set it to unpacked
               if (ancestorItem.status === 1) {
                  ancestorItem.status = 0;
                  console.log(
                     "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ANCESTOR STATUS CHANGED!"
                  );
                  // TODO update on server too

                  // TODO now the count will be off, so I need to change to counters to compensate
                  unresolvedDescendantCount = 2;
                  resolvedDescendantCount = -1;
               }
            }

            ancestorId = ancestorItem.parentId; // go up to next ancestor
         } else {
            ancestorId = null; // set it to null and this will stop trying to find ancestors for this orphan
         }
      }
   }

   // // increment an ancestor's counter by 1 and then do it again to its ancestor unless its null
   // function incrementAncestorCounter(index, status, hasUnresolvedDescendants) {
   //    if (loadout[index].parentId !== null) {
   //       // find its parent and add to its numDescendants counter
   //       for (let a in loadout) {
   //          // check if that is its parent
   //          if (loadout[index].parentId === loadout[a].id) {
   //             // if this isn't a compartment/group
   //             if (status !== 4) {
   //                loadout[a].numDescendants++;
   //                if (!hasUnresolvedDescendants) {
   //                   // count if it has a resolved status
   //                   loadout[a].numResolvedDescendants++;
   //                } else {
   //                   // count if it has an unresolved status
   //                   loadout[a].numUnresolvedDescendants++;
   //                   hasUnresolvedDescendants = true;
   //                }

   //                // if it has any unresolved descendants, change the status
   //                if (hasUnresolvedDescendants) {
   //                   // if it is set to packed, set it to unpacked
   //                   if (loadout[a].status === 1) {
   //                      loadout[a].status = 0;
   //                      console.log(
   //                         "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ANCESTOR STATUS CHANGED!"
   //                      );
   //                   }
   //                }
   //             }

   //             // continue incrementing counters on all ancestors
   //             incrementAncestorCounter(
   //                a,
   //                loadout[a].status,
   //                hasUnresolvedDescendants
   //             );
   //          }
   //       }
   //    }
   // }

   // // add each item to its parent and ancestor counters
   // for (let i in loadout) {
   //    // find its parent and add to its numChildren counter
   //    for (let p in loadout) {
   //       // check if that is its parent
   //       if (loadout[i].parentId === loadout[p].id) {
   //          let hasUnresolvedDescendants = false;
   //          loadout[i].parentName = loadout[p].name;
   //          // if this isn't a compartment/group
   //          if (loadout[i].status !== 4) {
   //             loadout[p].numChildren++;
   //             loadout[p].numDescendants++;

   //             if (loadout[i].status === 1 || loadout[i].status === 2) {
   //                // count if it has a resolved status
   //                loadout[p].numResolvedChildren++;
   //                loadout[p].numResolvedDescendants++;
   //             } else {
   //                // count if it has an unresolved status
   //                loadout[p].numUnresolvedChildren++;
   //                loadout[p].numUnresolvedDescendants++;
   //                hasUnresolvedDescendants = true;
   //             }
   //             // if it has any unresolved descendants, change the status
   //             if (hasUnresolvedDescendants) {
   //                // if it is set to packed, set it to unpacked
   //                if (loadout[p].status === 1) {
   //                   loadout[p].status = 0;
   //                   console.log(
   //                      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!PARENT STATUS CHANGED!"
   //                   );
   //                }
   //             }
   //          }

   //          // increment counters on all ancestors starting with the parent
   //          incrementAncestorCounter(
   //             p,
   //             loadout[i].status,
   //             hasUnresolvedDescendants
   //          );
   //       }
   //    }
   // }

   // get content summaries
   for (let i in loadout) {
      // if (loadout[i].numUnresolvedDescendants > 0) {
      //    loadout[i].contentSummary =
      //       loadout[i].numUnresolvedDescendants + " left";
      // } else if (loadout[i].status === 0) {
      //    loadout[i].contentSummary = "ready";
      // }
      if (loadout[i].numDescendants > 0) {
         loadout[
            i
         ].contentSummary = `${loadout[i].numResolvedDescendants} / ${loadout[i].numDescendants}`;
      } else {
         loadout[i].contentSummary = "";
      }
   }

   // assign all children of an item to a certain level, then continue with its grandchildren
   function assignLevel(
      parentId = null,
      level = 1,
      nearestItemAncestorId = null,
      nearestItemAncestorName = ""
   ) {
      // find each child
      for (let c in loadout) {
         if (loadout[c].parentId === parentId) {
            let levelToAssign = level;
            if (loadout[c].status === 4) {
               levelToAssign = level - 1; // containers get the same level as their parent
            }
            loadout[c].level = levelToAssign;
            loadout[c].upLevelId = nearestItemAncestorId; // assign where the up level link goes to
            loadout[c].upLevelName = nearestItemAncestorName; // assign where the up level link goes to
            if (loadout[c].status !== 4) {
               assignLevel(
                  loadout[c].id,
                  levelToAssign + 1,
                  loadout[c].id,
                  loadout[c].name
               ); // any children will up level link to this because this is not a compartment
            } else {
               assignLevel(
                  loadout[c].id,
                  levelToAssign + 1,
                  nearestItemAncestorId,
                  nearestItemAncestorName
               ); // assign this item's children levels and so on
            }
         }
      }
   }

   // get each item's level starting with the root node
   assignLevel(); // start with 1 instead of 0 because 0 is for the My Loadouts level, root node of a loadout is level 1

   return loadout;
}

// add or remove as a moveable item
export function toggleMoveableItemId(itemId) {
   store.dispatch({
      type: actions.TOGGLE_MOVEABLE_ITEM_ID,
      payload: itemId,
   });
}

// deletes item on server and also in redux store
export function deleteItemId(loadout, itemId) {
   // make local changes so we can see them immediately
   const foundItemIndex = loadout.findIndex((item) => item.id === itemId); // find the specific item to change the name of
   loadout.splice(foundItemIndex, 1); // make a new array of items with the deleted item removed
   // send update to Redux
   store.dispatch({
      type: actions.STORE_CURRENT_LOADOUT,
      payload: processLoadout(loadout), // need to process in this case because I am changing the amount of items
   });

   deleteItem(itemId); // send the deletion request to the server
}
