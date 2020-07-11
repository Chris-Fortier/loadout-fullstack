import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
// import { EMAIL_REGEX } from "../../utils/helpers";
// import { v4 as getUuid } from "uuid";
// import hash from "object-hash";
// import classnames from "classnames";
// import {
//    IconUserAdd,
//    // IconUserCheck,
//    // IconKey,
//    // IconHome,
//    // IconEdit,
// } from "../../icons/icons.js";
import { withRouter } from "react-router-dom"; // a React element for linking
// import axios from "axios";
// import actions from "../../store/actions";
import { connect } from "react-redux";

class AccountSettings extends React.Component {
   constructor(props) {
      super(props); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         hasUsernameRollout: false,
         hasPasswordRollout: false,
         hasDeleteRollout: false,
      };

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (JSON.stringify(this.props.currentUser) === JSON.stringify({})) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      }
   }

   backToLoadout() {
      this.props.history.push("/loadout-list");
      window.scrollTo(0, 0); // sets focus to the top of the page
   }

   toggleUsernameRollout() {
      console.log("toggleUsernameRollout()...");
      this.setState({ hasUsernameRollout: !this.state.hasUsernameRollout });
   }

   togglePasswordRollout() {
      console.log("togglePasswordRollout()...");
      this.setState({ hasPasswordRollout: !this.state.hasPasswordRollout });
   }

   toggleDeleteRollout() {
      console.log("toggleDeleteRollout()...");
      this.setState({ hasDeleteRollout: !this.state.hasDeleteRollout });
   }

   render() {
      return (
         <div className="background-image">
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
                     <h1 className="mt-5 text-white">Account Settings</h1>
                     <div className="card mb-3">
                        <div className="card-body">
                           <h5>chris@gmail.com</h5>
                           <div className="card-section">
                              <span
                                 className="button navigation-link w-100"
                                 onClick={() => this.toggleUsernameRollout()}
                              >
                                 Change Your Username
                              </span>
                              {this.state.hasUsernameRollout && (
                                 <>
                                    <label
                                       className="my-input-label form-label"
                                       for="new-username"
                                    >
                                       Enter your new username
                                    </label>
                                    <input
                                       className="my-input"
                                       value="chris@gmail.com"
                                       id="new-username"
                                    />
                                    <label
                                       className="my-input-label form-label"
                                       for="password-for-username-change"
                                    >
                                       Enter your password
                                    </label>
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="password-for-username-change"
                                    />
                                    <div className="button primary-action-button">
                                       Confirm Username Change
                                    </div>
                                    <div
                                       className="button navigation-link"
                                       onClick={() =>
                                          this.toggleUsernameRollout()
                                       }
                                    >
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
                                 Change Your Password
                              </span>
                              {this.state.hasPasswordRollout && (
                                 <>
                                    <label
                                       for="old-password"
                                       className="my-input-label form-label"
                                    >
                                       Enter your old password
                                    </label>
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="old-password"
                                    />
                                    <label
                                       for="new-password"
                                       className="my-input-label form-label"
                                    >
                                       Enter your new password
                                    </label>
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="new-password"
                                    />
                                    <div className="button primary-action-button">
                                       Confirm Password Change
                                    </div>
                                    <div
                                       className="button navigation-link"
                                       onClick={() =>
                                          this.togglePasswordRollout()
                                       }
                                    >
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
                                 Delete Your Account
                              </span>
                              {this.state.hasDeleteRollout && (
                                 <>
                                    <p>
                                       Deleting this account will also delete
                                       all the loadouts that are not shared with
                                       anyone else.
                                    </p>
                                    <div className="button danger-action-button">
                                       Confirm Account Delete
                                    </div>
                                    <div
                                       className="button navigation-link"
                                       onClick={() =>
                                          this.toggleDeleteRollout()
                                       }
                                    >
                                       Cancel
                                    </div>
                                 </>
                              )}
                           </div>
                           {/* <div className="button"> */}
                           <button
                              className="button navigation-link"
                              // to="/loadout-list"
                              onClick={() => this.backToLoadout()}
                           >
                              Back to Loadout
                           </button>
                           {/* </div> */}
                           <div className="button primary-action-button">
                              Log Out
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
   return { currentUser: state.currentUser };
}

export default withRouter(connect(mapStateToProps)(AccountSettings)); // this is "currying"
