import React from "react";
import { connect } from "react-redux";
import { LEVEL_COLORS, MAX_ITEM_NAME_LENGTH } from "../../utils/helpers";
import classnames from "classnames";
import {
   PackedIcon,
   ReadyToPackIcon,
   NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon2,
   DeleteIcon,
   PickUpItem,
   CancelMoveIcon,
} from "../../icons/loadout-icons.js";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";
import axios from "axios";
import {
   processLoadout,
   deleteItemId,
   renameItem,
   toggleMoveableItemId,
   promoteChildrenThenDeleteItemId,
} from "../../utils/items";
import actions from "../../store/actions";

// new version of item card that deals with database data

class ItemCard extends React.Component {
   constructor(props) {
      super(props);

      // set default state values
      this.state = {
         isShowingDeleteConfirmation: false,
      };
   }

   // toggle the packed status of this item
   toggleIsPacked() {
      console.log("toggleIsPacked()...");
      const oldStatus = this.props.item.status;
      let newStatus = null;

      // only toggle packed if all its descendants are packed and if the user has permission to pack
      if (
         this.props.item.numUnresolvedDescendants === 0 &&
         this.props.currentUserLoadout.canPack === 1
      ) {
         if (oldStatus === 0) {
            console.log("set this item's status to packed");
            newStatus = 1;
         } else if (oldStatus === 1) {
            console.log("set this item's status to unpacked");
            newStatus = 0;
         }

         // do client side change immediately for the sake of responsiveness
         this.props.item.status = newStatus; // set the status locally
         this.props.dispatch({
            type: actions.STORE_CURRENT_LOADOUT,
            payload: processLoadout(this.props.currentLoadout),
         }); // update Redux

         // set the status in the database
         axios
            .put(
               "/api/v1/loadouts/set-status?newStatus=" +
                  newStatus +
                  "&itemId=" +
                  this.props.item.id
            )
            .then((res) => {
               console.log("axios res", res);
            })
            .catch((error) => {
               // handle error
               console.log("axios error", error);

               // if the server update fails, set it back the way it was
               this.props.item.status = oldStatus; // set the status locally
               this.props.dispatch({
                  type: actions.STORE_CURRENT_LOADOUT,
                  payload: processLoadout(this.props.currentLoadout),
               }); // update Redux

               // TODO: client side error message
            });
      }
   }

   // toggle the delete confirmation
   toggleDeleteModal() {
      console.log("this.state", this.state);
      this.setState({
         isShowingDeleteConfirmation: !this.state.isShowingDeleteConfirmation,
      });
   }

