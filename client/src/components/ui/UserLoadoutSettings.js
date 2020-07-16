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

class UserLoadoutSettings extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      this.state = {
         isDeleted: false,
         canPack: this.props.loadoutUser.canPack,
         canEdit: this.props.loadoutUser.canEdit,
         isAdmin: this.props.loadoutUser.isAdmin,
      };
   }

   updatePermissionsOnServer(
      canPack = this.state.canPack,
      canEdit = this.state.canEdit,
      isAdmin = this.state.isAdmin
   ) {
      console.log({ canPack, canEdit, isAdmin });
      axios
         .put(
            "http://localhost:3060/api/v1/user-loadouts/set-permissions?userId=" +
               this.props.loadoutUser.userId +
               "&loadoutId=" +
               this.props.loadoutUser.loadoutId +
               "&canPack=" +
               canPack +
               "&canEdit=" +
               canEdit +
               "&isAdmin=" +
               isAdmin
         )
         .then((res) => {
            console.log("res.data", res.data);
         })
         .catch((err) => {
            console.log("err", err);
         });
   }

   toggleCanPack() {
      // toggle on client
      if (this.state.canPack === 0) {
         this.setState({ canPack: 1 });
         this.updatePermissionsOnServer(
            1,
            this.state.canEdit,
            this.state.isAdmin
         );
      } else if (this.state.canPack === 1) {
         this.setState({ canPack: 0 });
         this.updatePermissionsOnServer(
            0,
            this.state.canEdit,
            this.state.isAdmin
         );
      }
   }

   toggleCanEdit() {
      // toggle on client
      if (this.state.canEdit === 0) {
         this.setState({ canEdit: 1 });
         this.updatePermissionsOnServer(
            this.state.canPack,
            1,
            this.state.isAdmin
         );
      } else if (this.state.canEdit === 1) {
         this.setState({ canEdit: 0 });
         this.updatePermissionsOnServer(
            this.state.canPack,
            0,
            this.state.isAdmin
         );
      }
   }

   toggleIsAdmin() {
      // toggle on client
      if (this.state.isAdmin === 0) {
         this.setState({ isAdmin: 1 });
         this.updatePermissionsOnServer(
            this.state.canPack,
            this.state.canEdit,
            1
         );
      } else if (this.state.isAdmin === 1) {
         this.setState({ isAdmin: 0 });
         this.updatePermissionsOnServer(
            this.state.canPack,
            this.state.canEdit,
            0
         );
      }
   }

   render() {
      // some consts to simplify code below
      const thisUserIsAdmin = this.props.currentUserLoadout.isAdmin;
      const userLoadoutUserId = this.props.loadoutUser.userId;
      const thisUserId = this.props.currentUser.id;

      // REMOVE is available if
      // currentUser is an admin of this loadout and this userLoadout is not the currentUser, or
      // currentUser is not an admin of this loadout and this userLoadout is the currentUser
      const canRemoveUserLoadout =
         (thisUserIsAdmin === 1 && userLoadoutUserId !== thisUserId) ||
         (thisUserIsAdmin === 0 && userLoadoutUserId === thisUserId);

      return (
         <tr className="sharedUserRow">
            {!this.state.isDeleted && (
               <>
                  <th scope="row">{this.props.loadoutUser.username}</th>
                  <td>
                     <div className="d-flex">
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
                           {this.state.canPack === 1 && <CheckedIcon />}
                           {this.state.canPack === 0 && <DisabledIcon />}
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
                           {this.state.canEdit === 1 && <CheckedIcon />}
                           {this.state.canEdit === 0 && <DisabledIcon />}
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
                           {this.state.isAdmin === 1 && <CheckedIcon />}
                           {this.state.isAdmin === 0 && <DisabledIcon />}
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
                                    this.props.loadoutUser.userId,
                                    this.props.loadoutUser.loadoutId
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
                  <th scope="row">{this.props.loadoutUser.username} Removed</th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
               </>
            )}
         </tr>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // currentLoadout: state.currentLoadout,
      currentUserLoadout: state.currentUserLoadout,
      currentUser: state.currentUser,
   };
}

export default connect(mapStateToProps)(UserLoadoutSettings); // this is "currying"
