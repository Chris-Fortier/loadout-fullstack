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

      // console.log("props.currentLoadout", props.currentLoadout);

      axios
         // .get(
         //    "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/loadouts.json"
         // )
         .get(
            "/api/v1/user-loadouts/?userId=84fbbb78-b2a2-11ea-b3de-0242ac130004"
         )
         .then((res) => {
            console.log("axios res", res);
            // processAllItems(res.data); // initial processing of items that creates derived properties
            const loadouts = res.data;
            this.setState({
               loadouts: loadouts,
            });
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
            // this.setState({
            //    loadouts: [
            //       {
            //          id: "42655170-7e10-4431-8d98-c2774f6414a4",
            //          name: "One-Night Camping Trip dummy",
            //          createdAt: 1592939977877, // when the loadout was created
            //          lastEditAt: 1592940077877, // the last time something was changed (item renamed, added, deleted)
            //          lastPackAt: 1592940177877, // the last time something was packed or unpacked
            //          creator: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // the user who created the loadout
            //       },
            //       {
            //          id: "e0364b00-f7fc-469c-ab82-8de3487bcc0b",
            //          name: "Day at Punchcode dummy",
            //          createdAt: 1592940277877, // when the loadout was created
            //          lastEditAt: 1592940377877, // the last time something was changed (item renamed, added, deleted)
            //          lastPackAt: 1592940477877, // the last time something was packed or unpacked
            //          creator: "84fbbb78-b2a2-11ea-b3de-0242ac130004", // the user who created the loadout
            //       },
            //    ],
            // });
         });

      // set default state values

      this.state = {
         loadouts: [],
         isEditMode: false,
      };

      // set the level to zero
      this.props.dispatch({
         type: actions.RESET_CURRENT_LEVEL,
      }); // dispatching an action
   }

   // methods happen here, such as what happens when you click on a button

   render() {
      console.log("Rendering page...");

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
                                    {this.state.loadouts.map((loadout) => (
                                       <LoadoutCard
                                          loadout={loadout}
                                          key={loadout.id}
                                       />
                                    ))}
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
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(LoadoutList); // this is "currying"
