import React from "react";
import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import actions from "../../store/actions";

// export default function Header() {
class Header extends React.Component {
   constructor() {
      super(); // boilerplate

      // set default state values for each component
      this.state = {
         rollout: "none", // which rollout is active, either "Loadout", "Account" or "none"
      };
   }

   // log out of the current user
   logOutCurrentUser() {
      console.log("logOutCurrentUser()...");
      this.props.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: {},
      });
      // also remove the store of the loadout
      this.props.dispatch({
         type: actions.CLEAR_CURRENT_LOADOUT,
         payload: {},
      });
   }

   toggleLoadoutRollout() {
      if (this.state.rollout !== "Loadout") {
         this.setState({ rollout: "Loadout" });
      } else {
         this.setState({ rollout: "none" });
      }
      console.log(this.state);
   }

   toggleAccountRollout() {
      if (this.state.rollout !== "Account") {
         this.setState({ rollout: "Account" });
      } else {
         this.setState({ rollout: "none" });
      }
      console.log(this.state);
   }

   // renders the Loadout rollout menu
   renderLoadoutRollout() {
      return (
         <>
            <div className="row">
               <div className="col">
                  <button to="" className="btn btn-link">
                     About Loadout
                  </button>
               </div>
            </div>
         </>
      );
   }

   // renders the Account rollout menu
   renderAccountRollout() {
      return (
         <>
            {/* <div className="row">
               <div className="col">
                  <p className="float-right">username12345</p>
               </div>
            </div> */}
            <div className="row">
               <div className="col">
                  <p className="float-right">name@gmail.com</p>
               </div>
            </div>
            <div className="row">
               <div className="col">
                  <Link
                     className="btn btn-link float-right"
                     to="/account-settings"
                  >
                     Account Settings
                  </Link>
               </div>
            </div>
            <div className="row">
               <div className="col">
                  <Link
                     to="/"
                     className="btn btn-link float-right"
                     onClick={() => this.logOutCurrentUser()}
                  >
                     Log Out
                  </Link>
               </div>
            </div>
         </>
      );
   }

   // // renders a rollout for either Loadout or About, its a wrapper for both
   // renderRollout() {
   //    return (
   //       // <div className="row">
   //       //    <div className="col">
   //       <>
   //          {this.state.rollout === "Loadout" && this.renderLoadoutRollout()}
   //          {this.state.rollout === "Account" && this.renderAccountRollout()}
   //       </>
   //       //    </div>
   //       // </div>
   //    );
   // }

   render() {
      return (
         <div className="page-header">
            <div className="row">
               <div className="col">
                  <button
                     onClick={() => this.toggleLoadoutRollout()}
                     className="btn btn-link"
                  >
                     Loadout
                  </button>
                  <button
                     onClick={() => this.toggleAccountRollout()}
                     className="btn btn-link float-right"
                  >
                     Account
                  </button>
               </div>
            </div>
            {this.state.rollout === "Loadout" && this.renderLoadoutRollout()}
            {this.state.rollout === "Account" && this.renderAccountRollout()}
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // put all the things in state we need access to in this component
   };
}

export default connect(mapStateToProps)(Header);
