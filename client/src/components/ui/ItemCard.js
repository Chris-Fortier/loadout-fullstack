import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
// import actions from "../../store/actions";
import {
   LEVEL_COLORS,
   // SUBITEM_DISPLAY_MODE,
   UI_APPEARANCE,
   getContentSummary,
} from "../../utils/helpers";
import classnames from "classnames";
// import { IconArrowThinRightCircle } from "../../icons/icons.js";
import {
   PackedIcon,
   ReadyToPackIcon,
   NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon2,
} from "../../icons/loadout-icons.js";
// import { processAllItems } from "../../utils/processItems";
import {
   movePageToDifferentItem,
   // refreshPage,
} from "../../utils/movePageToDifferentItem";
// import axios from "axios";
import { setItemStatus } from "../../utils/items";
import actions from "../../store/actions";

// new version of item card that deals with database data

class ItemCard2 extends React.Component {
   // recountPageItems() {
   //    console.log("recountPageItems()...");
   //    console.log(this.props.currentItem);
   //    console.log(this.props.childItems);
   // }

   // toggle the packed status of this item
   toggleIsPacked() {
      console.log("toggleIsPacked()...");
      let newStatus = null;
      let parentUnpackedCounterChange = 0;

      // only toggle packed if all its descendants are packed and if the user has permission to pack
      if (
         this.props.item.numUnpackedChildren === 0 &&
         this.props.currentUserLoadout.canPack === 1
      ) {
         if (this.props.item.status === 0) {
            console.log("set this item's status to packed");
            newStatus = 1;
            parentUnpackedCounterChange = -1;
         } else if (this.props.item.status === 1) {
            console.log("set this item's status to unpacked");
            newStatus = 0;
            parentUnpackedCounterChange = +1;
         }

         setItemStatus(this.props.item.id, newStatus); // update the database
         this.props.item.status = newStatus; // set the status locally

         // trying to update the counter on the client side
         this.props.currentItem.numPackedChildren += -parentUnpackedCounterChange;
         this.props.currentItem.numUnpackedChildren += parentUnpackedCounterChange;
         this.props.currentItem.contentSummary = getContentSummary(
            this.props.currentItem.numChildren,
            this.props.currentItem.numPackedChildren,
            this.props.currentItem.status
         );
         this.props.dispatch({
            type: actions.STORE_CURRENT_ITEM,
            payload: this.props.currentItem,
         });

         // this.recountPageItems();

         this.forceUpdate(); // needed to show the packed indicator change on in this component
         this.props.rerenderParentCallback(); // call back to re-render the parent page component
      }
   }

   render() {
      const item = this.props.item; // this is to simplify code below
      const level = this.props.currentLevel + 1; // now the level of the item card is the currentLevel + 1 ebecause it is one level below the page's level

      return (
         <div
            className={classnames(
               level > 1 && "item-card",
               level <= 1 && "loadout-card",
               UI_APPEARANCE === "light" &&
                  level > 1 &&
                  item.status === 0 &&
                  "child-bg-light",
               UI_APPEARANCE === "light" &&
                  level > 1 &&
                  item.status === 1 &&
                  "child-bg-light-packed",
               UI_APPEARANCE === "dark" &&
                  level > 1 &&
                  item.status === 0 &&
                  "child-bg-dark",
               UI_APPEARANCE === "dark" &&
                  level > 1 &&
                  item.status === 1 &&
                  "child-bg-dark-packed",
               UI_APPEARANCE === "colors" &&
                  level > 1 &&
                  item.status === 0 &&
                  "child-color-" + String(level % LEVEL_COLORS),
               UI_APPEARANCE === "colors" &&
                  level > 1 &&
                  item.status === 1 &&
                  "packed-color-" + String(level % LEVEL_COLORS)
            )}
            id={"item-card-" + item.index}
         >
            {/* <div className="float-left"> */}
            <div className="d-flex">
               {level <= 1 && (
                  <span
                     className={classnames(
                        "flex-fill item-card-text",
                        (UI_APPEARANCE === "light" ||
                           UI_APPEARANCE === "dark") &&
                           "level-text-color-" + String(level % LEVEL_COLORS),
                        UI_APPEARANCE === "colors" && "dark-text-color"
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
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "item-icon-colors-" +
                                 String(level % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "item-icon-colors",
                           {
                              clickable:
                                 item.numPackedChildren === item.numChildren &&
                                 this.props.currentUserLoadout.canPack === 1,
                              disabled:
                                 item.numPackedChildren < item.numChildren ||
                                 this.props.currentUserLoadout.canPack === 0,
                           }
                        )}
                        onClick={(e) => {
                           this.toggleIsPacked();
                        }}
                     >
                        {item.status === 1 && <PackedIcon />}
                        {item.status === 0 &&
                           item.numPackedChildren >= item.numChildren && (
                              <ReadyToPackIcon />
                           )}
                        {item.status === 0 &&
                           item.numPackedChildren < item.numChildren && (
                              <NotReadyToPackIcon />
                           )}
                     </span>
                     <span
                        className={classnames(
                           "flex-fill item-card-text",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "level-text-color-" +
                                 String(level % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "light-text-color"
                        )}
                     >
                        <span
                           className={classnames({
                              clickable:
                                 item.numPackedChildren === item.numChildren &&
                                 this.props.currentUserLoadout.canPack === 1,
                              // disabled:
                              //    item.numPackedChildren < item.numChildren,
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
                           item.status === 0 &&
                              movePageToDifferentItem(this.props.item.id, +1);
                        }}
                        className={classnames(
                           "button navigation-link item-card-text",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "level-text-color-" +
                                 String((level + 1) % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "dark-text-color",
                           { disabled: item.status === 1 }
                        )}
                     >
                        {item.contentSummary}&nbsp;&nbsp;
                     </span>
                     <span
                        className={classnames(
                           "icon-dark item-card-icon",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "item-icon-colors-" +
                                 String(level % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "item-icon-colors",
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
                           item.numPackedChildren >= item.numChildren && (
                              <ChildrenPackedIcon2 />
                           )}
                        {item.status === 0 &&
                           item.numPackedChildren < item.numChildren && (
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
      currentLevel: state.currentLevel,
      currentItem: state.currentItem,
      // childItems: state.childItems,
      currentUserLoadout: state.currentUserLoadout,
   };
}

export default connect(mapStateToProps)(ItemCard2); // this is "currying"
