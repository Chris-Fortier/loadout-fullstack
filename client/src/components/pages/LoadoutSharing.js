import React from "react";
import Header from "../ui/Header";
import { connect } from "react-redux";
import LoadoutUserCard from "../ui/LoadoutUserCard";
import { IconArrowThinLeftCircle } from "../../icons/icons.js";
import { Link } from "react-router-dom"; // a React element for linking
import axios from "axios";
import {
   UI_APPEARANCE,
   MAX_ITEM_NAME_LENGTH,
   MAX_USERNAME_LENGTH,
} from "../../utils/helpers";
import classnames from "classnames";
import { AddIcon } from "../../icons/loadout-icons";
import { IconPackage, IconEdit, IconKey } from "../../icons/icons.js";
import { getUserLoadoutsForALoadout } from "../../utils/userLoadouts";
import { renameItem } from "../../utils/items";
import actions from "../../store/actions";

class LoadoutSharing extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      console.log("this.props", this.props);

      // set default state values

      this.state = {
         addUserError: "", // stores the error message when trying to add a user to this loadout
         hasAddUserError: false, // stores whether there is an error when trying to add a user to this loadout
         deleteRolloutIsOpen: false,
         removeRolloutIsOpen: false,
      };

      console.log(
         "getUserLoadoutsForALoadout on LoadoutSharing for",
         this.props.currentItem.id
      );

      // only do this if its not undefined so that if I quickly assign a user loadouts and then push here it won't destroy them
      if (this.props.currentItem.id !== undefined) {
         getUserLoadoutsForALoadout(this.props.currentItem.id);
      }

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (JSON.stringify(this.props.currentUser) === JSON.stringify({})) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      }
   }

   // creates a new user loadout if possible given a user username and a loadout id
   async validateAndAddUserLoadout(inputId) {
      // new hard-coded defaults
      console.log(inputId);
      const username = document.getElementById(inputId).value;
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
            document.getElementById(inputId).value = "";

            // update the redux store with the new user loadout
            const updatedCurrentLoadoutUserLoadouts = [
               ...this.props.currentLoadoutUserLoadouts,
            ];
            updatedCurrentLoadoutUserLoadouts.push({
               username,
               loadoutId,
               canEdit,
               canPack,
               isAdmin,
            });
            this.props.dispatch({
               type: actions.STORE_CURRENT_LOADOUT_USER_LOADOUTS,
               payload: updatedCurrentLoadoutUserLoadouts,
            });

            // getUserLoadoutsForALoadout(this.props.currentItem.id); // refresh page to see the change
         })
         .catch((err) => {
            console.log("err", err);
            const data = err.response.data;
            const { addUserError } = data;

            // push username error to state
            if (addUserError !== "") {
               this.setState({ hasAddUserError: true, addUserError });
            } else {
               this.setState({ hasAddUserError: false, addUserError });
            }
         });
   }

   async removeUserLoadoutThenMove() {
      axios
         .put(
            "/api/v1/user-loadouts/delete?userId=" +
               this.props.currentUser.id +
               "&loadoutId=" +
               this.props.currentUserLoadout.loadoutId
         )
         .then((res) => {
            console.log("axios res", res);

            // this way it will wait until this is complete before moving
            // and it will get up to data data from db on next page
            this.props.history.push("/loadout-list");
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
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

   // renames item on server and also in redux store
   // TODO this is duplicated
   renameThisItem(e) {
      console.log("the focus left this item");
      if (e.target.value !== this.props.currentItem.name) {
         console.log("the name was changed");
         console.log(
            "will rename ",
            this.props.currentItem.name,
            "to",
            e.target.value
         );
         renameItem(this.props.currentItem.id, e.target.value); // send the change of the name to the server

         // make local changes so we can see them immediately
         // its that all I have to do is this, direclty edit the name in props, no need to dispatch it
         this.props.currentItem.name = e.target.value; // rename the child to the new name

         // send the updated item to the store, even without this I see the changes with the code above
         this.props.dispatch({
            type: actions.STORE_CURRENT_ITEM,
            payload: this.props.currentItem,
         });
      } else {
         console.log("the name was not changed");
      }
   }

   render() {
      console.log("Rendering page...", this.props.currentUser.id);

      // sort and prepare display userLoadouts
      const loadoutUsers = this.props.currentLoadoutUserLoadouts;
      const thisLoadoutUser = loadoutUsers.filter((loadoutUser) => {
         return loadoutUser.userId === this.props.currentUser.id;
      });
      // if (thisLoadoutUser.length > 0) {
      //    thisLoadoutUser[0].username = thisLoadoutUser[0].username + " (YOU)";
      // }
      const otherLoadoutUsers = loadoutUsers.filter(
         (loadoutUser) => loadoutUser.userId !== this.props.currentUser.id
      );

      return (
         <div>
            <Header />
            <div className="item-list parent-color-2">
               <div className="container-fluid scroll-fix">
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
                                       {this.props.currentUserLoadout
                                          .isAdmin === 0 && (
                                          <h4 className="dark-text-color">
                                             {this.props.currentItem.name}
                                             <br />
                                             Sharing Settings
                                          </h4>
                                       )}
                                       {this.props.currentUserLoadout
                                          .isAdmin === 1 && (
                                          <span className="flex-fill">
                                             <h4 className="dark-text-color">
                                                <input
                                                   className="edit-name"
                                                   defaultValue={
                                                      this.props.currentItem
                                                         .name
                                                   }
                                                   onBlur={(e) =>
                                                      this.renameThisItem(e)
                                                   }
                                                   maxLength={
                                                      MAX_ITEM_NAME_LENGTH
                                                   }
                                                   id="page-item-name-input"
                                                />
                                                <br />
                                                Sharing Settings
                                             </h4>
                                          </span>
                                       )}
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
                                                         this.removeUserLoadoutThenMove();
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
                                       )}

                                       {/* table */}
                                       <table className="table">
                                          <thead>
                                             {/* large header */}
                                             <tr className="d-none d-sm-table-row">
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                   style={{ width: "270px" }}
                                                >
                                                   Shared with
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <div
                                                      className={classnames(
                                                         "d-flex loadout-card-icon",
                                                         UI_APPEARANCE ===
                                                            "dark" &&
                                                            "icon-light",
                                                         UI_APPEARANCE !==
                                                            "dark" &&
                                                            "icon-dark"
                                                      )}
                                                   >
                                                      <IconPackage />
                                                   </div>
                                                   <div>
                                                      <span className="d-none d-md-inline">
                                                         Can&nbsp;
                                                      </span>
                                                      Pack
                                                   </div>
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <div
                                                      className={classnames(
                                                         "d-flex loadout-card-icon",
                                                         UI_APPEARANCE ===
                                                            "dark" &&
                                                            "icon-light",
                                                         UI_APPEARANCE !==
                                                            "dark" &&
                                                            "icon-dark"
                                                      )}
                                                   >
                                                      <IconEdit />
                                                   </div>
                                                   <div>
                                                      <span className="d-none d-md-inline">
                                                         Can&nbsp;
                                                      </span>
                                                      Edit
                                                   </div>
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <div
                                                      className={classnames(
                                                         "d-flex loadout-card-icon",
                                                         UI_APPEARANCE ===
                                                            "dark" &&
                                                            "icon-light",
                                                         UI_APPEARANCE !==
                                                            "dark" &&
                                                            "icon-dark"
                                                      )}
                                                   >
                                                      <IconKey />
                                                   </div>
                                                   <div>
                                                      <span className="d-none d-md-inline">
                                                         Is&nbsp;
                                                      </span>
                                                      Admin
                                                   </div>
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <div
                                                      className={classnames(
                                                         "d-flex loadout-card-icon",
                                                         UI_APPEARANCE ===
                                                            "dark" &&
                                                            "icon-light",
                                                         UI_APPEARANCE !==
                                                            "dark" &&
                                                            "icon-dark"
                                                      )}
                                                   ></div>
                                                   <div>
                                                      <span className="d-none d-md-inline">
                                                         Remove/Add
                                                      </span>
                                                      <span className="d-md-none d-inline">
                                                         Rem/Add
                                                      </span>
                                                   </div>
                                                </th>
                                             </tr>

                                             {/* small header */}
                                             <tr className="d-table-row d-sm-none">
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                   style={{ width: "80%" }}
                                                >
                                                   Shared with
                                                </th>

                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   <div
                                                      className={classnames(
                                                         "d-flex loadout-card-icon",
                                                         UI_APPEARANCE ===
                                                            "dark" &&
                                                            "icon-light",
                                                         UI_APPEARANCE !==
                                                            "dark" &&
                                                            "icon-dark"
                                                      )}
                                                   ></div>
                                                   <div>
                                                      <span className="d-none d-md-inline">
                                                         Remove/Add
                                                      </span>
                                                      <span className="d-md-none d-inline">
                                                         Rem/Add
                                                      </span>
                                                   </div>
                                                </th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {thisLoadoutUser.map(
                                                (userLoadout) => (
                                                   <LoadoutUserCard
                                                      userLoadout={userLoadout}
                                                      key={userLoadout.id}
                                                   />
                                                )
                                             )}
                                             {otherLoadoutUsers.map(
                                                (userLoadout) => (
                                                   <LoadoutUserCard
                                                      userLoadout={userLoadout}
                                                      key={userLoadout.id}
                                                   />
                                                )
                                             )}

                                             {this.props.currentUserLoadout
                                                .isAdmin === 1 && (
                                                <>
                                                   {/* large footer */}
                                                   <tr className="sharedUserRow d-none d-sm-table-row">
                                                      <th
                                                         scope="row"
                                                         colspan="4"
                                                      >
                                                         <input
                                                            className={classnames(
                                                               {
                                                                  "my-input": true,
                                                                  "input-invalid": this
                                                                     .state
                                                                     .hasAddUserError,
                                                               }
                                                            )}
                                                            id="add-user-username-input-large"
                                                            aria-describedby="UsernameHelp"
                                                            placeholder="Enter another username"
                                                            maxLength={
                                                               MAX_USERNAME_LENGTH
                                                            }
                                                         />
                                                         {this.state
                                                            .hasAddUserError && (
                                                            <div
                                                               className="text-danger"
                                                               style={{
                                                                  "font-weight":
                                                                     "400",
                                                               }}
                                                               id="add-user-error"
                                                            >
                                                               {
                                                                  this.state
                                                                     .addUserError
                                                               }
                                                            </div>
                                                         )}
                                                      </th>
                                                      <td>
                                                         <div className="d-flex">
                                                            <span
                                                               className={classnames(
                                                                  "item-card-icon clickable",
                                                                  (UI_APPEARANCE ===
                                                                     "light" ||
                                                                     UI_APPEARANCE ===
                                                                        "dark") &&
                                                                     "item-icon-colors-2",
                                                                  UI_APPEARANCE ===
                                                                     "colors" &&
                                                                     "item-icon-colors"
                                                               )}
                                                               onClick={() =>
                                                                  this.validateAndAddUserLoadout(
                                                                     "add-user-username-input-large"
                                                                  )
                                                               }
                                                            >
                                                               <AddIcon />
                                                            </span>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                   {/* small footer */}
                                                   <tr className="sharedUserRow d-table-row d-sm-none">
                                                      <th scope="row">
                                                         <input
                                                            className={classnames(
                                                               {
                                                                  "my-input": true,
                                                                  "input-invalid": this
                                                                     .state
                                                                     .hasAddUserError,
                                                               }
                                                            )}
                                                            id="add-user-username-input-small"
                                                            aria-describedby="UsernameHelp"
                                                            placeholder="Enter another username"
                                                            maxLength={
                                                               MAX_USERNAME_LENGTH
                                                            }
                                                         />
                                                         {this.state
                                                            .hasAddUserError && (
                                                            <div
                                                               className="text-danger"
                                                               style={{
                                                                  "font-weight":
                                                                     "400",
                                                               }}
                                                               id="add-user-error"
                                                            >
                                                               {
                                                                  this.state
                                                                     .addUserError
                                                               }
                                                            </div>
                                                         )}
                                                      </th>
                                                      <td>
                                                         <div className="d-flex">
                                                            <span
                                                               className={classnames(
                                                                  "item-card-icon clickable",
                                                                  (UI_APPEARANCE ===
                                                                     "light" ||
                                                                     UI_APPEARANCE ===
                                                                        "dark") &&
                                                                     "item-icon-colors-2",
                                                                  UI_APPEARANCE ===
                                                                     "colors" &&
                                                                     "item-icon-colors"
                                                               )}
                                                               onClick={() =>
                                                                  this.validateAndAddUserLoadout(
                                                                     "add-user-username-input-small"
                                                                  )
                                                               }
                                                            >
                                                               <AddIcon />
                                                            </span>
                                                         </div>
                                                      </td>
                                                   </tr>{" "}
                                                </>
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
      currentLoadoutUserLoadouts: state.currentLoadoutUserLoadouts,
   };
}

export default connect(mapStateToProps)(LoadoutSharing); // this is "currying"
