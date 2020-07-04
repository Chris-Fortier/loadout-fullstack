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
   constructor() {
      super(); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         hasEmailRollout: false,
         hasPasswordRollout: false,
         hasDeleteRollout: false,
      };
   }

   backToLoadout() {
      this.props.history.push("/loadout");
      window.scrollTo(0, 0); // sets focus to the top of the page
   }

   toggleEmailRollout() {
      console.log("toggleEmailRollout()...");
      this.setState({ hasEmailRollout: !this.state.hasEmailRollout });
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
                                 onClick={() => this.toggleEmailRollout()}
                              >
                                 Change Your Email
                              </span>
                              {this.state.hasEmailRollout && (
                                 <>
                                    <label
                                       className="my-input-label form-label"
                                       for="new-email"
                                    >
                                       Enter your new email address
                                    </label>
                                    <input
                                       type="email"
                                       className="my-input"
                                       value="chris@gmail.com"
                                       id="new-email"
                                    />
                                    <label
                                       className="my-input-label form-label"
                                       for="password-for-email-change"
                                    >
                                       Enter your password
                                    </label>
                                    <input
                                       type="password"
                                       className="my-input"
                                       id="password-for-email-change"
                                    />
                                    <div className="button primary-action-button">
                                       Confirm Email Change
                                    </div>
                                    <div
                                       className="button navigation-link"
                                       onClick={() => this.toggleEmailRollout()}
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
                              // to="/loadout"
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
   return {};
}

export default withRouter(connect(mapStateToProps)(AccountSettings)); // this is "currying"
