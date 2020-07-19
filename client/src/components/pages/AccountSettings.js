import React from "react";
import { Link } from "react-router-dom"; // a React element for linking
import { withRouter } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import { logOutCurrentUser } from "../../utils/helpers";
import axios from "axios";
import toDisplayDate from "date-fns/format";
import actions from "../../store/actions";

class AccountSettings extends React.Component {
   constructor(props) {
      super(props); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         // change username
         hasChangeUsernameRollout: false,
         changeUsernameUsernameError: "",
         changeUsernamePasswordError: "",
         changeUsernameResult: "",

         // change password
         hasChangePasswordRollout: false,
         changePasswordOldPasswordError: "",
         changePasswordNewPasswordError: "",
         changePasswordResult: "",

         // delete account
         hasDeleteRollout: false,
         deleteAccountPasswordError: "",
      };

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (JSON.stringify(this.props.currentUser) === JSON.stringify({})) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      }
   }

   backToMyLoadouts() {
      this.props.history.push("/loadout-list");
      window.scrollTo(0, 0); // sets focus to the top of the page
   }

   toggleUsernameRollout() {
      console.log("toggleUsernameRollout()...");
      this.setState({
         hasChangeUsernameRollout: !this.state.hasChangeUsernameRollout,
      });
   }

   togglePasswordRollout() {
      console.log("togglePasswordRollout()...");
      this.setState({
         hasChangePasswordRollout: !this.state.hasChangePasswordRollout,
      });
   }

   toggleDeleteRollout() {
      console.log("toggleDeleteRollout()...");
      this.setState({ hasDeleteRollout: !this.state.hasDeleteRollout });
   }

   // tests if the new username and password are valid and if so changes username
   async validateAndChangeUsername() {
      const usernameInput = document.getElementById(
         "username-for-username-change"
      ).value;
      const passwordInput = document.getElementById(
         "password-for-username-change"
      ).value;

      // create the object that will be the body that is sent
      const user = {
         newUsername: usernameInput,
         password: passwordInput, // send the plain text password over secure connection, the server will hash it
      };
      // console.log("client", user);

      // post to API
      axios
         .put("api/v1/users/set-username", user)
         .then((res) => {
            // // set token in localStorage
            // const authTokenLoadout = res.data.accessToken;
            // localStorage.setItem("authTokenLoadout", authTokenLoadout);
            // console.log("authTokenLoadout", authTokenLoadout);

            // const user = jwtDecode(authTokenLoadout); // decode the user from the access token

            // send the user with new name to Redux
            this.props.currentUser.username = usernameInput;
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: this.props.currentUser,
            });

            // TODO: local token is not updated with the new username, but I don't think I am using that username for anything

            // set authorization headers for every request at the moment of log in
            // axios.defaults.headers.common["x-auth-token"] = authTokenLoadout;

            // post a message saying name was changed
            this.setState({
               changeUsernameUsernameError: "",
               changeUsernamePasswordError: "",
               changeUsernameResult: "Username changed",
            });

            // clear the fields so they don't accidentally change it again with valid password still populated
            document.getElementById("username-for-username-change").value = "";
            document.getElementById("password-for-username-change").value = "";
         })
         .catch((err) => {
            const data = err.response.data;
            console.log("err", data);
            const {
               changeUsernameUsernameError,
               changeUsernamePasswordError,
            } = data;

            this.setState({
               changeUsernameUsernameError,
               changeUsernamePasswordError,
               changeUsernameResult: "",
            });
         });
   }

   // tests if the old password is valid and if so changes password to new one
   async validateAndChangePassword() {
      const oldPasswordInput = document.getElementById(
         "old-password-for-password-change"
      ).value;
      const newPasswordInput = document.getElementById(
         "new-password-for-password-change"
      ).value;

      // create the object that will be the body that is sent
      const user = {
         oldPassword: oldPasswordInput, // send the plain text password over secure connection, the server will hash it
         newPassword: newPasswordInput, // send the plain text password over secure connection, the server will hash it
      };

      // post to API
      axios
         .put("api/v1/users/set-password", user)
         .then((res) => {
            const data = res.data;

            this.setState(data); // the data received from server has the same keywords as state variables

            // clear the password fields so they don't accidentally change it again with valid password still populated
            document.getElementById("old-password-for-password-change").value =
               "";
            document.getElementById("new-password-for-password-change").value =
               "";
         })
         .catch((err) => {
            const data = err.response.data;

            this.setState(data); // the data received from server has the same keywords as state variables
         });
   }

   validateAndDeleteUser() {
      const passwordInput = document.getElementById(
         "password-for-delete-account"
      ).value;

      // create the object that will be the body that is sent
      const user = {
         password: passwordInput, // send the plain text password over secure connection, the server will hash it
      };
      // console.log("client", user);

      axios
         .post("/api/v1/users/delete", user)
         .then((res) => {
            console.log("axios res", res);
            this.setState({
               deleteAccountPasswordError: "",
            });
            logOutCurrentUser(this.props);

            this.props.history.push("/"); // send to landing page
         })
         .catch((err) => {
            const data = err.response.data;
            console.log("err", data);
            const { deleteAccountPasswordError } = data;

            this.setState({
               deleteAccountPasswordError,
            });
         });
   }

   toDisplayDateIfNotNull(jsDate) {
      if (jsDate !== null && jsDate !== undefined) {
         return toDisplayDate(jsDate, "MMM d, yyyy HH:mm");
      } else {
         return "Unknown";
      }
   }

   render() {
      return (
         <div className="landing-bg-2">
            <div className="container-fluid landing-page">
               <div className="row">
                  <div
                     style={{ width: "max(calc((100% - 320px)*.33),15px)" }}
                  ></div>
                  <div
                     style={{
                        width: "min(320px,(100% - 30px))",
                        marginBottom: "50px",
                     }}
                  >
                     {/* <h1 className="mt-5 text-white">Account Settings</h1> */}
                     <div className="card mt-8 mb-3">
                        <div className="card-body">
                           <h5>
                              Account Settings for&nbsp;
                              {this.props.currentUser.username}
                           </h5>
                           <p className="my-input-label form-label">
                              Account Created
                           </p>
                           <p>
                              {this.toDisplayDateIfNotNull(
                                 this.props.currentUser.createdAt
                              )}
                           </p>
                           <p className="my-input-label form-label">
                              Currently logged in since
                           </p>
                           <p>
                              {this.toDisplayDateIfNotNull(
                                 this.props.currentUser.thisLoginAt
                              )}
                           </p>
                           <p className="my-input-label form-label">
                              Previous Log in
                           </p>
                           <p>
                              {this.toDisplayDateIfNotNull(
                                 this.props.currentUser.lastLoginAt
                              )}
                           </p>
                           <div className="card-section">
                              <span
                                 className="button navigation-link w-100"
                                 onClick={() => this.toggleUsernameRollout()}
                              >
                                 Change Your Username...
                              </span>
                              {this.state.hasChangeUsernameRollout && (
                                 <>
                                    {/* <label
                                       className="my-input-label form-label"
                                       htmlFor="username-for-username-change"
                                    >
                                       Enter your new username
                                    </label> */}
                                    <input
                                       className="my-input"
                                       placeholder={
                                          this.props.currentUser.username
                                       }
                                       id="username-for-username-change"
                                    />
                                    {this.state.changeUsernameUsernameError !==
                                       "" && (
                                       <div
                                          className="text-danger"
                                          id="change-username-username-error"
                                       >
                                          {
                                             this.state
                                                .changeUsernameUsernameError
                                          }
                                       </div>
                                    )}
                                    {/* <label
                                       className="my-input-label form-label"
                                       htmlFor="password-for-username-change"
                                    >
                                       Enter your password
                                    </label> */}
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="password-for-username-change"
                                       placeholder="Enter your password"
                                    />
                                    {this.state.changeUsernamePasswordError !==
                                       "" && (
                                       <div
                                          className="text-danger"
                                          id="change-username-password-error"
                                       >
                                          {
                                             this.state
                                                .changeUsernamePasswordError
                                          }
                                       </div>
                                    )}
                                    <div
                                       className="button primary-action-button"
                                       onClick={() =>
                                          this.validateAndChangeUsername()
                                       }
                                    >
                                       Confirm Username Change
                                    </div>

                                    <div className="text-success">
                                       {this.state.changeUsernameResult}
                                    </div>

                                    <div
                                       className="button navigation-link"
                                       onClick={() =>
                                          this.toggleUsernameRollout()
                                       }
                                    >
                                       <br />
                                       Cancel
                                    </div>
                                 </>
                              )}
                           </div>
                           <div className="card-section">
                              <span
                                 className="button navigation-link w-100"
                                 onClick={() => this.togglePasswordRollout()}
                              >
                                 Change Your Password...
                              </span>
                              {this.state.hasChangePasswordRollout && (
                                 <>
                                    {/* <label
                                       htmlFor="old-password"
                                       className="my-input-label form-label"
                                    >
                                       Enter your old password
                                    </label> */}
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="old-password-for-password-change"
                                       placeholder="Enter your old password"
                                    />
                                    {this.state
                                       .changePasswordOldPasswordError !==
                                       "" && (
                                       <div className="text-danger">
                                          {
                                             this.state
                                                .changePasswordOldPasswordError
                                          }
                                       </div>
                                    )}
                                    {/* <label
                                       htmlFor="new-password"
                                       className="my-input-label form-label"
                                    >
                                       Enter your new password
                                    </label> */}
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="new-password-for-password-change"
                                       placeholder="Enter your new password"
                                    />
                                    {this.state
                                       .changePasswordNewPasswordError !==
                                       "" && (
                                       <div className="text-danger">
                                          {
                                             this.state
                                                .changePasswordNewPasswordError
                                          }
                                       </div>
                                    )}
                                    <div
                                       className="button primary-action-button"
                                       onClick={() =>
                                          this.validateAndChangePassword()
                                       }
                                    >
                                       Confirm Password Change
                                    </div>

                                    <div className="text-success">
                                       {this.state.changePasswordResult}
                                    </div>

                                    <div
                                       className="button navigation-link"
                                       onClick={() =>
                                          this.togglePasswordRollout()
                                       }
                                    >
                                       <br />
                                       Cancel
                                    </div>
                                 </>
                              )}
                           </div>
                           <div className="card-section">
                              <span
                                 className="button navigation-link w-100"
                                 onClick={() => this.toggleDeleteRollout()}
                              >
                                 Delete Your Account...
                              </span>
                              {this.state.hasDeleteRollout && (
                                 <>
                                    <p>
                                       Deleting this account will also delete
                                       all the loadouts that are not shared with
                                       anyone else.
                                    </p>
                                    {/* <label
                                       className="my-input-label form-label"
                                       htmlFor="password-for-delete-account"
                                    >
                                       Enter your password
                                    </label> */}
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="password-for-delete-account"
                                       placeholder="Enter your password"
                                    />
                                    {this.state.deleteAccountPasswordError !==
                                       "" && (
                                       <div
                                          className="text-danger"
                                          id="change-username-password-error"
                                       >
                                          {
                                             this.state
                                                .deleteAccountPasswordError
                                          }
                                       </div>
                                    )}{" "}
                                    <div
                                       className="button danger-action-button"
                                       onClick={() =>
                                          this.validateAndDeleteUser(
                                             this.props.currentUser.id
                                          )
                                       }
                                    >
                                       Confirm Delete of
                                       <br />
                                       {this.props.currentUser.username}
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
                           {/* <div className="button"> */}
                           <button
                              className="button navigation-link"
                              // to="/loadout-list"
                              onClick={() => this.backToMyLoadouts()}
                           >
                              Back to My Loadouts
                           </button>
                           {/* </div> */}
                           <Link
                              to="/"
                              className="button primary-action-button"
                              onClick={() => logOutCurrentUser(this.props)}
                           >
                              Log Out&nbsp;{this.props.currentUser.username}
                           </Link>
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
   return { currentUser: state.currentUser };
}

export default withRouter(connect(mapStateToProps)(AccountSettings)); // this is "currying"
