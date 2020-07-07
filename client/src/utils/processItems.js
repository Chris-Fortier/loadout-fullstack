import { SUBITEM_DISPLAY_MODE } from "./helpers";
import actions from "../store/actions";
import store from "../store/store";

function processItemAndDescendants(item, level = null) {
   let nextLevel = level;
   if (level !== null) {
      item.level = level;
      nextLevel = level + 1;
   }

   // if this item has subitems, fix the subitems
   if (item.hasOwnProperty("items")) {
      console.log("fixing data for the sub items of", item.name);

      item.numChildren = item.items.length;
      item.numDescendants = item.numChildren;
      item.numPackedChildren = 0; // intialize this and count below
      item.numPackedDescendants = 0; // intialize this and count below

      for (let i in item.items) {
         item.items[i].parentName = item.name;
         item.items[i].index = parseInt(i);
         // item.items[i].fixed = true;
         if (item.items[i].isPacked) {
            item.numPackedChildren++; // count a packed child
            item.numPackedDescendants++; // also count as a packed descendant
         }
         const descendantInfo = processItemAndDescendants(
            item.items[i],
            nextLevel
         );

         // add descendant info to this item's couters
         item.numDescendants =
            item.numDescendants + descendantInfo.numDescendants;
         item.numPackedDescendants =
            item.numPackedDescendants + descendantInfo.numPackedDescendants;
      }

      // if any descendant is unpacked, this should be unpacked also
      if (item.numPackedDescendants < item.numDescendants) {
         item.isPacked = false;
      }
   } else {
      item.numChildren = 0;
      item.numDescendants = 0;
      item.numPackedChildren = 0;
      item.numPackedDescendants = 0;
   }

   // get the number of unpacked descedants, could be useful in sorting by which items need the most "work"
   item.numUnpackedDescendants =
      item.numDescendants - item.numPackedDescendants;
   item.numUnpackedChildren = item.numChildren - item.numPackedChildren;

   // generate the text that would be displayed to summarize the packed status of the contents of this item
   if (SUBITEM_DISPLAY_MODE === "packedChildrenOutOfTotalChildren") {
      item.contentSummary = item.numPackedChildren + " / " + item.numChildren;
   } else if (SUBITEM_DISPLAY_MODE === "numUnpackedDescendants") {
      if (item.numUnpackedDescendants > 0) {
         item.contentSummary = item.numUnpackedDescendants + " left";
      } else if (!item.isPacked) {
         item.contentSummary = "ready";
      } else {
         item.contentSummary = "";
      }
   } else if (SUBITEM_DISPLAY_MODE === "numUnpackedChildren") {
      if (item.numUnpackedChildren > 0) {
         item.contentSummary = item.numUnpackedChildren + " left";
      } else if (!item.isPacked) {
         item.contentSummary = "ready";
      } else {
         item.contentSummary = "";
      }
   }

   return {
      numDescendants: item.numDescendants,
      numPackedDescendants: item.numPackedDescendants,
   };
}

// processing all item data and put the result back into the store
export function processAllItems(gear) {
   // console.log("processing all items");
   const rootItem = gear;
   console.log("rootItem", rootItem);
   processItemAndDescendants(rootItem, 0);

   // put the processed data back into the store
   store.dispatch({
      type: actions.STORE_CURRENT_LOADOUT,
      payload: rootItem,
   });

   // this.forceUpdate();
}
// end duplicated code
