import React from "react";
import Header from "../ui/Header";
import { connect } from "react-redux";
import UserLoadoutSettings from "../ui/UserLoadoutSettings";
import { IconArrowThinLeftCircle } from "../../icons/icons.js";
import { Link } from "react-router-dom"; // a React element for linking
import axios from "axios";
import { UI_APPEARANCE } from "../../utils/helpers";
import classnames from "classnames";
import { AddIcon } from "../../icons/loadout-icons";
import {
   IconPackage,
   IconEdit,
   IconKey,
   // IconUserCouple,
} from "../../icons/icons.js";
import { removeUserLoadout, getUserLoadouts } from "../../utils/userLoadouts";

class LoadoutSharing extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      console.log("this.props", this.props);

      // set default state values

      this.state = {
         thisLoadoutUser: [],
         otherLoadoutUsers: [], // stores loadoutUsers besides the current user
         addUserError: "", // stores the error message when trying to add a user to this loadout
         hasAddUserError: false, // stores whether there is an error when trying to add a user to this loadout
         deleteRolloutIsOpen: false,
         removeRolloutIsOpen: false,
      };

      this.refreshPage();

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (JSON.stringify(this.props.currentUser) === JSON.stringify({})) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      }
   }

   refreshPage() {
      console.log("refreshing page...");
      axios
         .get("/api/v1/loadout-users?loadoutId=" + this.props.currentItem.id)
         .then((res) => {
            console.log("axios res", res);
            const loadoutUsers = res.data;
            const thisLoadoutUser = loadoutUsers.filter((loadoutUser) => {
               return loadoutUser.userId === this.props.currentUser.id;
            });
            thisLoadoutUser[0].username =
               thisLoadoutUser[0].username + " (YOU)";
            this.setState({
               thisLoadoutUser: thisLoadoutUser,
               otherLoadoutUsers: loadoutUsers.filter((loadoutUser) => {
                  return loadoutUser.userId !== this.props.currentUser.id;
               }),
            });
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });
   }

   // give an existing user access to this loadout
   // if the user doesn't already have access
   // insert a new userLoadout into the database with the permissions indicated
   // else
   // display a message saying "This loadout is already shared with _"

   // update permissions for a user
   // (this happens whenever a checkbox is clicked)

   // delete a user's access
   // delete the userLoadout from the database

   // creates a new user loadout if possible given a user username and a loadout id
   async validateAndAddUserLoadout() {
      // // convert booleans to numbers
      // if (canEdit === false) canEdit = 0;
      // if (canEdit === true) canEdit = 1;
      // if (canPack === false) canPack = 0;
      // if (canPack === true) canPack = 1;
      // if (isAdmin === false) isAdmin = 0;
      // if (isAdmin === true) isAdmin = 1;

      // console.log("validateAndAddUserLoadout()...", {
      //    username,
      //    loadoutId,
      //    canEdit,
      //    canPack,
      //    isAdmin,
      // });

      // new hard-coded defaults
      const username = document.getElementById("add-user-username-input").value;
      const loadoutId = this.props.currentItem.id;
      const canEdit = 1;
      const canPack = 1;
      const isAdmin = 0;

      // post to API
      axios
         .post(
            "/api/v1/user-loadouts/insert?username=" +
               username +
               "&loadoutId=" +
               loadoutId +
               "&canEdit=" +
               canEdit +
               "&canPack=" +
               canPack +
               "&isAdmin=" +
               isAdmin
         )
         .then((res) => {
            console.log("res.data", res.data);

            // remove error if there is one
            this.setState({ hasAddUserError: false, addUserError: "" });

            // clear the add user username field
            document.getElementById("add-user-username-input").value = "";

            this.refreshPage(); // refresh page to see the change
         })
         .catch((err) => {
            const data = err.response.data;
            console.log("err", data);
            const { addUserError } = data;

            // push username error to state
            if (addUserError !== "") {
               this.setState({ hasAddUserError: true, addUserError });
            } else {
               this.setState({ hasAddUserError: false, addUserError });
            }
         });
   }

   // delete a loadout
   deleteLoadout() {
      console.log("clicked delete loadout");

      // server update
      axios
         .put(
            "/api/v1/loadouts/delete-loadout?loadoutId=" +
               this.props.currentUserLoadout.loadoutId
         )
         .then((res) => {
            console.log("axios res.data", res.data);

            // go back to my loadouts
            this.props.history.push("/loadout-list");
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });
   }

   toggleDeleteRollout() {
      console.log("toggleDeleteRollout()...");
      this.setState({ deleteRolloutIsOpen: !this.state.deleteRolloutIsOpen });
   }

   toggleRemoveRollout() {
      console.log("toggleRemoveRollout()...");
      this.setState({ removeRolloutIsOpen: !this.state.removeRolloutIsOpen });
   }

   render() {
      console.log("Rendering page...", this.props.currentUser.id);

      return (
         <div>
            <Header />
            <div className="item-list parent-color-1">
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <Link
                           className="up-level navigation-link"
                           to="/item-list"
                        >
                           <div className="icon-dark left">
                              <IconArrowThinLeftCircle />
                           </div>
                           Back to Loadout
                        </Link>
                        <div className="">
                           <div className="">
                              <div className="row">
                                 <>
                                    <div className="col">
                                       <h4 className="dark-text-color">
                                          {this.props.currentItem.name}
                                          <br />
                                          Sharing Settings
                                       </h4>
                                       {this.props.currentUserLoadout
                                          .isAdmin === 1 && (
                                          <div className="card-section">
                                             <span
                                                className="button navigation-link w-100"
                                                onClick={() =>
                                                   this.toggleDeleteRollout()
                                                }
                                             >
                                                Delete this loadout...
                                             </span>
                                             {this.state
                                                .deleteRolloutIsOpen && (
                                                <>
                                                   <div
                                                      className="button danger-action-button"
                                                      onClick={() =>
                                                         this.deleteLoadout()
                                                      }
                                                   >
                                                      Delete this loadout for
                                                      all users
                                                   </div>
                                                   <div
                                                      className="button navigation-link"
                                                      onClick={() =>
                                                         this.toggleDeleteRollout()
                                                      }
                                                   >
                                                      <br />
                                                      Cancel
                                                   </div>
                                                </>
                                             )}
                                          </div>
                                       )}
                                       {this.props.currentUserLoadout
                                          .isAdmin === 0 && (
                                          <div className="card-section">
                                             <span
                                                className="button navigation-link w-100"
                                                onClick={() =>
                                                   this.toggleRemoveRollout()
                                                }
                                             >
                                                Remove yourself from this
                                                loadout...
                                             </span>
                                             {this.state
                                                .removeRolloutIsOpen && (
                                                <>
                                                   <div
                                                      className="button primary-action-button"
                                                      onClick={() => {
                                                         removeUserLoadout(
                                                            this.props
                                                               .currentUser.id,
                                                            this.props
                                                               .currentUserLoadout
                                                               .loadoutId
                                                         );
                                                         getUserLoadouts(); // get the updated list of user loadouts after deleting one
                                                         this.props.history.push(
                                                            "/loadout-list"
                                                         );
                                                      }}
                                                   >
                                                      Remove your access to this
                                                      shared loadout
                                                   </div>
                                                   <div
                                                      className="button navigation-link"
                                                      onClick={() =>
                                                         this.toggleRemoveRollout()
                                                      }
                                                   >
                                                      <br />
                                                      Cancel
                                                   </div>
                                                </>
                                             )}
                                          </div>
                                       )}{" "}
                                       <table className="table">
                                          <thead>
                                             <tr>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Shared with
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <span className="d-flex">
                                                      <span
                                                         className={classnames(
                                                            "loadout-card-icon",
                                                            UI_APPEARANCE ===
                                                               "dark" &&
                                                               "icon-light",
                                                            UI_APPEARANCE !==
                                                               "dark" &&
                                                               "icon-dark"
                                                         )}
                                                      >
                                                         <IconPackage />
                                                      </span>
                                                      &nbsp;Can Pack
                                                   </span>
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <span className="d-flex">
                                                      <span
                                                         className={classnames(
                                                            "loadout-card-icon",
                                                            UI_APPEARANCE ===
                                                               "dark" &&
                                                               "icon-light",
                                                            UI_APPEARANCE !==
                                                               "dark" &&
                                                               "icon-dark"
                                                         )}
                                                      >
                                                         <IconEdit />
                                                      </span>
                                                      &nbsp;Can Edit
                                                   </span>
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <span className="d-flex">
                                                      <span
                                                         className={classnames(
                                                            "loadout-card-icon",
                                                            UI_APPEARANCE ===
                                                               "dark" &&
                                                               "icon-light",
                                                            UI_APPEARANCE !==
                                                               "dark" &&
                                                               "icon-dark"
                                                         )}
                                                      >
                                                         <IconKey />
                                                      </span>
                                                      &nbsp;Is Admin
                                                   </span>
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Remove
                                                </th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.state.thisLoadoutUser.map(
                                                (loadoutUser) => (
                                                   <UserLoadoutSettings
                                                      loadoutUser={loadoutUser}
                                                      key={loadoutUser.id}
                                                   />
                                                )
                                             )}
                                             {this.state.otherLoadoutUsers.map(
                                                (loadoutUser) => (
                                                   <UserLoadoutSettings
                                                      loadoutUser={loadoutUser}
                                                      key={loadoutUser.id}
                                                   />
                                                )
                                             )}

                                             {this.props.currentUserLoadout
                                                .isAdmin === 1 && (
                                                <tr className="sharedUserRow">
                                                   <th scope="row">
                                                      <input
                                                         className={classnames({
                                                            "my-input": true,
                                                            "input-invalid": this
                                                               .state
                                                               .hasAddUserError,
                                                         })}
                                                         id="add-user-username-input"
                                                         aria-describedby="UsernameHelp"
                                                         placeholder="Enter another user's username"
                                                      />
                                                      {this.state
                                                         .hasAddUserError && (
                                                         <div
                                                            className="text-danger"
                                                            id="add-user-error"
                                                         >
                                                            {
                                                               this.state
                                                                  .addUserError
                                                            }
                                                         </div>
                                                      )}
                                                   </th>
                                                   <td></td>
                                                   <td></td>
                                                   <td></td>
                                                   <td>
                                                      <div className="d-flex">
                                                         <span
                                                            className={classnames(
                                                               "item-card-icon clickable",
                                                               (UI_APPEARANCE ===
                                                                  "light" ||
                                                                  UI_APPEARANCE ===
                                                                     "dark") &&
                                                                  "item-icon-colors-1",
                                                               UI_APPEARANCE ===
                                                                  "colors" &&
                                                                  "item-icon-colors"
                                                            )}
                                                            onClick={() =>
                                                               this.validateAndAddUserLoadout()
                                                            }
                                                         >
                                                            <AddIcon />
                                                         </span>
                                                      </div>
                                                   </td>
                                                </tr>
                                             )}
                                          </tbody>
                                       </table>
                                    </div>
                                 </>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      currentItem: state.currentItem,
      currentUser: state.currentUser,
      currentUserLoadout: state.currentUserLoadout,
   };
}

export default connect(mapStateToProps)(LoadoutSharing); // this is "currying"
