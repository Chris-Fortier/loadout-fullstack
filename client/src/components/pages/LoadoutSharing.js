import React from "react";
import Header from "../ui/Header";
import { connect } from "react-redux";
import UserLoadoutSettings from "../ui/UserLoadoutSettings";
import { IconArrowThinLeftCircle, IconTrash } from "../../icons/icons.js";
import { Link } from "react-router-dom"; // a React element for linking
import axios from "axios";

class LoadoutSharing extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      axios
         .get(
            "/api/v1/loadout-users?loadoutId=42655170-7e10-4431-8d98-c2774f6414a4"
         )
         .then((res) => {
            console.log("axios res", res);
            // processAllItems(res.data); // initial processing of items that creates derived properties
            const loadoutUsers = res.data;
            this.setState({
               loadoutUsers: loadoutUsers,
            });
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });

      // set default state values

      this.state = {
         loadoutUsers: [],
      };
   }

   render() {
      console.log("Rendering page...");

      return (
         <div>
            <Header />
            <div className="item-list parent-color-0">
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <Link
                           className="up-level navigation-link"
                           to="/loadout"
                        >
                           <div className="icon-dark left">
                              <IconArrowThinLeftCircle />
                           </div>
                           Back to Loadout
                        </Link>
                        <div className="">
                           <div className="">
                              <div className="row">
                                 <>
                                    <div className="col">
                                       <h4>
                                          One-Night Camping Trip
                                          <br />
                                          Sharing Settings
                                       </h4>
                                       <table className="table">
                                          <thead>
                                             <tr>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Shared with Email
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Can Edit
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Can Pack
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Admin
                                                </th>
                                                <th
                                                   scope="col"
                                                   className="display-switch-label"
                                                >
                                                   Delete
                                                </th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.state.loadoutUsers.map(
                                                (loadoutUser) => (
                                                   <UserLoadoutSettings
                                                      loadoutUser={loadoutUser}
                                                      key={loadoutUser.id}
                                                   />
                                                )
                                             )}
                                             <tr>
                                                <th scope="row">
                                                   <input
                                                      type="email"
                                                      className="edit-name"
                                                      id="exampleInputEmail1"
                                                      aria-describedby="emailHelp"
                                                      placeholder="Enter email"
                                                   />
                                                </th>
                                                <td>
                                                   <div className="custom-control custom-checkbox">
                                                      <input
                                                         type="checkbox"
                                                         className="custom-control-input"
                                                         id={
                                                            "can-edit-switch-" +
                                                            this.props.id
                                                         }
                                                      />
                                                      <label
                                                         className="custom-control-label"
                                                         htmlFor={
                                                            "can-edit-switch-" +
                                                            this.props.id
                                                         }
                                                      ></label>
                                                   </div>
                                                </td>
                                                <td>
                                                   <div className="custom-control custom-checkbox">
                                                      <input
                                                         type="checkbox"
                                                         className="custom-control-input"
                                                         id={
                                                            "can-pack-switch-" +
                                                            this.props.id
                                                         }
                                                      />
                                                      <label
                                                         className="custom-control-label"
                                                         htmlFor={
                                                            "can-pack-switch-" +
                                                            this.props.id
                                                         }
                                                      ></label>
                                                   </div>
                                                </td>
                                                <td>
                                                   <div className="custom-control custom-checkbox">
                                                      <input
                                                         type="checkbox"
                                                         className="custom-control-input"
                                                         id={
                                                            "admin-switch-" +
                                                            this.props.id
                                                         }
                                                      />
                                                      <label
                                                         className="custom-control-label"
                                                         htmlFor={
                                                            "admin-switch-" +
                                                            this.props.id
                                                         }
                                                      ></label>
                                                   </div>
                                                </td>
                                                <td>
                                                   <button
                                                      className="clickable icon-dark"
                                                      id={
                                                         "delete-shared-user-" +
                                                         1
                                                      }
                                                   >
                                                      <IconTrash />
                                                   </button>
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>{" "}
                                    </div>
                                 </>
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

export default connect(mapStateToProps)(LoadoutSharing); // this is "currying"
