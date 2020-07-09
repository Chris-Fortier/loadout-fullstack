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

      console.log("this.props", this.props);

      axios
         .get("/api/v1/loadout-users?loadoutId=" + this.props.currentItem.id)
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

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (JSON.stringify(this.props.currentUser) === JSON.stringify({})) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      }
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
                           to="/item-list"
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
                                          {this.props.currentItem.name}
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
      currentItem: state.currentItem,
      currentUser: state.currentUser,
   };
}

export default connect(mapStateToProps)(LoadoutSharing); // this is "currying"
