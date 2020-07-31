import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import axios from "axios";
import {
   DeleteIcon,
   DisabledIcon,
   CheckedIcon,
} from "../../icons/loadout-icons";
import { getUserLoadoutsForALoadout } from "../../utils/userLoadouts";
import actions from "../../store/actions";
import { IconPackage, IconEdit, IconKey } from "../../icons/icons.js";

class LoadoutUserCard extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      this.state = {
         canPack: this.props.userLoadout.canPack,
         canEdit: this.props.userLoadout.canEdit,
         isAdmin: this.props.userLoadout.isAdmin,
         isShowingRemoveButton: false,
      };
   }

   updatePermissionsOnServerAndRedux(canPack, canEdit, isAdmin) {
      console.log({ canPack, canEdit, isAdmin });
      axios
         .put(
            "/api/v1/user-loadouts/set-permissions?userId=" +
               this.props.userLoadout.userId +
               "&loadoutId=" +
               this.props.userLoadout.loadoutId +
               "&canPack=" +
               canPack +
               "&canEdit=" +
               canEdit +
               "&isAdmin=" +
               isAdmin
         )
         .then((res) => {
            console.log("res.data", res.data);

            // update Redux store:

            // const updatedCurrentLoadoutUserLoadouts = [];

            // update the correct object
            for (let i in this.props.currentLoadoutUserLoadouts) {
               console.log(i);
               // updatedCurrentLoadoutUserLoadouts.push({
               //    ...this.props.currentLoadoutUserLoadouts[i],
               // });
               if (
                  this.props.currentLoadoutUserLoadouts[i].userId ===
                  this.props.userLoadout.userId
               ) {
                  console.log("updated!");
                  this.props.currentLoadoutUserLoadouts[i].canPack = canPack;
                  this.props.currentLoadoutUserLoadouts[i].canEdit = canEdit;
                  this.props.currentLoadoutUserLoadouts[i].isAdmin = isAdmin;
               }
            }
            console.log(this.props.currentLoadoutUserLoadouts);
            this.props.dispatch({
               type: actions.STORE_CURRENT_LOADOUT_USER_LOADOUTS,
               payload: this.props.currentLoadoutUserLoadouts,
            });
         })
         .catch((err) => {
            console.log("err", err);
         });
   }

   toggleCanPack() {
      // toggle on client
      if (this.state.canPack === 0) {
         this.setState({ canPack: 1 });
      } else if (this.state.canPack === 1) {
         this.setState({ canPack: 0 });
      }
   }

   toggleCanEdit() {
      // toggle on client
      if (this.state.canEdit === 0) {
         this.setState({ canEdit: 1 });
      } else if (this.state.canEdit === 1) {
         this.setState({ canEdit: 0 });
      }
   }

   toggleIsAdmin() {
      // toggle on client
      if (this.state.isAdmin === 0) {
         this.setState({ isAdmin: 1 });
      } else if (this.state.isAdmin === 1) {
         this.setState({ isAdmin: 0 });
      }
   }

   // resets the state of the checkboxes to match what is in Redux
   // this will make it hide the save changes rollout
   cancelChanges() {
      this.setState({
         canPack: this.props.userLoadout.canPack,
         canEdit: this.props.userLoadout.canEdit,
         isAdmin: this.props.userLoadout.isAdmin,
         isShowingRemoveButton: false,
      });
   }

   removeUserLoadout(userId, loadoutId) {
      // server update

      axios
         .put(
            "/api/v1/user-loadouts/delete?userId=" +
               this.props.userLoadout.userId +
               "&loadoutId=" +
               this.props.userLoadout.loadoutId
         )
         .then((res) => {
            console.log("axios res", res);
            // update list of  user loadouts
            getUserLoadoutsForALoadout(this.props.userLoadout.loadoutId);
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });

      // refreshPage();
   }

   render() {
      // some consts to simplify code below
      const thisUserIsAdmin = this.props.currentUserLoadout.isAdmin;
      const userLoadoutUserId = this.props.userLoadout.userId;
      const thisUserId = this.props.currentUser.id;

      // REMOVE is available if
      // currentUser is an admin of this loadout and this userLoadout is not the currentUser, or
      // currentUser is not an admin of this loadout and this userLoadout is the currentUser (now it never uses this case because you can remove yourself from the top of page)
      const canRemoveUserLoadout =
         thisUserIsAdmin === 1 && userLoadoutUserId !== thisUserId;

      // decide whether or not to show save, cancel and remove buttons
      let showSaveChangesButton = false;
      if (
         this.props.userLoadout.canPack !== this.state.canPack ||
         this.props.userLoadout.canEdit !== this.state.canEdit ||
         this.props.userLoadout.isAdmin !== this.state.isAdmin
      ) {
         showSaveChangesButton = true;
      }

      let showChangeRollout = false;
      if (showSaveChangesButton || this.state.isShowingRemoveButton) {
         showChangeRollout = true;
      }

      return (
         <>
            {/* large size card */}
            <tr className="sharedUserRow  d-none d-sm-table-row">
               <>
                  <th scope="row" className="loadout-user theme-text-color">
                     {this.props.userLoadout.username}
                     {this.props.userLoadout.userId ===
                        this.props.currentUser.id && <>&nbsp;(YOU)</>}
                  </th>
                  <td>
                     <div className="d-flex">
                        <span
                           className={classnames(
                              "item-card-icon theme-icon-color",
                              {
                                 clickable: thisUserIsAdmin === 1,
                                 disabled: thisUserIsAdmin === 0,
                              }
                           )}
                           onClick={() => {
                              if (thisUserIsAdmin === 1) {
                                 this.toggleCanPack();
                              }
                           }}
                        >
                           {this.state.canPack === 1 && <CheckedIcon />}
                           {this.state.canPack === 0 && <DisabledIcon />}
                        </span>
                     </div>
                  </td>
                  <td>
                     <div className="d-flex">
                        <span
                           className={classnames(
                              "item-card-icon theme-icon-color",
                              {
                                 clickable: thisUserIsAdmin === 1,
                                 disabled: thisUserIsAdmin === 0,
                              }
                           )}
                           onClick={() => {
                              if (thisUserIsAdmin === 1) {
                                 this.toggleCanEdit();
                              }
                           }}
                        >
                           {this.state.canEdit === 1 && <CheckedIcon />}
                           {this.state.canEdit === 0 && <DisabledIcon />}
                        </span>
                     </div>
                  </td>
                  <td>
                     <div className="d-flex">
                        <span
                           className={classnames(
                              "item-card-icon theme-icon-color",
                              {
                                 clickable:
                                    thisUserIsAdmin === 1 &&
                                    userLoadoutUserId !== thisUserId,
                                 disabled:
                                    thisUserIsAdmin !== 1 ||
                                    userLoadoutUserId === thisUserId,
                              }
                           )}
                           onClick={() => {
                              if (
                                 thisUserIsAdmin === 1 &&
                                 userLoadoutUserId !== thisUserId
                              ) {
                                 this.toggleIsAdmin();
                              }
                           }}
                        >
                           {this.state.isAdmin === 1 && <CheckedIcon />}
                           {this.state.isAdmin === 0 && <DisabledIcon />}
                        </span>
                     </div>
                  </td>
                  <td>
                     <div className="d-flex">
                        <span
                           className={
                              // remove is available if
                              // currentUser is an admin of this loadout and this userLoadout is not the currentUser, or
                              // currentUser is not an admin of this loadout and this userLoadout is the currentUser
                              classnames("item-card-icon theme-icon-color", {
                                 clickable: canRemoveUserLoadout,
                                 disabled: !canRemoveUserLoadout,
                              })
                           }
                           onClick={() => {
                              if (canRemoveUserLoadout) {
                                 this.setState({
                                    isShowingRemoveButton: !this.state
                                       .isShowingRemoveButton,
                                 });
                              }
                           }}
                        >
                           <DeleteIcon />
                        </span>
                     </div>
                  </td>
               </>
            </tr>
            {/* small size card */}
            <tr className="sharedUserRow d-table-row d-sm-none">
               <>
                  <th scope="row" className="loadout-user">
                     {this.props.userLoadout.username}
                     {this.props.userLoadout.userId ===
                        this.props.currentUser.id && <>&nbsp;(YOU)</>}
                  </th>
                  <td>
                     <div className="d-flex">
                        <span
                           className={
                              // remove is available if
                              // currentUser is an admin of this loadout and this userLoadout is not the currentUser, or
                              // currentUser is not an admin of this loadout and this userLoadout is the currentUser
                              classnames("item-card-icon theme-icon-color", {
                                 clickable: canRemoveUserLoadout,
                                 disabled: !canRemoveUserLoadout,
                              })
                           }
                           onClick={() => {
                              if (canRemoveUserLoadout) {
                                 this.setState({
                                    isShowingRemoveButton: !this.state
                                       .isShowingRemoveButton,
                                 });
                              }
                           }}
                        >
                           <DeleteIcon />
                        </span>
                     </div>
                  </td>
               </>
            </tr>
            <>
               <tr className="sharedUserRow d-table display-switch-label d-table-row d-sm-none">
                  <td className="no-border d-flex ">
                     <span
                        className={classnames(
                           "item-card-icon theme-icon-color",
                           {
                              clickable: thisUserIsAdmin === 1,
                              disabled: thisUserIsAdmin === 0,
                           }
                        )}
                        onClick={() => {
                           if (thisUserIsAdmin === 1) {
                              this.toggleCanPack();
                           }
                        }}
                     >
                        {this.state.canPack === 1 && <CheckedIcon />}
                        {this.state.canPack === 0 && <DisabledIcon />}
                     </span>
                     <span>&nbsp;</span>
                     <span
                        className={classnames(
                           "loadout-card-icon theme-icon-color standard-sized-icon"
                        )}
                     >
                        <IconPackage />
                     </span>
                     &nbsp;Can Pack
                  </td>
               </tr>
               <tr className="sharedUserRow d-table display-switch-label d-table-row d-sm-none">
                  <td className="no-border d-flex ">
                     <span
                        className={classnames(
                           "item-card-icon theme-icon-color",
                           {
                              clickable: thisUserIsAdmin === 1,
                              disabled: thisUserIsAdmin === 0,
                           }
                        )}
                        onClick={() => {
                           if (thisUserIsAdmin === 1) {
                              this.toggleCanEdit();
                           }
                        }}
                     >
                        {this.state.canEdit === 1 && <CheckedIcon />}
                        {this.state.canEdit === 0 && <DisabledIcon />}
                     </span>
                     <span>&nbsp;</span>
                     <span
                        className={classnames(
                           "loadout-card-icon theme-icon-color standard-sized-icon"
                        )}
                     >
                        <IconEdit />
                     </span>
                     &nbsp;Can Edit
                  </td>
               </tr>
               <tr className="sharedUserRow d-table display-switch-label d-table-row d-sm-none">
                  <td className="no-border d-flex ">
                     <span
                        className={classnames(
                           "item-card-icon theme-icon-color",
                           {
                              clickable:
                                 thisUserIsAdmin === 1 &&
                                 userLoadoutUserId !== thisUserId,
                              disabled:
                                 thisUserIsAdmin !== 1 ||
                                 userLoadoutUserId === thisUserId,
                           }
                        )}
                        onClick={() => {
                           if (
                              thisUserIsAdmin === 1 &&
                              userLoadoutUserId !== thisUserId
                           ) {
                              this.toggleIsAdmin();
                           }
                        }}
                     >
                        {this.state.isAdmin === 1 && <CheckedIcon />}
                        {this.state.isAdmin === 0 && <DisabledIcon />}
                     </span>
                     <span>&nbsp;</span>
                     <span
                        className={classnames(
                           "loadout-card-icon theme-icon-color standard-sized-icon"
                        )}
                     >
                        <IconKey />
                     </span>
                     &nbsp;Is Admin
                  </td>
               </tr>
            </>
            {showChangeRollout && (
               <tr>
                  {/* <td className="no-border"></td> */}
                  <td colSpan="5" className="no-border">
                     {showSaveChangesButton && (
                        <div
                           className="button primary-action-button"
                           onClick={() => {
                              this.updatePermissionsOnServerAndRedux(
                                 this.state.canPack,
                                 this.state.canEdit,
                                 this.state.isAdmin
                              );
                           }}
                        >
                           Save Permission Changes
                        </div>
                     )}
                     {this.state.isShowingRemoveButton && (
                        <div
                           className="button danger-action-button"
                           onClick={() => {
                              this.removeUserLoadout();
                           }}
                        >
                           Remove This User From This Loadout
                        </div>
                     )}
                     <div
                        className="button navigation-link"
                        onClick={() => this.cancelChanges()}
                     >
                        <br />
                        Cancel
                     </div>
                  </td>
               </tr>
            )}
         </>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // currentLoadout: state.currentLoadout,
      currentUserLoadout: state.currentUserLoadout,
      currentUser: state.currentUser,
      currentLoadoutUserLoadouts: state.currentLoadoutUserLoadouts,
   };
}

export default connect(mapStateToProps)(LoadoutUserCard); // this is "currying"
