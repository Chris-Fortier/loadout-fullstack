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

class ItemCardEdit extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values
      this.state = {
         isShowingDeleteConfirmation: false,
      };
   }

   // toggle the delete confirmation
   toggleDeleteRollout() {
      console.log("this.state", this.state);
      this.setState({
         isShowingDeleteConfirmation: !this.state.isShowingDeleteConfirmation,
      });
   }

   rolloutDeleteConfirmation(thisItemPath) {
      return (
         <>
            <div
               className="button primary-action-button"
               onClick={(e) => {
                  deleteItem(this.props.currentLoadout.gear, thisItemPath);
               }}
            >
               Delete {this.props.item.name}
               {this.props.item.numDescendants > 0 && (
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
               Cancel
            </div>
         </>
      );
   }

   render() {
      const item = this.props.item; // this is to simplify code below

      let thisItemPath = this.props.currentLoadout.itemIndexPath.concat([
         item.index,
      ]); // stores the complete index path to the item referred to on this item card

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
                        id={"edit-name-input-" + item.index}
                        defaultValue={item.name}
                        onChange={(e) =>
                           renameItem(
                              this.props.currentLoadout.gear,
                              thisItemPath,
                              e.target.value
                           )
                        }
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
                  this.rolloutDeleteConfirmation(thisItemPath)}
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