   renderDeleteConfirmation() {
      return (
         <div
            id="myModal"
            className="modal"
            onClick={() => {
               this.toggleDeleteModal();
            }}
         >
            <div
               className="modal-content"
               onClick={(e) => {
                  e.stopPropagation();
               }} // this stops it from doing the parent onClick even (stops it from closing if you click inside the modal)
            >
               <p>{`Are you sure you want to delete item "${this.props.item.name}"?`}</p>
               {this.props.item.numDescendants > 0 && (
                  <>
                     <div
                        className="button primary-action-button"
                        onClick={() => {
                           promoteChildrenThenDeleteItemId(
                              this.props.currentLoadout,
                              this.props.item.id
                           );
                        }}
                     >
                        {`Delete but promote it's ${this.props.item.numDescendants} subitems`}
                     </div>
                     <div
                        className="button danger-action-button"
                        onClick={() => {
                           deleteItemId(
                              this.props.currentLoadout,
                              this.props.item.id
                           );
                        }}
                     >
                        {`Delete it's ${this.props.item.numDescendants} subitems too`}
                     </div>
                  </>
               )}
               {this.props.item.numDescendants === 0 && (
                  <div
                     className="button primary-action-button"
                     onClick={() => {
                        deleteItemId(
                           this.props.currentLoadout,
                           this.props.item.id
                        );
                     }}
                  >
                     {`Delete item "${this.props.item.name}"`}
                  </div>
               )}
               <div
                  className="button secondary-action-button"
                  onClick={() => {
                     this.toggleDeleteModal();
                  }}
               >
                  Cancel
               </div>
            </div>
         </div>
      );
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

   render() {
      const item = this.props.item; // this is to simplify code below
      // const level = this.props.currentLevel + 1; // now the level of the item card is the currentLevel + 1 because it is one level below the page's level
      const level = this.props.item.level; // now it uses the level of the item generated in processLoadout

      const thisLevelRotated = (level + LEVEL_COLORS) % LEVEL_COLORS;
      const childLevelRotated = (level + LEVEL_COLORS + 1) % LEVEL_COLORS;

      // set the tooltip for the pack/unpack toggler
      let packTooltip = "";
      if (this.props.currentUserLoadout.canPack === 0) {
         packTooltip =
            "You do not have permission to pack/unpack on this loadout.";
      } else if (item.numUnresolvedDescendants > 0) {
         packTooltip = "You need to pack this item's subitems first.";
      } else if (item.status === 0) {
         packTooltip = "Pack";
      } else if (item.status === 1) {
         packTooltip = "Unpack";
      }

      // set the tooltip for the move button
      let moveTooltip = "";
      if (this.props.moveableItemIds.includes(this.props.item.id)) {
         moveTooltip = "Put item back";
      } else {
         moveTooltip = "Move this item";
      }

      // set the tooltip for the subitems button
      let subitemsTooltip = "";
      if (this.props.isEditMode) {
         subitemsTooltip = "Edit subitems...";
      } else {
         subitemsTooltip = "View subitems...";
      }

      return (
         <div
            className={classnames(
               level <= 1 && "loadout-card",
               level > 1 && `item-card item-card-border-${thisLevelRotated}`,
               level > 1 &&
                  item.status === 0 &&
                  "child-bg child-bg-level-" + String(level % LEVEL_COLORS),
               level > 1 &&
                  item.status === 1 &&
                  "child-packed-bg child-packed-bg-level-" +
                     String(level % LEVEL_COLORS),
               this.props.moveableItemIds.includes(this.props.item.id) &&
                  "picked-up-item"
            )}
         >
            {/* <div className="float-left"> */}
            <div className="d-flex">
               {level <= 1 && (
                  <span
                     className={classnames(
                        "flex-fill item-card-text",
                        `level-text-color-${thisLevelRotated}`
                     )}
                  >
                     <span
                        className="navigation-link"
                        onClick={(e) => {
                           movePageToDifferentItem(this.props.item.id, +1);
                        }}
                     >
                        {item.name}
                     </span>
                  </span>
               )}

               {level > 1 && !this.props.isEditMode && (
                  <>
                     <span
                        className={classnames(
                           "item-card-icon",
                           `item-icon-colors-${thisLevelRotated}`,
                           "item-icon-colors",
                           {
                              clickable:
                                 item.numUnresolvedDescendants === 0 &&
                                 this.props.currentUserLoadout.canPack === 1,
                              disabled:
                                 item.numUnresolvedDescendants > 0 ||
                                 this.props.currentUserLoadout.canPack === 0,
                           }
                        )}
                        onClick={(e) => {
                           this.toggleIsPacked();
                        }}
                        title={packTooltip}
                     >
                        {item.status === 1 && <PackedIcon />}
                        {item.status === 0 &&
                           item.numUnresolvedDescendants === 0 && (
                              <ReadyToPackIcon />
                           )}
                        {item.status === 0 &&
                           item.numUnresolvedDescendants > 0 && (
                              <NotReadyToPackIcon />
                           )}
                     </span>
                     <span
                        className="icon-button-gap"
                        // onClick={(e) => {
                        //    this.toggleIsPacked();
                        // }}
                        // title={packTooltip}
                     ></span>
                     <span
                        className={classnames(
                           `flex-fill item-card-text level-text-color-child level-text-color-${thisLevelRotated}`
                        )}
                     >
                        <span
                           className={classnames({
                              clickable:
                                 item.numUnresolvedDescendants === 0 &&
                                 this.props.currentUserLoadout.canPack === 1,
                              // disabled:
                              //    item.numResolvedChildren < item.numChildren,
                           })}
                           onClick={(e) => {
                              this.toggleIsPacked();
                           }}
                           title={packTooltip}
                        >
                           {item.name}
                        </span>
                     </span>
                  </>
               )}

               {level > 1 && this.props.isEditMode && (
                  <>
                     <span
                        className={`item-card-icon clickable item-icon-colors item-icon-colors-${thisLevelRotated}`}
                        onClick={() => {
                           this.toggleDeleteModal();
                        }}
                        title="Delete this item..."
                     >
                        <DeleteIcon />
                     </span>
                     <span className="icon-button-gap"></span>
                     <span
                        className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${thisLevelRotated}`}
                        onClick={() => toggleMoveableItemId(item.id)}
                        title={moveTooltip}
                     >
                        {!this.props.moveableItemIds.includes(
                           this.props.item.id
                        ) && <PickUpItem />}
                        {this.props.moveableItemIds.includes(
                           this.props.item.id
                        ) && <CancelMoveIcon />}
                     </span>
                     <span className="icon-button-gap"></span>
                     <input
                        className={`flex-fill card-item-input level-text-color-child level-text-color-${thisLevelRotated}`}
                        id={"edit-name-input-" + item.id}
                        defaultValue={item.name}
                        onBlur={(e) => this.renameThisItem(e)}
                        maxLength={MAX_ITEM_NAME_LENGTH}
                     />
                  </>
               )}

               {item.numDescendants > 0 && !this.props.isEditMode && (
                  <span
                     onClick={(e) => {
                        movePageToDifferentItem(this.props.item.id, +1);
                     }}
                     className={classnames(
                        `button navigation-link item-card-text level-text-color-this level-text-color-${childLevelRotated}`
                     )}
                     title={subitemsTooltip}
                  >
                     {item.contentSummary}
                  </span>
               )}

               {(item.numDescendants > 0 || this.props.isEditMode) && (
                  <>
                     <span className="icon-button-gap"></span>
                     <span
                        className={classnames(
                           `icon-dark item-card-icon item-icon-colors item-icon-colors-${thisLevelRotated} clickable`
                        )}
                        onClick={(e) => {
                           movePageToDifferentItem(this.props.item.id, +1);
                        }}
                        title={subitemsTooltip}
                     >
                        {!this.props.isEditMode &&
                           item.numUnresolvedDescendants === 0 && (
                              <ChildrenPackedIcon2 />
                           )}
                        {(this.props.isEditMode ||
                           item.numUnresolvedDescendants > 0) && (
                           <ChildrenUnpackedIcon />
                        )}
                     </span>
                  </>
               )}
            </div>
            {this.state.isShowingDeleteConfirmation &&
               this.renderDeleteConfirmation()}
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // currentLoadout: state.currentLoadout, // TODO, do I need this anymore?
      currentItem: state.currentItem,
      currentUserLoadout: state.currentUserLoadout,
      currentLoadout: state.currentLoadout,
      isEditMode: state.isEditMode,
      moveableItemIds: state.moveableItemIds,
   };
}

export default connect(mapStateToProps)(ItemCard); // this is "currying"
