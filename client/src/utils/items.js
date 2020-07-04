import { processAllItems } from "./processItems";
import { v4 as getUuid } from "uuid";

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
export function renameItem(gear, itemIndexPath, newName) {
   // console.log("rename " + this.props.item.name + " to " + newName);

   // console.log("itemIndexPath:", itemIndexPath);

   // get the actual item I want to change based on the index path
   const currentItem = getItemFromPath(gear, itemIndexPath);

   // meat of what this funtion does
   currentItem.name = newName;

   // this must happen whenever something in the loadout changes
   processAllItems(gear);
}

// add an item
export function addItemTo(gear, itemIndexPath) {
   // get the actual item I want to add an item inside
   const currentItem = getItemFromPath(gear, itemIndexPath);

   // meat of what this funtion does
   currentItem.items.push({
      name: "New Item",
      id: getUuid(),
      parentId: currentItem.id,
      isPacked: false,
   }); // add a new item inside the current item

   // this must happen whenever something in the loadout changes
   processAllItems(gear);
}

// add an item that can contain other items
export function addContainerTo(gear, itemIndexPath) {
   // get the actual item I want to add an item inside
   const currentItem = getItemFromPath(gear, itemIndexPath);

   // meat of what this funtion does
   currentItem.items.push({
      name: "New Container",
      id: getUuid(),
      parentId: currentItem.id,
      isPacked: false,
      items: [], // having this lets it contain other items
   }); // add a new item inside the current item

   // this must happen whenever something in the loadout changes
   processAllItems(gear);
}

// deletes an item
export function deleteItem(gear, itemIndexPath) {
   // if (this.props.item.numDescendants > 0) {
   //    console.log(
   //       "Are you sure you want to delete " +
   //          this.props.item.name +
   //          " and its " +
   //          this.props.item.numDescendants +
   //          " subitems?"
   //    );
   // } else {
   //    console.log("deleting " + this.props.item.name);
   // }

   // console.log("itemIndexPath:", itemIndexPath);

   // get the parent item because that is the item that's items I want to delete from
   const parentItem = getParentItemFromPath(gear, itemIndexPath);
   // console.log("name of parent item:", parentItem.name);

   const itemIndex = itemIndexPath[itemIndexPath.length - 1];

   // meat of what this funtion does
   parentItem.items.splice(itemIndex, 1); // delete the item

   // this must happen whenever something in the loadout changes
   processAllItems(gear);
}
