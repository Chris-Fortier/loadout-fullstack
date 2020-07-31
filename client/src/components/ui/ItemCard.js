import React from "react";
import { connect } from "react-redux";
import { LEVEL_COLORS } from "../../utils/helpers";
import classnames from "classnames";
import {
   PackedIcon,
   ReadyToPackIcon,
   NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon2,
} from "../../icons/loadout-icons.js";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";
import axios from "axios";
import { processLoadout } from "../../utils/items";
import actions from "../../store/actions";

// new version of item card that deals with database data

class ItemCard extends React.Component {
   // recountPageItems() {
   //    console.log("recountPageItems()...");
   //    console.log(this.props.currentItem);
   //    console.log(this.props.childItems);
   // }

   // toggle the packed status of this item
   toggleIsPacked() {
      console.log("toggleIsPacked()...");
      const oldStatus = this.props.item.status;
      let newStatus = null;

      // only toggle packed if all its descendants are packed and if the user has permission to pack
      if (
         this.props.item.numUnresolvedChildren === 0 &&
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
            .post(
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

   render() {
      const item = this.props.item; // this is to simplify code below
      // const level = this.props.currentLevel + 1; // now the level of the item card is the currentLevel + 1 because it is one level below the page's level
      const level = this.props.item.level; // now it uses the level of the item generated in processLoadout

      const thisLevelRotated = (level + LEVEL_COLORS) % LEVEL_COLORS;
      const childLevelRotated = (level + LEVEL_COLORS + 1) % LEVEL_COLORS;

      return (
         <div
            className={classnames(
               level <= 1 && "loadout-card",
               level > 1 && "item-card",
               level > 1 &&
                  item.status === 0 &&
                  "child-bg child-bg-level-" + String(level % LEVEL_COLORS),
               level > 1 &&
                  item.status === 1 &&
                  "child-packed-bg child-packed-bg-level-" +
                     String(level % LEVEL_COLORS)
            )}
            id={"item-card-" + item.index}
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

               {level > 1 && (
                  <>
                     <span
                        className={classnames(
                           "item-card-icon",
                           `item-icon-colors-${thisLevelRotated}`,
                           "item-icon-colors",
                           // (UI_APPEARANCE === "light" ||
                           //    UI_APPEARANCE === "dark") &&
                           //    "item-icon-colors-" +
                           //       String(level % LEVEL_COLORS),
                           // UI_APPEARANCE === "colors" && "item-icon-colors",
                           {
                              clickable:
                                 item.numResolvedChildren ===
                                    item.numChildren &&
                                 this.props.currentUserLoadout.canPack === 1,
                              disabled:
                                 item.numResolvedChildren < item.numChildren ||
                                 this.props.currentUserLoadout.canPack === 0,
                           }
                        )}
                        onClick={(e) => {
                           this.toggleIsPacked();
                        }}
                     >
                        {item.status === 1 && <PackedIcon />}
                        {item.status === 0 &&
                           item.numResolvedChildren >= item.numChildren && (
                              <ReadyToPackIcon />
                           )}
                        {item.status === 0 &&
                           item.numResolvedChildren < item.numChildren && (
                              <NotReadyToPackIcon />
                           )}
                     </span>
                     <span
                        className={classnames(
                           `flex-fill item-card-text level-text-color-child level-text-color-${thisLevelRotated}`
                           // (UI_APPEARANCE === "light" ||
                           //    UI_APPEARANCE === "dark") &&
                           //    "level-text-color-" +
                           //       String(level % LEVEL_COLORS),
                           // UI_APPEARANCE === "colors" && "light-text-color"
                        )}
                     >
                        <span
                           className={classnames({
                              clickable:
                                 item.numResolvedChildren ===
                                    item.numChildren &&
                                 this.props.currentUserLoadout.canPack === 1,
                              // disabled:
                              //    item.numResolvedChildren < item.numChildren,
                           })}
                           onClick={(e) => {
                              this.toggleIsPacked();
                           }}
                        >
                           &nbsp;&nbsp;{item.name}
                        </span>
                     </span>
                  </>
               )}

               {item.numChildren > 0 && (
                  <>
                     <span
                        onClick={(e) => {
                           (item.status === 0 ||
                              this.props.currentUserLoadout.canPack === 0) &&
                              movePageToDifferentItem(this.props.item.id, +1);
                        }}
                        className={classnames(
                           `button navigation-link item-card-text level-text-color-this level-text-color-${childLevelRotated}`,
                           { disabled: item.status === 1 }
                        )}
                     >
                        {item.contentSummary}&nbsp;&nbsp;
                     </span>
                     <span
                        className={classnames(
                           `icon-dark item-card-icon item-icon-colors item-icon-colors-${thisLevelRotated}`,
                           {
                              clickable:
                                 item.status === 0 ||
                                 this.props.currentUserLoadout.canPack === 0,
                              disabled:
                                 item.status === 1 &&
                                 this.props.currentUserLoadout.canPack === 1,
                           }
                        )}
                        onClick={(e) => {
                           (item.status === 0 ||
                              this.props.currentUserLoadout.canPack === 0) &&
                              movePageToDifferentItem(this.props.item.id, +1);
                        }}
                     >
                        {item.status === 1 && <ChildrenPackedIcon2 />}
                        {item.status === 0 &&
                           item.numResolvedChildren >= item.numChildren && (
                              <ChildrenPackedIcon2 />
                           )}
                        {item.status === 0 &&
                           item.numResolvedChildren < item.numChildren && (
                              <ChildrenUnpackedIcon />
                           )}
                     </span>
                  </>
               )}
            </div>
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
   };
}

export default connect(mapStateToProps)(ItemCard); // this is "currying"
