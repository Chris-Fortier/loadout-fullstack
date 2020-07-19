import React from "react";
import { Link } from "react-router-dom"; // a React element for linking
import { connect } from "react-redux";
import LoadoutLogoSmall from "../../logo/loadout-small.svg";
import { logOutCurrentUser } from "../../utils/helpers";

// export default function Header() {
class Header extends React.Component {
   constructor() {
      super(); // boilerplate

      // set default state values for each component
      this.state = {
         rollout: "none", // which rollout is active, either "Loadout", "Account" or "none"
      };
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
                     onClick={() => logOutCurrentUser(this.props)}
                  >
                     Log Out
                  </Link>
               </div>
            </div>
         </>
      );
   }

   render() {
      return (
         <div className="page-header">
            <div className="container-fluid header-container">
               <div className="row">
                  <div className="col">
                     <button
                        onClick={() => this.toggleLoadoutRollout()}
                        className="btn btn-link"
                     >
                        {/* Loadout */}
                        <img
                           src={LoadoutLogoSmall}
                           alt="Loadout"
                           height="18px"
                           style={{
                              marginTop: "-5px",
                           }}
                        />
                     </button>
                     <button
                        onClick={() => this.toggleAccountRollout()}
                        className="btn btn-link float-right"
                     >
                        {this.props.currentUser.username}
                     </button>
                  </div>
               </div>
               {this.state.rollout === "Loadout" && this.renderLoadoutRollout()}
               {this.state.rollout === "Account" && this.renderAccountRollout()}
            </div>
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // put all the things in state we need access to in this component
      currentUser: state.currentUser,
   };
}

export default connect(mapStateToProps)(Header);
