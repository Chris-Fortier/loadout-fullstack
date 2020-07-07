import React from "react";
// import { Link } from "react-router-dom"; // a React element for linking
import { EMAIL_REGEX } from "../../utils/helpers";
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
         signupEmailError: "",
         signupPasswordError: "",
         hasSignupEmailError: false,
         hasSignupPasswordError: false,

         // log in
         existingEmailError: "",
         existingPasswordError: "",
         hasExistingEmailError: false,
         hasExistingPasswordError: false,
      };
   }

   setNewAccountMode() {
      this.setState({
         landingMode: "new-account",
         signupEmailError: "",
         signupPasswordError: "",
         hasSignupEmailError: false,
         hasSignupPasswordError: false,
      });
   }

   setLogInMode() {
      this.setState({
         landingMode: "log-in",
         existingEmailError: "",
         existingPasswordError: "",
         hasExistingEmailError: false,
         hasExistingPasswordError: false,
      });
   }

   // tests if the sign up email is valid
   async setExistingEmailState(emailInput) {
      console.log("setExistingEmailState()...");
      console.log("emailInput", emailInput);
      const lowerCasedEmailInput = emailInput.toLowerCase();

      if (emailInput === "") {
         console.log("bad existing email");
         this.setState({
            existingEmailError:
               "Please enter the email associated with your account.",
            hasExistingEmailError: true,
         });
      } else if (!EMAIL_REGEX.test(lowerCasedEmailInput)) {
         this.setState({
            existingEmailError: "Please enter a valid email address.",
            hasExistingEmailError: true,
         });
      } else {
         this.setState({
            existingEmailError: "",
            hasExistingEmailError: false,
         });
      }
   }

   // checks if an existing email is valid
   async setExistingPasswordState(passwordInput) {
      console.log("setExistingPasswordState()...");
      console.log("passwordInput", passwordInput);

      if (passwordInput === "") {
         // check if password input is blank
         this.setState({
            existingPasswordError: "Please enter your password.",
            hasExistingPasswordError: true,
         });
      } else {
         this.setState({
            existingPasswordError: "",
            hasExistingPasswordError: false,
         });
      }
   }

   // tests if the email and password are valid inputs for logging in
   async validateLogInAttempt() {
      console.log("validateLogInAttempt()...");
      const emailInput = document.getElementById("existing-email-input").value;
      const passwordInput = document.getElementById("existing-password-input")
         .value;

      // await is used on these to make sure we get the states of these before the if statement
      await this.setExistingEmailState(emailInput);
      await this.setExistingPasswordState(passwordInput);

      if (
         !this.state.hasExistingEmailError &&
         !this.state.hasExistingPasswordError
      ) {
         const user = {
            id: getUuid(),
            email: emailInput,
            password: passwordInput, // send the plain text password over secure connection, the server will hash it
            createdAt: Date.now(),
         };

         console.log("created user object for POST: ", user);
         // Mimic API response:
         axios
            .get(
               "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/user.json"
            )
            .then((res) => {
               const currentUser = res.data;
               console.log(currentUser);
               this.props.dispatch({
                  type: actions.UPDATE_CURRENT_USER,
                  payload: res.data,
               });
            })
            .catch((error) => {
               console.log(error);
            });

         // redirect the user
         // todo: make this its own function
         this.props.history.push("/loadout-list");
         window.scrollTo(0, 0); // sets focus to the top of the page
      }
   }

   // bypasses log in and goes straight to app
   bypassLogIn() {
      console.log("created user object for POST: ");
      // Mimic API response:
      axios
         .get(
            "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/user.json"
         )
         .then((res) => {
            const currentUser = res.data;
            console.log(currentUser);
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: res.data,
            });
         })
         .catch((error) => {
            console.log(error);
         });

      // redirect the user
      // todo: make this its own function
      this.props.history.push("/loadout-list");
      window.scrollTo(0, 0); // sets focus to the top of the page
   }

   // tests if the email and password are valid and if so creates the user
   async validateAndCreateUser() {
      const emailInput = document.getElementById("signup-email-input").value;
      const passwordInput = document.getElementById("signup-password-input")
         .value;

      // create user obj
      const user = {
         id: getUuid(), // make a new uuid
         email: emailInput,
         password: passwordInput, // send the plain text password over secure connection, the server will hash it
         createdAt: Date.now(),
      };
      console.log("created user object for POST: ", user);

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
            // go to next page
            this.props.history.push("/loadout-list");
         })
         .catch((err) => {
            const data = err.response.data;
            console.log("err", data);
            const { signupEmailError, signupPasswordError } = data;

            // push email error to state
            if (signupEmailError !== "") {
               this.setState({ hasSignupEmailError: true, signupEmailError });
            } else {
               this.setState({ hasSignupEmailError: false, signupEmailError });
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
                  id="existing-email-input"
                  placeholder="Enter Your Email"
                  required
                  type="email"
                  className={classnames({
                     "my-input": true,
                     "input-invalid": this.state.hasExistingPasswordError,
                  })}
               />
               {this.state.hasExistingEmailError && (
                  <div className="text-danger">
                     {this.state.existingEmailError}
                  </div>
               )}
               <input
                  type="password"
                  id="existing-password-input"
                  placeholder="Enter Your Password"
                  required
                  className={classnames({
                     "my-input": true,
                     "input-invalid": this.state.hasExistingPasswordError,
                  })}
               />
               {this.state.hasExistingPasswordError && (
                  <div className="text-danger" id="password-error">
                     {this.state.existingPasswordError}
                  </div>
               )}
               <div
                  className="button primary-action-button"
                  onClick={() => this.validateLogInAttempt()}
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
               <div
                  className="button navigation-link float-right"
                  onClick={() => this.bypassLogIn()}
               >
                  bypass log in
               </div>
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
                  id="signup-email-input"
                  placeholder="Enter Your Email"
                  required
                  type="email"
                  className={classnames({
                     "my-input": true,
                     "input-invalid": this.state.hasSignupEmailError,
                  })}
               />
               {this.state.hasSignupEmailError && (
                  <div className="text-danger" id="signup-email-error">
                     {this.state.signupEmailError}
                  </div>
               )}
               <input
                  type="password"
                  id="signup-password-input"
                  placeholder="Enter Your Password"
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
                     <h1 className="mt-5 text-white">Loadout</h1>
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
