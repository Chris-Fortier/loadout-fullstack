import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
// import actions from "../../store/actions";
// import { LEVEL_COLORS } from "../../utils/helpers";
// import classnames from "classnames";
// import { IconArrowThinRightCircle } from "../../icons/icons.js";
import {
   LEVEL_COLORS,
   // SUBITEM_DISPLAY_MODE,
   UI_APPEARANCE,
} from "../../utils/helpers";
import classnames from "classnames";
import {
   // PackedIcon,
   // ReadyToPackIcon,
   // NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon2,
} from "../../icons/loadout-icons.js";

class LoadoutCard extends React.Component {
   render() {
      console.log("props", this.props);
      const loadout = this.props.loadout; // this is to simplify code below
      const item = loadout; // this is to simplify code below
      item.name = item.loadoutName;
      const level = 1;

      return (
         // <Link className={"card item-card child-bg-color"} to="/loadout">
         //    <div className="d-flex">
         //       <span className="flex-fill level-text-color-1">
         //          {loadout.loadoutName}
         //          {loadout.canEdit === 1 && <>&nbsp;E</>}
         //          {loadout.canPack === 1 && <>&nbsp;P</>}
         //          {loadout.isAdmin === 1 && <>&nbsp;A</>}
         //       </span>
         //    </div>
         // </Link>

         <div
            className={classnames("loadout-card")}
            id={"item-card-" + item.index}
         >
            {/* <div className="float-left"> */}
            <div className="d-flex">
               <span
                  className={classnames(
                     "flex-fill item-card-text",
                     (UI_APPEARANCE === "light" || UI_APPEARANCE === "dark") &&
                        "level-text-color-" + String(level % LEVEL_COLORS),
                     UI_APPEARANCE === "colors" && "dark-text-color"
                  )}
               >
                  <span
                     className="navigation-link"
                     // onClick={(e) => {
                     //    movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                     // }}
                  >
                     {item.name}
                     {loadout.canEdit === 1 && <>&nbsp;E</>}
                     {loadout.canPack === 1 && <>&nbsp;P</>}
                     {loadout.isAdmin === 1 && <>&nbsp;A</>}
                  </span>
               </span>

               <span
                  // onClick={(e) => {
                  //    !item.isPacked &&
                  //       movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                  // }}
                  className={classnames(
                     "button navigation-link item-card-text",
                     (UI_APPEARANCE === "light" || UI_APPEARANCE === "dark") &&
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
                     (UI_APPEARANCE === "light" || UI_APPEARANCE === "dark") &&
                        "item-icon-colors-" + String(level % LEVEL_COLORS),
                     UI_APPEARANCE === "colors" && "item-icon-colors",
                     {
                        clickable: !item.isPacked,
                        disabled: item.isPacked,
                     }
                  )}
                  // onClick={(e) => {
                  //    !item.isPacked &&
                  //       movePageToDifferentItem(thisItemPath); // move to current path with the subitem index added on
                  // }}
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
            </div>
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {};
}

export default connect(mapStateToProps)(LoadoutCard); // this is "currying"
