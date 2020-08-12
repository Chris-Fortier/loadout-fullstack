import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import classnames from "classnames";
import actions from "../../store/actions";
import {
   IconPackage,
   IconEdit,
   IconUpLevel,
   IconUserCouple,
} from "../../icons/icons.js";

// export default function Header() {
class LoadoutHeader extends React.Component {
   render() {
      // get copies of variables to simplify code
      const canPack = this.props.currentUserLoadout.canPack;
      const canEdit = this.props.currentUserLoadout.canEdit;

      // figure out what mode we are in
      let mode = "";
      if (window.location.pathname === "/loadout-sharing") {
         mode = "settings";
      } else if (this.props.isEditMode) {
         mode = "edit";
      } else {
         mode = "pack";
      }

      // set up tooltips

      let packTooltip = "";
      if (mode !== "pack") {
         if (canPack === 0) {
            packTooltip = "View Loadout";
         }
         if (canPack === 1) {
            packTooltip = "Pack Loadout";
         }
      }

      let editTooltip = "";
      if (mode !== "edit") {
         if (canEdit === 0) {
            editTooltip = "You cannot edit this loadout.";
         }
         if (canEdit === 1) {
            editTooltip = "Edit Loadout";
         }
      }

      let sharingTooltip = "";
      if (mode !== "settings") {
         sharingTooltip = "View/Edit Loadout Sharing";
      }

      return (
         <div className="container-fluid header-container">
            <div className="row loadout-tab">
               <div
                  className={classnames("col", {
                     "loadout-tab-selected": mode === "pack",
                     clickable: mode !== "pack",
                  })}
                  onClick={() => {
                     if (mode !== "pack") {
                        this.props.dispatch({
                           type: actions.SET_EDIT_MODE,
                           payload: false,
                        });
                        this.props.dispatch({
                           type: actions.CLEAR_MOVEABLE_ITEM_IDS,
                        });
                        if (window.location.pathname !== "/item-list") {
                           this.props.parentProps.history.push("/item-list");
                        }
                     }
                  }}
                  title={packTooltip}
               >
                  {canPack === 1 && (
                     <>
                        <span
                           className={`button theme-icon-color standard-sized-icon`}
                        >
                           <IconPackage />
                        </span>
                        &nbsp;Pack
                     </>
                  )}
                  {canPack === 0 && <>View Only</>}
               </div>

               <div
                  className={classnames("col", {
                     "loadout-tab-selected": mode === "edit",
                     disabled: canEdit === 0,
                     clickable: canEdit === 1 && mode !== "edit",
                  })}
                  onClick={() => {
                     if (mode !== "edit" && canEdit === 1) {
                        this.props.dispatch({
                           type: actions.SET_EDIT_MODE,
                           payload: true,
                        });
                        if (window.location.pathname !== "/item-list") {
                           this.props.parentProps.history.push("/item-list");
                        }
                     }
                  }}
                  title={editTooltip}
               >
                  <span
                     className={`button theme-icon-color standard-sized-icon`}
                  >
                     <IconEdit />
                  </span>
                  &nbsp;Edit
               </div>

               <div
                  className={classnames("col", {
                     "loadout-tab-selected": mode === "settings",
                     clickable: mode !== "settings",
                  })}
                  onClick={() => {
                     if (mode !== "settings") {
                        this.props.dispatch({
                           type: actions.CLEAR_MOVEABLE_ITEM_IDS,
                        });
                        if (window.location.pathname !== "/loadout-sharing") {
                           this.props.parentProps.history.push(
                              "/loadout-sharing"
                           );
                        }
                     }
                  }}
                  title={sharingTooltip}
               >
                  <span
                     className={`button theme-icon-color standard-sized-icon`}
                  >
                     <IconUserCouple />
                  </span>
                  &nbsp;Sharing
               </div>
            </div>
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // put all the things in state we need access to in this component
      currentUserLoadout: state.currentUserLoadout,
      isEditMode: state.isEditMode,
   };
}

export default connect(mapStateToProps)(LoadoutHeader);
