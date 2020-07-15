import React from "react";
import Header from "../ui/Header";
import { connect } from "react-redux";
import UserLoadoutSettings from "../ui/UserLoadoutSettings";
import { IconArrowThinLeftCircle } from "../../icons/icons.js";
import { Link } from "react-router-dom"; // a React element for linking
import axios from "axios";
import { UI_APPEARANCE } from "../../utils/helpers";
import classnames from "classnames";

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
   async validateAndAddUserLoadout(
      username,
      loadoutId,
      canEdit = 0,
      canPack = 0,
      isAdmin = 0
   ) {
      // convert booleans to numbers
      if (canEdit === false) canEdit = 0;
      if (canEdit === true) canEdit = 1;
      if (canPack === false) canPack = 0;
      if (canPack === true) canPack = 1;
      if (isAdmin === false) isAdmin = 0;
      if (isAdmin === true) isAdmin = 1;

      console.log("validateAndAddUserLoadout()...", {
         username,
         loadoutId,
         canEdit,
         canPack,
         isAdmin,
      });

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
                                                   Can Pack
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Can Edit
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Admin
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
                                                   <td>
                                                      <div className="custom-control custom-checkbox">
                                                         <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id={
                                                               "new-can-edit-switch"
                                                            }
                                                         />
                                                         <label
                                                            className="custom-control-label"
                                                            htmlFor={
                                                               "new-can-edit-switch"
                                                            }
                                                         ></label>
                                                      </div>
                                                   </td>
                                                   <td>
                                                      <div className="custom-control custom-checkbox">
                                                         <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id={
                                                               "new-can-pack-switch"
                                                            }
                                                         />
                                                         <label
                                                            className="custom-control-label"
                                                            htmlFor={
                                                               "new-can-pack-switch"
                                                            }
                                                         ></label>
                                                      </div>
                                                   </td>
                                                   <td>
                                                      <div className="custom-control custom-checkbox">
                                                         <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id={
                                                               "new-is-admin-switch"
                                                            }
                                                         />
                                                         <label
                                                            className="custom-control-label"
                                                            htmlFor={
                                                               "new-is-admin-switch"
                                                            }
                                                         ></label>
                                                      </div>
                                                   </td>
                                                   <td
                                                      className={classnames(
                                                         "clickable",
                                                         UI_APPEARANCE ===
                                                            "dark" &&
                                                            "icon-light",
                                                         UI_APPEARANCE !==
                                                            "dark" &&
                                                            "icon-dark"
                                                      )}
                                                   >
                                                      <div
                                                         className="button primary-action-button"
                                                         onClick={() =>
                                                            this.validateAndAddUserLoadout(
                                                               document.getElementById(
                                                                  "add-user-username-input"
                                                               ).value,
                                                               this.props
                                                                  .currentItem
                                                                  .id,
                                                               document.getElementById(
                                                                  "new-can-edit-switch"
                                                               ).checked,
                                                               document.getElementById(
                                                                  "new-can-pack-switch"
                                                               ).checked,
                                                               document.getElementById(
                                                                  "new-is-admin-switch"
                                                               ).checked
                                                            )
                                                         }
                                                      >
                                                         Add
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
