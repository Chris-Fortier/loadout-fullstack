import React from "react";
import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import classnames from "classnames";
import SharingStrip from "../ui/SharingStrip";
import {
   ChildrenUnpackedIcon,
   ChildrenPackedIcon2,
} from "../../icons/loadout-icons.js";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";
import { getUserLoadoutsForALoadout } from "../../utils/userLoadouts";

class LoadoutCard extends React.Component {
   // open the loadout sharing settings
   gotoSharing() {
      // set the loadout
      movePageToDifferentItem(
         this.props.loadout.loadoutId,
         +1,
         this.props.loadout,
         "/loadout-list"
      );

      // get the user loadouts for the loadout
      console.log(
         "getUserLoadoutsForALoadout from LoadoutCard for",
         this.props.loadout.loadoutId
      );
      getUserLoadoutsForALoadout(this.props.loadout.loadoutId);

      // move the parent page to sharing settings
      this.props.parentProps.history.push("/loadout-sharing");
   }

   render() {
      console.log("props", this.props);
      const loadout = this.props.loadout; // this is to simplify code below
      const item = loadout; // this is to simplify code below
      item.name = item.loadoutName;
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
               <div className="d-flex">
                  <Link
                     className={classnames(
                        `item-card-text level-text-color-1 level-text-color-this`
                     )}
                     onClick={() => {
                        movePageToDifferentItem(
                           this.props.loadout.loadoutId,
                           +1,
                           this.props.loadout
                        );
                     }}
                     to="/item-list"
                  >
                     {item.name}&nbsp;
                  </Link>
                  {/* {this.props.loadout.isAdmin === 1 && (
                     <div
                        className="button danger-action-button narrow-button"
                        onClick={() => {
                           this.deleteLoadout(this.props.loadout.loadoutId);
                        }}
                     >
                        Delete Loadout
                     </div>
                  )} */}

                  <span className="flex-fill"></span>

                  {item.numChildren > 0 && (
                     <>
                        <Link
                           className={classnames(
                              "button navigation-link item-card-text level-text-color-2 level-text-color-this",
                              { disabled: item.status === 1 }
                           )}
                           onClick={() => {
                              movePageToDifferentItem(
                                 this.props.loadout.loadoutId,
                                 +1,
                                 this.props.loadout
                              );
                           }}
                           to="/item-list"
                        >
                           {item.contentSummary}&nbsp;&nbsp;
                        </Link>
                        <Link
                           className={classnames(
                              "icon-dark item-card-icon item-icon-colors item-icon-colors-1",
                              // (UI_APPEARANCE === "light" ||
                              //    UI_APPEARANCE === "dark") &&
                              //    "item-icon-colors-" +
                              //       String(level % LEVEL_COLORS),
                              // UI_APPEARANCE === "colors" && "item-icon-colors",
                              {
                                 clickable: item.status === 0,
                                 disabled: item.status === 1,
                              }
                           )}
                           onClick={() => {
                              movePageToDifferentItem(
                                 this.props.loadout.loadoutId,
                                 +1,
                                 this.props.loadout
                              );
                           }}
                           to="/item-list"
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
                        </Link>
                     </>
                  )}
               </div>
            </div>
            <div className="d-flex">
               <span
                  className="clickable"
                  onClick={() => {
                     this.gotoSharing();
                  }}
               >
                  <SharingStrip loadout={this.props.loadout} />
               </span>
               <div className="flex-fill"></div>
            </div>
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return { userLoadouts: state.userLoadouts };
}

export default connect(mapStateToProps)(LoadoutCard); // this is "currying"
