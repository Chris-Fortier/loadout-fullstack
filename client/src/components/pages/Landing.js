import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { v4 as getUuid } from "uuid";
import classnames from "classnames";
import {
   IconUserAdd,
   // IconUserCheck,
   // IconKey,
   // IconHome,
   // IconEdit,
} from "../../icons/icons.js";
import { withRouter } from "react-router-dom"; // a React element for linking
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";
import LoadoutLogo from "../../logo/loadout.svg";
// import { NUM_BACKGROUNDS } from "../../utils/helpers";
import jwtDecode from "jwt-decode";

// export default function Landing() {
class Landing extends React.Component {
   constructor() {
      super(); // boilerplate line that needs to be in the constructor

      // initialize state inside the constructor via this.state = {key: value, key: value,};
      // set default state values for each component
      // define a component's initial state
      this.state = {
         landingMode: "log-in", // set to either "log-in" or "new-account"

         // sign up
         signupUsernameError: "",
         signupPasswordError: "",
         hasSignupUsernameError: false,
         hasSignupPasswordError: false,

         // log in
         loginUsernameError: "",
         loginPasswordError: "",
         hasLoginUsernameError: false,
         hasLoginPasswordError: false,
      };
   }

   setNewAccountMode() {
      this.setState({
         landingMode: "new-account",
         signupUsernameError: "",
         signupPasswordError: "",
         hasSignupUsernameError: false,
         hasSignupPasswordError: false,
      });
   }

   setLogInMode() {
      this.setState({
         landingMode: "log-in",
         loginUsernameError: "",
         loginPasswordError: "",
         hasLoginUsernameError: false,
         hasLoginPasswordError: false,
      });
   }

