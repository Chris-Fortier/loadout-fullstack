import React from "react";
import Header from "../ui/Header";
import { connect } from "react-redux";
import actions from "../../store/actions";
import LoadoutCard from "../ui/LoadoutCard";
import classnames from "classnames";
import axios from "axios";
import { getUserLoadouts } from "../../utils/userLoadouts";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";

class LoadoutList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // initialize Redux stuff that should be empty if on this page:
      props.dispatch({
         type: actions.STORE_CURRENT_ITEM,
         payload: {},
      });
      props.dispatch({
         type: actions.STORE_CURRENT_USER_LOADOUT,
         payload: {},
      });
      props.dispatch({
         type: actions.STORE_CURRENT_LOADOUT_USER_LOADOUTS,
         payload: [],
      });
      props.dispatch({
         type: actions.SET_EDIT_MODE,
         payload: false,
      });
      props.dispatch({
         type: actions.STORE_CURRENT_LOADOUT,
         payload: [],
      });
      props.dispatch({
         type: actions.CLEAR_MOVEABLE_ITEM_IDS,
      });

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (JSON.stringify(this.props.currentUser) === JSON.stringify({})) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      }

      this.state = {
         // message: `Getting your loadouts from the server...`,
         message: "",
      };
   }

   // methods happen here, such as what happens when you click on a button

   // this is a "lifecycle" method like render(), we don't need to call it manually
   componentDidMount() {
      getUserLoadouts();
   }

   // add a loadout
   addLoadout() {
      console.log("clicked add loadout");

      // server update
      axios
         .post("/api/v1/loadouts/insert-loadout")
         .then((res) => {
            console.log("axios res.data", res.data);

            // update the client side with an equivalent new user loadout

            const newUserLoadout = {
               canEdit: 1, //
               canPack: 1, //
               contentSummary: "ready", //
               isAdmin: 1, //
               loadoutId: res.data, // use the loadout id generated on the server
               loadoutName: "Untitled Loadout", //
               name: "Untitled Loadout", //
               numChildren: 0, //
               numResolvedChildren: 0, //
               status: 0, //
               numUsers: 1,
            };
            this.props.userLoadouts.push({ ...newUserLoadout });

            // push to the store
            this.props.dispatch({
               type: actions.STORE_USER_LOADOUTS,
               payload: this.props.userLoadouts,
            });

            movePageToDifferentItem(
               res.data, // the id from the new loadout
               +1,
               { ...newUserLoadout }
            );

            // move to the new loadout item list
            this.props.history.push("/item-list");

            // turn on edit mode so they can immediately name the loadout and add items
            // we know they have full permissions to do this upon making a new loadout
            this.props.dispatch({
               type: actions.SET_EDIT_MODE,
               payload: true,
            });
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });
   }

   render() {
      console.log("Rendering page...");

      console.log("this.props.currentUser", this.props.currentUser);

      return (
         <div className="ui-theme">
            <Header />
            <div
               className={classnames(`item-list parent-bg parent-bg-level-0`)}
            >
               <div className="container-fluid single-wide-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <div className="">
                           <div className="">
                              <div className="row">
                                 <div className="col">
                                    <h4
                                       className={classnames(
                                          `level-text-color-this level-text-color-0`
                                       )}
                                    >
                                       My Loadouts
                                    </h4>
                                 </div>
                              </div>
                           </div>
                           <div className="">
                              <div className="row mb-8">
                                 <div className="col">
                                    {/* One-Night Camping Trip */}
                                    {this.props.userLoadouts.length === 0 && (
                                       // <div
                                       //    className="navigation-link"
                                       //    onClick={() => {
                                       //       getUserLoadouts();
                                       //    }}
                                       // >
                                       //    Click here to refresh the user's
                                       //    loadout list, the user is loading too
                                       //    slow, need to fix
                                       // </div>
                                       <div>{this.state.message}</div>
                                    )}
                                    {this.props.userLoadouts.map((loadout) => (
                                       <LoadoutCard
                                          loadout={loadout}
                                          key={loadout.id}
                                          parentProps={this.props}
                                       />
                                    ))}
                                    <div
                                       className="button secondary-action-button narrow-button"
                                       onClick={() => {
                                          this.addLoadout();
                                       }}
                                    >
                                       Add Loadout
                                    </div>
                                 </div>
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
      // currentLoadout: state.currentLoadout,
      currentUser: state.currentUser,
      userLoadouts: state.userLoadouts,
   };
}

export default connect(mapStateToProps)(LoadoutList); // this is "currying"
