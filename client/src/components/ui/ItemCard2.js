import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
// import actions from "../../store/actions";
import {
   LEVEL_COLORS,
   // SUBITEM_DISPLAY_MODE,
   UI_APPEARANCE,
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
import { processAllItems } from "../../utils/processItems";
import movePageToDifferentItem from "../../utils/movePageToDifferentItem2";

// new version of item card that deals with database data

class ItemCard extends React.Component {
   // toggle the packed status of this item
   toggleIsPacked(itemIndexPath) {
      console.log("toggleIsPacked()...");
      // if (
      //    !this.props.item.isPacked &&
      //    this.props.item.numPackedChildren === this.props.item.numChildren
      // ) {
      //    console.log("packing " + this.props.item.name);
      // } else if (this.props.item.isPacked) {
      //    console.log("unpacking " + this.props.item.name);
      // }

      // this.hideUnpackConfirmation();

      // only toggle packed if all its descendants are packed
      if (this.props.item.numPackedChildren === this.props.item.numChildren) {
         // copyOfGear.lastChange = "test hello";
         console.log("itemIndexPath:", itemIndexPath);

         // get the actual item I want to change based on the index path
         let copyOfGear = this.props.currentLoadout.gear;
         let currentItem = copyOfGear;
         for (let i in itemIndexPath) {
            currentItem = currentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
         }
         console.log("name of target item:", currentItem.name);

         // copyOfGear.items[0].items[1].isPacked = !copyOfGear.items[0].items[1]
         //    .isPacked;
         currentItem.isPacked = !currentItem.isPacked;

         // put the data back into the store
         // this.props.dispatch({
         //    type: actions.STORE_CURRENT_LOADOUT,
         //    payload: copyOfGear,
         // });

         processAllItems(this.props.currentLoadout.gear);
      }
   }

   render() {
      // let counterIsFaint = true;
      // let packedBoxIsFaint = false;
      const item = this.props.item; // this is to simplify code below
      // let level = item.level;

      // temporary stuff just to get it working to test
      let level = 2;
      // item.items = [];

      let thisItemPath = this.props.currentLoadout.itemIndexPath.concat([
         item.index,
      ]); // stores the complete index path to the item referred to on this item card

      // do this if this item has subitems
      // if (item.hasOwnProperty("items")) {
      //    // this will make the checkboxes disabled for items that don't have all their containing items packed
      //    if (item.numPackedChildren < item.numChildren) {
      //       counterIsFaint = false;
      //       packedBoxIsFaint = true;
      //    }
      // }

      return (
         <div
            className={classnames(
               level > 1 && "item-card",
               level <= 1 && "loadout-card",
               UI_APPEARANCE === "light" &&
                  level > 1 &&
                  !item.isPacked &&
                  "child-bg-light",
               UI_APPEARANCE === "light" &&
                  level > 1 &&
                  item.isPacked &&
                  "child-bg-light-packed",
               UI_APPEARANCE === "dark" &&
                  level > 1 &&
                  !item.isPacked &&
                  "child-bg-dark",
               UI_APPEARANCE === "dark" &&
                  level > 1 &&
                  item.isPacked &&
                  "child-bg-dark-packed",
               UI_APPEARANCE === "colors" &&
                  level > 1 &&
                  !item.isPacked &&
                  "child-color-" + String(level % LEVEL_COLORS),
               UI_APPEARANCE === "colors" &&
                  level > 1 &&
                  item.isPacked &&
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
                           movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
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
                                 item.numPackedChildren === item.numChildren,
                              disabled:
                                 item.numPackedChildren < item.numChildren,
                           }
                        )}
                        onClick={(e) => {
                           this.toggleIsPacked(thisItemPath);
                        }}
                     >
                        {item.isPacked && <PackedIcon />}
                        {!item.isPacked &&
                           item.numPackedChildren >= item.numChildren && (
                              <ReadyToPackIcon />
                           )}
                        {!item.isPacked &&
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
                                 item.numPackedChildren === item.numChildren,
                              // disabled:
                              //    item.numPackedChildren < item.numChildren,
                           })}
                           onClick={(e) => {
                              this.toggleIsPacked(thisItemPath);
                           }}
                        >
                           &nbsp;&nbsp;{item.name}
                        </span>
                     </span>
                  </>
               )}

               {item.hasOwnProperty("items") && (
                  <>
                     <span
                        onClick={(e) => {
                           !item.isPacked &&
                              movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                        }}
                        className={classnames(
                           "button navigation-link item-card-text",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "dark") &&
                              "level-text-color-" +
                                 String((level + 1) % LEVEL_COLORS),
                           UI_APPEARANCE === "colors" && "dark-text-color",
                           { disabled: item.isPacked }
                        )}
                     >
                        {item.contentSummaryText}&nbsp;&nbsp;
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
                              clickable: !item.isPacked,
                              disabled: item.isPacked,
                           }
                        )}
                        onClick={(e) => {
                           !item.isPacked &&
                              movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                        }}
                     >
                        {item.isPacked && <ChildrenPackedIcon2 />}
                        {!item.isPacked &&
                           item.numPackedChildren >= item.numChildren && (
                              <ChildrenPackedIcon2 />
                           )}
                        {!item.isPacked &&
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
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(ItemCard); // this is "currying"
