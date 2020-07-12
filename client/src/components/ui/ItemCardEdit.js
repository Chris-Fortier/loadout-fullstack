import React from "react";
import { connect } from "react-redux";
// import actions from "../../store/actions";
import {
   MOVE_UPDOWN,
   MAX_ITEM_NAME_LENGTH,
   LEVEL_COLORS,
   UI_APPEARANCE,
} from "../../utils/helpers";
// import classnames from "classnames";
import {
   // IconArrowThinRightCircle,
   // IconTrash,
   IconChevronDown,
   IconChevronUp,
} from "../../icons/icons.js";
import { DeleteItemIcon, ChildrenAddIcon } from "../../icons/loadout-icons.js";

// import { processAllItems } from "../../utils/processItems";
import classnames from "classnames";
import {
   // getItemFromPath,
   // getParentItemFromPath,
   renameItem,
   deleteItem,
   addItemTo,
} from "../../utils/items";
import actions from "../../store/actions";
import { v4 as getUuid } from "uuid";
import { setItemStatus } from "../../utils/items";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";

class ItemCardEdit extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values
      this.state = {
         isShowingDeleteConfirmation: false,
      };
   }

   // renames item on server and also in redux store
   renameThisItem(e) {
      console.log("the focus left this item");
      if (e.target.value !== this.props.item.name) {
         console.log("the name was changed");
         console.log(
            "will rename ",
            this.props.item.name,
            "to",
            e.target.value
         );
         renameItem(this.props.item.id, e.target.value); // send the change of the name to the server

         // make local changes so we can see them immediately
         // const newChildItems = [...this.props.childItems]; // makes a deep copy of child items to edit locally
         // console.log(newChildItems);

         // its that all I have to do is this, direclty edit the name in props, no need to dispatch it
         const foundChild = this.props.childItems.find(
            (childItem) => childItem.id === this.props.item.id
         ); // find the specific child item to change the name of
         console.log("foundChild.name", foundChild.name);
         foundChild.name = e.target.value; // rename the child to the new name

         // send the updated child items to the store, even without this I see the changes with the code above
         this.props.dispatch({
            type: actions.STORE_CHILD_ITEMS,
            payload: this.props.childItems,
         });
      } else {
         console.log("the name was not changed");
      }
   }

   // toggle the delete confirmation
   toggleDeleteRollout() {
      console.log("this.state", this.state);
      this.setState({
         isShowingDeleteConfirmation: !this.state.isShowingDeleteConfirmation,
      });
   }

   rolloutDeleteConfirmation() {
      return (
         <>
            <div
               className={classnames("button", {
                  "primary-action-button": this.props.item.numChildren === 0,
                  "danger-action-button": this.props.item.numChildren > 0,
               })}
               onClick={(e) => {
                  this.deleteThisItem();
               }}
            >
               Delete {this.props.item.name}
               {/* {this.props.item.numDescendants > 0 && (
                  <>
                     <br />
                     and {this.props.item.numDescendants} subitems
                  </>
               )} */}
               {this.props.item.numChildren > 0 && (
                  <>
                     <br />
                     and {this.props.item.numChildren} subitems
                  </>
               )}
            </div>
            <div
               className="button navigation-link"
               onClick={() => this.toggleDeleteRollout()}
            >
               Cancel
            </div>
         </>
      );
   }

   // renames item on server and also in redux store
   deleteThisItem() {
      console.log("will delete ", this.props.item.name);
      deleteItem(this.props.item.id); // send the change of the name to the server

      // make local changes so we can see them immediately
      // its that all I have to do is this, direclty edit the name in props, no need to dispatch it
      const foundChildIndex = this.props.childItems.findIndex(
         (childItem) => childItem.id === this.props.item.id
      ); // find the specific child item to change the name of
      console.log("foundChildIndex", foundChildIndex);
      const newChildItems = [...this.props.childItems]; // make a new array of children with the deleted child removed
      newChildItems.splice(foundChildIndex, 1);

      // send the updated child items to the store
      this.props.dispatch({
         type: actions.STORE_CHILD_ITEMS,
         payload: newChildItems,
      });
   }

   // adds a new sub item on the server, then moves to the see the subitems of this item while still in edit mode
   async addSubItemAndMoveTo() {
      setItemStatus(this.props.item, 0); // unpack this item in order to add a new (default unpacked) subitem
      const newItemId = getUuid(); // get the uuid client side that way it is easier to reference the id of the input element
      const otherId = await addItemTo(this.props.item.id, newItemId); // add an item as a child of the current item
      console.log({ otherId });
      // refreshPage(this.props.currentItem.parentId); // refresh the page AFTER we generate the new item and before we set the focus on the new element
      const inputElementId = "edit-name-input-" + newItemId;
      console.log({ inputElementId });

      // move to the item's page to view the new subitem
      movePageToDifferentItem(this.props.item.id, +1);

      document.getElementById(
         "page-item-name-input"
      ).value = this.props.item.name; // set the text inside of the page item name

      // // add a new card for the new item without refreshing page
      // const newChildItems = [
      //    ...this.props.childItems,
      //    {
      //       name: "newestest item",
      //       id: newItemId,
      //       status: 0,
      //       parentId: this.props.currentItem.id,
      //       numChildren: 0,
      //       numPackedChildren: 0,
      //       numUnpackedChildren: 0,
      //       contentSummary: "ready",
      //    },
      // ];
      // this.props.dispatch({
      //    type: actions.STORE_CHILD_ITEMS,
      //    payload: newChildItems,
      // });

      // sets focus to the new item card and selects it's text
      // const input = document.getElementById(inputElementId);
      // input.focus();
      // input.select();
   }

   render() {
      const item = this.props.item; // this is to simplify code below
      const level = this.props.currentLevel + 1; // now the level of the item card is the currentLevel + 1 ebecause it is one level below the page's level

      // let thisItemPath = this.props.currentLoadout.itemIndexPath.concat([
      //    item.index,
      // ]); // stores the complete index path to the item referred to on this item card

      return (
         <>
            <div
               // className={
               //    "item-card-edit child-color-" +
               //    String(item.level % LEVEL_COLORS)
               // }
               className={classnames(
                  "item-card-edit",
                  UI_APPEARANCE === "light" && "child-bg-light",
                  UI_APPEARANCE === "dark" && "child-bg-dark",
                  UI_APPEARANCE === "colors" &&
                     "child-color-" + String(level % LEVEL_COLORS)
               )}
            >
               <div className="d-flex">
                  <span
                     className={classnames(
                        "icon-dark item-card-icon clickable",
                        (UI_APPEARANCE === "light" ||
                           UI_APPEARANCE === "dark") &&
                           "item-icon-colors-" + String(level % LEVEL_COLORS),
                        UI_APPEARANCE === "colors" && "item-icon-colors"
                     )}
                     onClick={() => this.toggleDeleteRollout()}
                  >
                     <DeleteItemIcon />
                  </span>

                  <span style={{ width: "8px" }}></span>

                  <span className="flex-fill">
                     <input
                        className="edit-name"
                        id={"edit-name-input-" + item.id}
                        defaultValue={item.name}
                        onBlur={(e) => this.renameThisItem(e)}
                        maxLength={MAX_ITEM_NAME_LENGTH}
                     />
                  </span>

                  {this.props.item.numChildren === 0 && (
                     <>
                        <span style={{ width: "8px" }}></span>

                        <span
                           className={classnames(
                              "icon-dark item-card-icon clickable",
                              (UI_APPEARANCE === "light" ||
                                 UI_APPEARANCE === "dark") &&
                                 "item-icon-colors-" +
                                    String(level % LEVEL_COLORS),
                              UI_APPEARANCE === "colors" && "item-icon-colors"
                           )}
                           onClick={() => this.addSubItemAndMoveTo()}
                        >
                           <ChildrenAddIcon />
                        </span>
                     </>
                  )}

                  {MOVE_UPDOWN && (
                     <>
                        <div className="icon-container">
                           <IconChevronUp />
                        </div>
                        <div className="icon-container">
                           <IconChevronDown />
                        </div>
                     </>
                  )}
               </div>
               {this.state.isShowingDeleteConfirmation &&
                  this.rolloutDeleteConfirmation()}
            </div>
         </>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // currentLoadout: state.currentLoadout,
      childItems: state.childItems,
      currentLevel: state.currentLevel,
   };
}

export default connect(mapStateToProps)(ItemCardEdit); // this is "currying"
