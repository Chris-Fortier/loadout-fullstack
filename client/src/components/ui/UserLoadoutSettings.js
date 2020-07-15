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

class UserLoadoutSettings extends React.Component {
   constructor() {
      super(); // boilerplate

      this.state = {
         isDeleted: false,
      };
   }

   deleteUserLoadout(userLoadoutId) {
      console.log("deleting user-loadout", { userLoadoutId });

      // server update
      axios
         .post("/api/v1/user-loadouts/delete?userLoadoutId=" + userLoadoutId)
         .then((res) => {
            console.log("axios res", res);
            this.setState({ isDeleted: true });
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
                        >
                           {this.props.loadoutUser.canPack === 1 && (
                              <CheckedIcon />
                           )}
                           {this.props.loadoutUser.canPack === 0 && (
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
                              UI_APPEARANCE === "colors" && "item-icon-colors",
                              {
                                 clickable: thisUserIsAdmin === 1,
                                 disabled: thisUserIsAdmin === 0,
                              }
                           )}
                        >
                           {this.props.loadoutUser.canEdit === 1 && (
                              <CheckedIcon />
                           )}
                           {this.props.loadoutUser.canEdit === 0 && (
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
                        >
                           {this.props.loadoutUser.isAdmin === 1 && (
                              <CheckedIcon />
                           )}
                           {this.props.loadoutUser.isAdmin === 0 && (
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
                        >
                           <DeleteIcon />
                        </span>
                     </div>
                  </td>
               </>
            )}
            {this.state.isDeleted && (
               <>
                  <th scope="row">{this.props.loadoutUser.username} Deleted</th>
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
