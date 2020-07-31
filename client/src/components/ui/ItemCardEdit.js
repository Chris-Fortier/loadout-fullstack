import React from "react";
import { connect } from "react-redux";
import {
   MOVE_UPDOWN,
   MAX_ITEM_NAME_LENGTH,
   LEVEL_COLORS,
} from "../../utils/helpers";
import { IconChevronDown, IconChevronUp } from "../../icons/icons.js";
import { DeleteIcon, ChildrenAddIcon } from "../../icons/loadout-icons.js";
import classnames from "classnames";
import { renameItem, deleteItem, processLoadout } from "../../utils/items";
import actions from "../../store/actions";
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

         // rename the item on client
         // make local changes so we can see them immediately
         const foundItem = this.props.currentLoadout.find(
            (item) => item.id === this.props.item.id
         ); // find the specific item to change the name of
         console.log("foundItem.name", foundItem.name);
         foundItem.name = e.target.value; // rename the item to the new name
         // send update to Redux
         this.props.dispatch({
            type: actions.STORE_CURRENT_LOADOUT,
            payload: this.props.currentLoadout,
         });

         renameItem(this.props.item.id, e.target.value); // send the change of the name to the server
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
                     and {this.props.item.numDescendants} subitems
                  </>
               )}
            </div>
            <div
               className="button navigation-link"
               onClick={() => this.toggleDeleteRollout()}
            >
               <br />
               Cancel
            </div>
         </>
      );
   }

   // renames item on server and also in redux store
   deleteThisItem() {
      console.log("will delete ", this.props.item.name);

      // make local changes so we can see them immediately
      const foundItemIndex = this.props.currentLoadout.findIndex(
         (item) => item.id === this.props.item.id
      ); // find the specific item to change the name of
      this.props.currentLoadout.splice(foundItemIndex, 1); // make a new array of items with the deleted item removed
      // send update to Redux
      this.props.dispatch({
         type: actions.STORE_CURRENT_LOADOUT,
         payload: processLoadout(this.props.currentLoadout), // need to process in this case because I am changing the amount of items
      });

      deleteItem(this.props.item.id); // send the deletion request to the server
   }

   render() {
      const item = this.props.item; // this is to simplify code below
      // const level = this.props.currentLevel + 1; // now the level of the item card is the currentLevel + 1 because it is one level below the page's level
      const level = this.props.item.level; // now it uses the level of the item generated in processLoadout

      const thisLevelRotated = (level + LEVEL_COLORS) % LEVEL_COLORS;

      // let thisItemPath = this.props.currentLoadout.itemIndexPath.concat([
      //    item.index,
      // ]); // stores the complete index path to the item referred to on this item card

      return (
         <>
            <div
               // className={
               //    "item-card-edit child-bg-level-" +
               //    String(item.level % LEVEL_COLORS)
               // }
               className={classnames(
                  `item-card-edit child-bg child-bg-level-${thisLevelRotated}`
               )}
            >
               <div className="d-flex">
                  <span
                     className={`item-card-icon clickable item-icon-colors item-icon-colors-${thisLevelRotated}`}
                     onClick={() => this.toggleDeleteRollout()}
                  >
                     <DeleteIcon />
                  </span>

                  <span style={{ width: "8px" }}></span>

                  <span className="flex-fill">
                     <input
                        className={`edit-name level-text-color-child level-text-color-${thisLevelRotated}`}
                        id={"edit-name-input-" + item.id}
                        defaultValue={item.name}
                        onBlur={(e) => this.renameThisItem(e)}
                        maxLength={MAX_ITEM_NAME_LENGTH}
                     />
                  </span>

                  <span style={{ width: "8px" }}></span>

                  <span
                     className={`item-card-icon clickable item-icon-colors item-icon-colors-${thisLevelRotated}`}
                     onClick={(e) => {
                        // TODO: I think we need to unpack the item if its possible to add a subitem to a packed item
                        movePageToDifferentItem(this.props.item.id, +1);
                        // change the text in the page item editable input
                        if (
                           document.getElementById("page-item-name-input") !==
                           null
                        ) {
                           document.getElementById(
                              "page-item-name-input"
                           ).value = item.name;
                        }
                     }}
                  >
                     <ChildrenAddIcon />
                  </span>

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
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(ItemCardEdit); // this is "currying"
