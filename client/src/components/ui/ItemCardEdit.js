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
   IconTrash,
   IconChevronDown,
   IconChevronUp,
} from "../../icons/icons.js";
// import { processAllItems } from "../../utils/processItems";
import classnames from "classnames";
import {
   // getItemFromPath,
   // getParentItemFromPath,
   renameItem,
   deleteItem,
} from "../../utils/items";
import actions from "../../store/actions";

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
               className="button primary-action-button"
               onClick={(e) => {
                  deleteItem(this.props.item);
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

   render() {
      const item = this.props.item; // this is to simplify code below

      // let thisItemPath = this.props.currentLoadout.itemIndexPath.concat([
      //    item.index,
      // ]); // stores the complete index path to the item referred to on this item card

      return (
         <>
            <div
               className={
                  "item-card-edit child-color-" +
                  String(item.level % LEVEL_COLORS)
               }
            >
               <div className="d-flex">
                  <span className="flex-fill">
                     <input
                        className="edit-name"
                        id={"edit-name-input-" + item.id}
                        defaultValue={item.name}
                        onBlur={(e) => this.renameThisItem(e)}
                        maxLength={MAX_ITEM_NAME_LENGTH}
                     />
                  </span>

                  <span
                     className={classnames(
                        "item-card-icon clickable",
                        UI_APPEARANCE === "light" && "icon-dark",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE === "colors" && "icon-dark"
                     )}
                     // onClick={(e) => {
                     //    this.deleteItem(thisItemPath);

                     // }}
                     onClick={() => this.toggleDeleteRollout()}
                  >
                     <IconTrash />
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
      // currentLoadout: state.currentLoadout,
      childItems: state.childItems,
   };
}

export default connect(mapStateToProps)(ItemCardEdit); // this is "currying"
