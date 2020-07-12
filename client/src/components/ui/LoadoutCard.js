import React from "react";
import { Link } from "react-router-dom"; // a React element for linking
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
   IconPackage,
   IconEdit,
   IconKey,
   IconUserCouple,
} from "../../icons/icons.js";

import {
   // PackedIcon,
   // ReadyToPackIcon,
   // NotReadyToPackIcon,
   ChildrenUnpackedIcon,
   ChildrenPackedIcon2,
} from "../../icons/loadout-icons.js";
import actions from "../../store/actions";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";

class LoadoutCard extends React.Component {
   // constructor(props) {
   //    super(props); // boilerplate
   //    this.state = {};
   // }

   moveToLoadout(loadoutId) {
      this.props.dispatch({
         type: actions.STORE_CURRENT_ITEM,
         payload: loadoutId,
      });

      // doesn't work, for now after clicking this, change the end of the url from loadout-list to loadout
      // redirect the user
      // this.props.history.push("/loadout");
      // window.scrollTo(0, 0); // sets focus to the top of the page
   }

   render() {
      console.log("props", this.props);
      const loadout = this.props.loadout; // this is to simplify code below
      const item = loadout; // this is to simplify code below
      item.name = item.loadoutName;
      const level = 1;
      item.status = 0; // top level loadouts always have status of zero

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
            id={"item-card-" + item.loadoutId}
         >
            <div>
               {/* <div className="float-left"> */}
               <Link
                  className="d-flex"
                  onClick={() => {
                     movePageToDifferentItem(this.props.loadout.loadoutId, +1);
                  }}
                  to="/item-list"
               >
                  <span
                     className={classnames(
                        "item-card-text",
                        (UI_APPEARANCE === "light" ||
                           UI_APPEARANCE === "dark") &&
                           "level-text-color-" + String(level % LEVEL_COLORS),
                        UI_APPEARANCE === "colors" && "dark-text-color"
                     )}
                  >
                     {item.name}&nbsp;
                  </span>
                  {/* {true && (
                     <span
                        className={classnames(
                           "loadout-card-icon",
                           UI_APPEARANCE === "dark" && "icon-light",
                           UI_APPEARANCE !== "dark" && "icon-dark"
                        )}
                     >
                        <IconUserCouple />
                     </span>
                  )}
                  {this.props.loadout.canEdit === 1 && (
                     <span
                        className={classnames(
                           "loadout-card-icon",
                           UI_APPEARANCE === "dark" && "icon-light",
                           UI_APPEARANCE !== "dark" && "icon-dark"
                        )}
                     >
                        <IconEdit />
                     </span>
                  )}
                  {this.props.loadout.canPack === 1 && (
                     <span
                        className={classnames(
                           "loadout-card-icon",
                           UI_APPEARANCE === "dark" && "icon-light",
                           UI_APPEARANCE !== "dark" && "icon-dark"
                        )}
                     >
                        <IconPackage />
                     </span>
                  )}
                  {this.props.loadout.isAdmin === 1 && (
                     <span
                        className={classnames(
                           "loadout-card-icon",
                           UI_APPEARANCE === "dark" && "icon-light",
                           UI_APPEARANCE !== "dark" && "icon-dark"
                        )}
                     >
                        <IconKey />
                     </span>
                  )} */}
                  <span className="flex-fill"></span>

                  {item.numChildren > 0 && (
                     <>
                        <span
                           onClick={(e) => {
                              item.status === 0 &&
                                 movePageToDifferentItem(item.id, +1);
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
                                 clickable: item.status === 0,
                                 disabled: item.status === 1,
                              }
                           )}
                           onClick={(e) => {
                              item.status === 0 &&
                                 movePageToDifferentItem(
                                    this.props.item.id,
                                    +1
                                 );
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
               </Link>
            </div>
            <div className="d-flex">
               {true && (
                  <span
                     className={classnames(
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                  >
                     <IconUserCouple />
                  </span>
               )}
               {this.props.loadout.canEdit === 1 && (
                  <span
                     className={classnames(
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                  >
                     <IconEdit />
                  </span>
               )}
               {this.props.loadout.canPack === 1 && (
                  <span
                     className={classnames(
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                  >
                     <IconPackage />
                  </span>
               )}
               {this.props.loadout.isAdmin === 1 && (
                  <span
                     className={classnames(
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                  >
                     <IconKey />
                  </span>
               )}
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