   // tests if the username and password are valid and if so creates the user
   async validateAndLogInUser(usernameInput, passwordInput) {
      const user = {
         username: usernameInput,
         password: passwordInput, // send the plain text password over secure connection, the server will hash it
      };
      // call API response:
      axios
         .post("/api/v1/users/auth", user)
         .then((res) => {
            // set token in localStorage
            const authToken = res.data.accessToken;
            localStorage.setItem("authToken", authToken);
            console.log("authToken", authToken);

            const user = jwtDecode(authToken); // decode the user from the access token

            // send the user to Redux
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: user,
            });

            // set authorization headers for every request at the moment of log in
            axios.defaults.headers.common["x-auth-token"] = authToken;

            // go to next page
            this.props.history.push("/loadout-list");
            window.scrollTo(0, 0); // sets focus to the top of the page
         })
         .catch((err) => {
            console.log("err", err);
            const { data } = err.response;
            console.log("data", data);
            const { loginUsernameError, loginPasswordError } = data;

            // push username error to state
            if (loginUsernameError !== "") {
               this.setState({
                  hasLoginUsernameError: true,
                  loginUsernameError,
               });
            } else {
               this.setState({
                  hasLoginUsernameError: false,
                  loginUsernameError,
               });
            }

            // push password error to state
            if (loginPasswordError !== "") {
               this.setState({
                  hasLoginPasswordError: true,
                  loginPasswordError,
               });
            } else {
               this.setState({
                  hasLoginPasswordError: false,
                  loginPasswordError,
               });
            }
         });
   }

   // bypasses log in and goes straight to app using the given user object
   bypassLogIn(user) {
      this.props.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: user,
      });
      // go to next page
      this.props.history.push("/loadout-list");
      window.scrollTo(0, 0); // sets focus to the top of the page
   }

   // tests if the username and password are valid and if so creates the user
   async validateAndCreateUser() {
      const usernameInput = document.getElementById("signup-username-input")
         .value;
      const passwordInput = document.getElementById("signup-password-input")
         .value;

      // create user obj
      const user = {
         id: getUuid(), // make a new uuid
         username: usernameInput,
         password: passwordInput, // send the plain text password over secure connection, the server will hash it
         createdAt: Date.now(),
      };

      // post to API
      axios
         .post("/api/v1/users", user) // post to this endpoint the user object we just made
         .then((res) => {
            console.log("res.data", res.data);
            // update currentUser in global state with API response
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: res.data,
            });

            // set authorization headers for every request at the moment of log in
            // TODO: add this in once we pass the authToken in our response
            // axios.defaults.headers.common["x-auth-token"] = authToken;

            // go to next page
            this.props.history.push("/loadout-list");
            window.scrollTo(0, 0); // sets focus to the top of the page
         })
         .catch((err) => {
            const data = err.response.data;
            console.log("err", data);
            const { signupUsernameError, signupPasswordError } = data;

            // push username error to state
            if (signupUsernameError !== "") {
               this.setState({
                  hasSignupUsernameError: true,
                  signupUsernameError,
               });
            } else {
               this.setState({
                  hasSignupUsernameError: false,
                  signupUsernameError,
               });
            }

            // push password error to state
            if (signupPasswordError !== "") {
               console.log("setting the password error");
               this.setState({
                  hasSignupPasswordError: true,
                  signupPasswordError,
               });
               console.log(
                  this.state.hasSignupPasswordError,
                  this.state.signupPasswordError
               );
            } else {
               this.setState({
                  hasSignupPasswordError: false,
                  signupPasswordError,
               });
            }
         });
   }

   renderLogInCard() {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <h5>log in</h5>
               <input
                  id="login-username-input"
                  placeholder="Enter Your Username"
                  required
                  className={classnames({
                     "my-input": true,
                     "input-invalid": this.state.hasLoginPasswordError,
                  })}
               />
               {this.state.hasLoginUsernameError && (
                  <div className="text-danger">
                     {this.state.loginUsernameError}
                  </div>
               )}
               <input
                  type="password"
                  id="login-password-input"
                  placeholder="Enter Your Password"
                  required
                  className={classnames({
                     "my-input": true,
                     "input-invalid": this.state.hasLoginPasswordError,
                  })}
               />
               {this.state.hasLoginPasswordError && (
                  <div className="text-danger" id="password-error">
                     {this.state.loginPasswordError}
                  </div>
               )}
               <div
                  className="button primary-action-button"
                  onClick={() =>
                     this.validateAndLogInUser(
                        document.getElementById("login-username-input").value,
                        document.getElementById("login-password-input").value
                     )
                  }
               >
                  log in
               </div>
               <div
                  className="button navigation-link"
                  onClick={() => this.setNewAccountMode()}
               >
                  <span className="icon-dark left">
                     <IconUserAdd />
                  </span>
                  &nbsp;Make a New Account
               </div>
               {/* <div
                  className="button navigation-link float-right"
                  onClick={() =>
                     this.bypassLogIn({
                        id: "0e3e3882-1264-467c-94bf-f9850b7edbd4",
                        username: "chris",
                        createdAt: "1594145052944",
                     })
                  }
               >
                  bypass log in
               </div> */}
            </div>
         </div>
      );
   }

   renderSignUpCard() {
      return (
         <div className="card mb-3">
            <div className="card-body">
               <h5>
                  <span className="icon-dark left">
                     <IconUserAdd />
                  </span>
                  Sign Up
               </h5>
               {/* <p>
                  <span className="icon-dark left">
                     <IconUserAdd />
                  </span>
                  Make a New Account
               </p> */}
               <input
                  id="signup-username-input"
                  placeholder="Enter A Username"
                  required
                  className={classnames({
                     "my-input": true,
                     "input-invalid": this.state.hasSignupUsernameError,
                  })}
               />
               {this.state.hasSignupUsernameError && (
                  <div className="text-danger" id="signup-username-error">
                     {this.state.signupUsernameError}
                  </div>
               )}
               <input
                  type="password"
                  id="signup-password-input"
                  placeholder="Enter A Password"
                  required
                  className={classnames({
                     "my-input": true,
                     "input-invalid": this.state.hasSignupPasswordError,
                  })}
               />
               {this.state.hasSignupPasswordError && (
                  <div className="text-danger" id="signup-password-error">
                     {this.state.signupPasswordError}
                  </div>
               )}
               <div
                  className="button primary-action-button"
                  onClick={() => this.validateAndCreateUser()}
               >
                  sign up
               </div>
               <div
                  className="button navigation-link"
                  onClick={() => this.setLogInMode()}
               >
                  Use an Existing Account
               </div>
            </div>
         </div>
      );
   }

   // Math.floor(Math.random() * NUM_BACKGROUNDS

   render() {
      return (
         <div
            className={classnames(
               this.state.landingMode === "log-in" && "landing-bg-0",
               this.state.landingMode === "new-account" && "landing-bg-1"
            )}
         >
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
                     {/* <h1 className="mt-5 text-white">Loadout</h1> */}
                     <img
                        src={LoadoutLogo}
                        alt="Loadout"
                        width="100%"
                        className="mb-4 mt-8"
                     />
                     {/* render either the log-in or new account cards depending on landingMode */}
                     {this.state.landingMode === "log-in" &&
                        this.renderLogInCard()}
                     {this.state.landingMode === "new-account" &&
                        this.renderSignUpCard()}
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

export default withRouter(connect(mapStateToProps)(Landing)); // this is "currying"
