import React from "react";
import Header from "../ui/Header";
// import orderBy from "lodash/orderBy";
// import { IconArrowThinLeftCircle } from "../../icons/icons.js";
// import { MAX_ITEM_NAME_LENGTH, LEVEL_COLORS } from "../../utils/helpers";
// import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import LoadoutCard from "../ui/LoadoutCard";
// import ItemCardEdit from "../ui/ItemCardEdit";
import {
   // MOVE_UPDOWN,
   // MAX_ITEM_NAME_LENGTH,
   LEVEL_COLORS,
   // SUBITEM_DISPLAY_MODE,
   UI_APPEARANCE,
} from "../../utils/helpers";
import classnames from "classnames";
import axios from "axios";

class LoadoutList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values

      this.state = {
         // loadouts: [],
         isEditMode: false,
      };

      // set the level to zero
      this.props.dispatch({
         type: actions.RESET_CURRENT_LEVEL,
      }); // dispatching an action

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (JSON.stringify(this.props.currentUser) === JSON.stringify({})) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      }
   }

   // methods happen here, such as what happens when you click on a button

   loadLoadouts() {
      axios
         // .get(
         //    "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/loadouts.json"
         // )
         .get("/api/v1/user-loadouts/")
         .then((res) => {
            console.log("axios res", res);
            // processAllItems(res.data); // initial processing of items that creates derived properties
            const loadouts = res.data;
            this.props.dispatch({
               type: actions.STORE_USER_LOADOUTS,
               payload: loadouts,
            });
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });

      console.log("this.props.currentUser", this.props.currentUser);
   }

   // this is a "lifecycle" method like render(), we don't need to call it manually
   componentDidMount() {
      this.loadLoadouts();
   }

   // add a loadout
   addLoadout() {
      console.log("clicked add loadout");

      // server update
      axios
         .put("/api/v1/loadouts/insert-loadout")
         .then((res) => {
            console.log("axios res.data", res.data);

            // update the client side with an equivalent new loadout
            this.props.userLoadouts.push({
               canEdit: 1,
               canPack: 1,
               contentSummary: "ready",
               isAdmin: 1,
               loadoutId: res.data, // use the loadout id generated on the server
               loadoutName: "New Loadout",
               name: "New Loadout",
               numChildren: 0,
               numPackedChildren: 0,
               status: 0,
            });

            // push to the store
            this.props.dispatch({
               type: actions.STORE_USER_LOADOUTS,
               payload: this.props.userLoadouts,
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

      const level = 0; // loudouts list page is always level 0

      return (
         <div>
            <Header />
            <div
               className={classnames(
                  "item-list",
                  UI_APPEARANCE === "light" && "parent-bg-light",
                  UI_APPEARANCE === "dark" && "parent-bg-dark",
                  UI_APPEARANCE === "colors" &&
                     level < 2 &&
                     "parent-color-" + String(level % LEVEL_COLORS),
                  UI_APPEARANCE === "colors" &&
                     level >= 2 &&
                     "parent-color-" + String((level - 1) % LEVEL_COLORS)
               )}
            >
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <div className="">
                           <div className="">
                              <div className="row">
                                 <>
                                    <div className="col">
                                       <h4
                                          className={classnames(
                                             (UI_APPEARANCE === "light" ||
                                                UI_APPEARANCE === "dark") &&
                                                "level-text-color-" +
                                                   String(level % LEVEL_COLORS),
                                             UI_APPEARANCE === "colors" &&
                                                "dark-text-color"
                                          )}
                                       >
                                          My Loadouts
                                       </h4>
                                    </div>
                                 </>
                              </div>
                           </div>
                           <div className="">
                              <div className="row">
                                 <div className="col">
                                    {/* One-Night Camping Trip */}
                                    {this.props.userLoadouts.length === 0 && (
                                       // <div
                                       //    className="navigation-link"
                                       //    onClick={() => {
                                       //       this.loadLoadouts();
                                       //    }}
                                       // >
                                       //    Click here to refresh the user's
                                       //    loadout list, the user is loading too
                                       //    slow, need to fix
                                       // </div>
                                       <div>
                                          {this.props.currentUser.username} does
                                          not have any loadouts.
                                       </div>
                                    )}
                                    {this.props.userLoadouts.map((loadout) => (
                                       <LoadoutCard
                                          loadout={loadout}
                                          key={loadout.id}
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
