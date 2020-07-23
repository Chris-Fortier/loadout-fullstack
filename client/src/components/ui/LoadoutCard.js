import React from "react";
import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import { LEVEL_COLORS, UI_APPEARANCE } from "../../utils/helpers";
import classnames from "classnames";
// import SharingStrip from "../ui/SharingStrip";

import {
   ChildrenUnpackedIcon,
   ChildrenPackedIcon2,
} from "../../icons/loadout-icons.js";
import actions from "../../store/actions";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";
import { getUserLoadoutsForALoadout } from "../../utils/userLoadouts";

import {
   IconPackage,
   IconEdit,
   IconUserCouple,
   IconKey,
} from "../../icons/icons.js";

class LoadoutCard extends React.Component {
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

   // delete a loadout
   // deleteLoadout() {
   //    console.log("clicked delete loadout");

   //    // server update
   //    axios
   //       .put(
   //          "/api/v1/loadouts/delete-loadout?loadoutId=" +
   //             this.props.loadout.loadoutId
   //       )
   //       .then((res) => {
   //          console.log("axios res.data", res.data);

   //          // update the client side list of user loadouts

   //          // make local changes so we can see them immediately
   //          const foundUserLoadoutIndex = this.props.userLoadouts.findIndex(
   //             (userLoadout) => userLoadout.id === this.props.loadout.loadoutId
   //          ); // find the specific loadout to delete
   //          console.log("foundUserLoadoutIndex", foundUserLoadoutIndex);
   //          this.props.userLoadouts.splice(foundUserLoadoutIndex, 1); // make a new array of loadouts with the deleted loadout removed

   //          // push to the store
   //          this.props.dispatch({
   //             type: actions.STORE_USER_LOADOUTS,
   //             payload: this.props.userLoadouts,
   //          });
   //       })
   //       .catch((error) => {
   //          // handle error
   //          console.log("axios error", error);
   //       });
   // }

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
               <div className="d-flex">
                  <Link
                     className={classnames(
                        "item-card-text",
                        (UI_APPEARANCE === "light" ||
                           UI_APPEARANCE === "dark") &&
                           "level-text-color-" + String(level % LEVEL_COLORS),
                        UI_APPEARANCE === "colors" && "dark-text-color"
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
                              "button navigation-link item-card-text",
                              (UI_APPEARANCE === "light" ||
                                 UI_APPEARANCE === "dark") &&
                                 "level-text-color-" +
                                    String((level + 1) % LEVEL_COLORS),
                              UI_APPEARANCE === "colors" && "dark-text-color",
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
                              item.numPackedChildren >= item.numChildren && (
                                 <ChildrenPackedIcon2 />
                              )}
                           {item.status === 0 &&
                              item.numPackedChildren < item.numChildren && (
                                 <ChildrenUnpackedIcon />
                              )}
                        </Link>
                     </>
                  )}
               </div>
            </div>
            <div className="d-flex">
               {/* this used to be a component but I can't find a way to wrap a span around the entire thing to assign single classes and onClick without screwing up the entire layout of it, so I duplicate these several times */}
               {this.props.loadout.numUsers > 1 && (
                  <>
                     <span
                        style={{ fontSize: "1rem", opacity: 0.5 }}
                        className={classnames(
                           "button clickable",
                           (UI_APPEARANCE === "light" ||
                              UI_APPEARANCE === "colors") &&
                              "dark-text-color",
                           UI_APPEARANCE === "dark" && "light-text-color"
                        )}
                        onClick={() => {
                           this.gotoSharing();
                        }}
                     >
                        {this.props.loadout.numUsers}
                     </span>
                     <span
                        className={classnames(
                           "button clickable",
                           "loadout-card-icon",
                           UI_APPEARANCE === "dark" && "icon-light",
                           UI_APPEARANCE !== "dark" && "icon-dark"
                        )}
                        onClick={() => {
                           this.gotoSharing();
                        }}
                     >
                        <IconUserCouple />
                     </span>
                     <span
                        className="button clickable"
                        onClick={() => {
                           this.gotoSharing();
                        }}
                     >
                        &nbsp;&nbsp;
                     </span>
                  </>
               )}
               {this.props.loadout.canPack === 1 && (
                  <span
                     className={classnames(
                        "button clickable",
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                     onClick={() => {
                        this.gotoSharing();
                     }}
                  >
                     <IconPackage />
                  </span>
               )}
               {this.props.loadout.canEdit === 1 && (
                  <span
                     className={classnames(
                        "button clickable",
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                     onClick={() => {
                        this.gotoSharing();
                     }}
                  >
                     <IconEdit />
                  </span>
               )}
               {this.props.loadout.isAdmin === 1 && (
                  <span
                     className={classnames(
                        "button clickable",
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                     onClick={() => {
                        this.gotoSharing();
                     }}
                  >
                     <IconKey />
                  </span>
               )}
               {/* this is for the rest of the line which is not clicable */}
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
