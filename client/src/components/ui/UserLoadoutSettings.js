import React from "react";
import { connect } from "react-redux";
import { UI_APPEARANCE } from "../../utils/helpers";
import classnames from "classnames";
import axios from "axios";
import {
   DeleteIcon,
   DisabledIcon,
   CheckedIcon,
} from "../../icons/loadout-icons";
import { removeUserLoadout } from "../../utils/userLoadouts";
import actions from "../../store/actions";
import { IconPackage, IconEdit, IconKey } from "../../icons/icons.js";

class UserLoadoutSettings extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      this.state = {
         isDeleted: false,
         // canPack: this.props.userLoadout.canPack,
         // canEdit: this.props.userLoadout.canEdit,
         // isAdmin: this.props.userLoadout.isAdmin,
      };
   }

   updatePermissionsOnServerAndRedux(canPack, canEdit, isAdmin) {
      console.log({ canPack, canEdit, isAdmin });
      axios
         .put(
            "http://localhost:3060/api/v1/user-loadouts/set-permissions?userId=" +
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
      if (this.props.userLoadout.canPack === 0) {
         // this.setState({ canPack: 1 });
         this.updatePermissionsOnServerAndRedux(
            1,
            this.props.userLoadout.canEdit,
            this.props.userLoadout.isAdmin
         );
      } else if (this.props.userLoadout.canPack === 1) {
         // this.setState({ canPack: 0 });
         this.updatePermissionsOnServerAndRedux(
            0,
            this.props.userLoadout.canEdit,
            this.props.userLoadout.isAdmin
         );
      }
   }

   toggleCanEdit() {
      // toggle on client
      if (this.props.userLoadout.canEdit === 0) {
         // this.setState({ canEdit: 1 });
         this.updatePermissionsOnServerAndRedux(
            this.props.userLoadout.canPack,
            1,
            this.props.userLoadout.isAdmin
         );
      } else if (this.props.userLoadout.canEdit === 1) {
         // this.setState({ canEdit: 0 });
         this.updatePermissionsOnServerAndRedux(
            this.props.userLoadout.canPack,
            0,
            this.props.userLoadout.isAdmin
         );
      }
   }

   toggleIsAdmin() {
      // toggle on client
      if (this.props.userLoadout.isAdmin === 0) {
         // this.setState({ isAdmin: 1 });
         this.updatePermissionsOnServerAndRedux(
            this.props.userLoadout.canPack,
            this.props.userLoadout.canEdit,
            1
         );
      } else if (this.props.userLoadout.isAdmin === 1) {
         // this.setState({ isAdmin: 0 });
         this.updatePermissionsOnServerAndRedux(
            this.props.userLoadout.canPack,
            this.props.userLoadout.canEdit,
            0
         );
      }
   }

   render() {
      // some consts to simplify code below
      const thisUserIsAdmin = this.props.currentUserLoadout.isAdmin;
      const userLoadoutUserId = this.props.userLoadout.userId;
      const thisUserId = this.props.currentUser.id;

      // REMOVE is available if
      // currentUser is an admin of this loadout and this userLoadout is not the currentUser, or
      // currentUser is not an admin of this loadout and this userLoadout is the currentUser
      const canRemoveUserLoadout =
         (thisUserIsAdmin === 1 && userLoadoutUserId !== thisUserId) ||
         (thisUserIsAdmin === 0 && userLoadoutUserId === thisUserId);

      return (
         <>
            {/* large size card */}
            <tr className="sharedUserRow  d-none d-sm-table-row">
               {!this.state.isDeleted && (
                  <>
                     <th scope="row">
                        {this.props.userLoadout.username}
                        {this.props.userLoadout.userId ===
                           this.props.currentUser.id && <>&nbsp;(YOU)</>}
                     </th>
                     <td>
                        <div className="d-flex">
                           <span
                              className={classnames(
                                 "item-card-icon",
                                 (UI_APPEARANCE === "light" ||
                                    UI_APPEARANCE === "dark") &&
                                    "item-icon-colors-1",
                                 UI_APPEARANCE === "colors" &&
                                    "item-icon-colors",
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
                              {this.props.userLoadout.canPack === 1 && (
                                 <CheckedIcon />
                              )}
                              {this.props.userLoadout.canPack === 0 && (
                                 <DisabledIcon />
                              )}
                           </span>
                        </div>
                     </td>
                     <td>
                        <div className="d-flex">
                           <span
                              className={classnames(
                                 "item-card-icon",
                                 (UI_APPEARANCE === "light" ||
                                    UI_APPEARANCE === "dark") &&
                                    "item-icon-colors-1",
                                 UI_APPEARANCE === "colors" &&
                                    "item-icon-colors",
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
                              {this.props.userLoadout.canEdit === 1 && (
                                 <CheckedIcon />
                              )}
                              {this.props.userLoadout.canEdit === 0 && (
                                 <DisabledIcon />
                              )}
                           </span>
                        </div>
                     </td>
                     <td>
                        <div className="d-flex">
                           <span
                              className={classnames(
                                 "item-card-icon",
                                 (UI_APPEARANCE === "light" ||
                                    UI_APPEARANCE === "dark") &&
                                    "item-icon-colors-1",
                                 UI_APPEARANCE === "colors" &&
                                    "item-icon-colors",
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
                              {this.props.userLoadout.isAdmin === 1 && (
                                 <CheckedIcon />
                              )}
                              {this.props.userLoadout.isAdmin === 0 && (
                                 <DisabledIcon />
                              )}
                           </span>
                        </div>
                     </td>
                     <td>
                        <div className="d-flex">
                           <span
                              className={
                                 // delete is available if
                                 // currentUser is an admin of this loadout and this userLoadout is not the currentUser, or
                                 // currentUser is not an admin of this loadout and this userLoadout is the currentUser
                                 classnames(
                                    "item-card-icon",
                                    (UI_APPEARANCE === "light" ||
                                       UI_APPEARANCE === "dark") &&
                                       "item-icon-colors-1",
                                    UI_APPEARANCE === "colors" &&
                                       "item-icon-colors",
                                    {
                                       clickable: canRemoveUserLoadout,
                                       disabled: !canRemoveUserLoadout,
                                    }
                                 )
                              }
                              onClick={() => {
                                 if (canRemoveUserLoadout) {
                                    removeUserLoadout(
                                       this.props.userLoadout.userId,
                                       this.props.userLoadout.loadoutId
                                    );
                                    this.setState({ isDeleted: true });
                                 }
                              }}
                           >
                              <DeleteIcon />
                           </span>
                        </div>
                     </td>
                  </>
               )}
               {this.state.isDeleted && (
                  <>
                     <th scope="row">
                        {this.props.userLoadout.username} Removed
                     </th>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                  </>
               )}
            </tr>
            {/* small size card */}
            <tr className="sharedUserRow d-table-row d-sm-none">
               {!this.state.isDeleted && (
                  <>
                     <th scope="row">
                        {this.props.userLoadout.username}
                        {this.props.userLoadout.userId ===
                           this.props.currentUser.id && <>&nbsp;(YOU)</>}
                     </th>
                     <td>
                        <div className="d-flex">
                           <span
                              className={
                                 // delete is available if
                                 // currentUser is an admin of this loadout and this userLoadout is not the currentUser, or
                                 // currentUser is not an admin of this loadout and this userLoadout is the currentUser
                                 classnames(
                                    "item-card-icon",
                                    (UI_APPEARANCE === "light" ||
                                       UI_APPEARANCE === "dark") &&
                                       "item-icon-colors-1",
                                    UI_APPEARANCE === "colors" &&
                                       "item-icon-colors",
                                    {
                                       clickable: canRemoveUserLoadout,
                                       disabled: !canRemoveUserLoadout,
                                    }
                                 )
                              }
                              onClick={() => {
                                 if (canRemoveUserLoadout) {
                                    removeUserLoadout(
                                       this.props.userLoadout.userId,
                                       this.props.userLoadout.loadoutId
                                    );
                                    this.setState({ isDeleted: true });
                                 }
                              }}
                           >
                              <DeleteIcon />
                           </span>
                        </div>
                     </td>
                  </>
               )}
               {this.state.isDeleted && (
                  <>
                     <th scope="row">
                        {this.props.userLoadout.username} Removed
                     </th>
                     <td></td>
                  </>
               )}
            </tr>
            {!this.state.isDeleted && (
               <>
                  <tr className="sharedUserRow d-table display-switch-label d-table-row d-sm-none">
                     <td className="no-border d-flex ">
                        <span
                           className={classnames(
                              "item-card-icon",
                              (UI_APPEARANCE === "light" ||
                                 UI_APPEARANCE === "dark") &&
                                 "item-icon-colors-1",
                              UI_APPEARANCE === "colors" && "item-icon-colors",
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
                           {this.props.userLoadout.canPack === 1 && (
                              <CheckedIcon />
                           )}
                           {this.props.userLoadout.canPack === 0 && (
                              <DisabledIcon />
                           )}
                        </span>
                        <span>&nbsp;</span>
                        <span
                           className={classnames(
                              "loadout-card-icon",
                              UI_APPEARANCE === "dark" && "icon-light",
                              UI_APPEARANCE !== "dark" && "icon-dark"
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
                              "item-card-icon",
                              (UI_APPEARANCE === "light" ||
                                 UI_APPEARANCE === "dark") &&
                                 "item-icon-colors-1",
                              UI_APPEARANCE === "colors" && "item-icon-colors",
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
                           {this.props.userLoadout.canEdit === 1 && (
                              <CheckedIcon />
                           )}
                           {this.props.userLoadout.canEdit === 0 && (
                              <DisabledIcon />
                           )}
                        </span>
                        <span>&nbsp;</span>
                        <span
                           className={classnames(
                              "loadout-card-icon",
                              UI_APPEARANCE === "dark" && "icon-light",
                              UI_APPEARANCE !== "dark" && "icon-dark"
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
                              "item-card-icon",
                              (UI_APPEARANCE === "light" ||
                                 UI_APPEARANCE === "dark") &&
                                 "item-icon-colors-1",
                              UI_APPEARANCE === "colors" && "item-icon-colors",
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
                           {this.props.userLoadout.isAdmin === 1 && (
                              <CheckedIcon />
                           )}
                           {this.props.userLoadout.isAdmin === 0 && (
                              <DisabledIcon />
                           )}
                        </span>
                        <span>&nbsp;</span>
                        <span
                           className={classnames(
                              "loadout-card-icon",
                              UI_APPEARANCE === "dark" && "icon-light",
                              UI_APPEARANCE !== "dark" && "icon-dark"
                           )}
                        >
                           <IconKey />
                        </span>
                        &nbsp;Is Admin
                     </td>
                  </tr>
               </>
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

export default connect(mapStateToProps)(UserLoadoutSettings); // this is "currying"
