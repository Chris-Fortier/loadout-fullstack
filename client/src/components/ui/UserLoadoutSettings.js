import React from "react";
import { connect } from "react-redux";
import {
   // IconArrowThinRightCircle,
   IconTrash,
} from "../../icons/icons.js";
import { UI_APPEARANCE } from "../../utils/helpers";
import classnames from "classnames";
import axios from "axios";

class UserLoadoutSettings extends React.Component {
   constructor() {
      super(); // boilerplate

      this.state = {
         isDeleted: false,
      };
   }

   deleteUserLoadout(userLoadoutId) {
      console.log("deleting user-loadout", { userLoadoutId });

      // server update
      axios
         .post("/api/v1/user-loadouts/delete?userLoadoutId=" + userLoadoutId)
         .then((res) => {
            console.log("axios res", res);
            this.setState({ isDeleted: true });
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });

      // refreshPage();
   }

   render() {
      return (
         <tr>
            {!this.state.isDeleted && (
               <>
                  <th scope="row">{this.props.loadoutUser.email}</th>
                  <td>
                     <div className="custom-control custom-checkbox">
                        <input
                           type="checkbox"
                           className="custom-control-input"
                           id={"can-edit-switch-" + this.props.loadoutUser.id}
                           checked={this.props.loadoutUser.canEdit === 1}
                        />
                        <label
                           className="custom-control-label"
                           htmlFor={
                              "can-edit-switch-" + this.props.loadoutUser.id
                           }
                        ></label>
                     </div>
                  </td>
                  <td>
                     <div className="custom-control custom-checkbox">
                        <input
                           type="checkbox"
                           className="custom-control-input"
                           id={"can-pack-switch-" + this.props.loadoutUser.id}
                           checked={this.props.loadoutUser.canPack === 1}
                        />
                        <label
                           className="custom-control-label"
                           htmlFor={
                              "can-pack-switch-" + this.props.loadoutUser.id
                           }
                        ></label>
                     </div>
                  </td>
                  <td>
                     <div className="custom-control custom-checkbox">
                        <input
                           type="checkbox"
                           className="custom-control-input"
                           id={"admin-switch-" + this.props.loadoutUser.id}
                           checked={this.props.loadoutUser.isAdmin === 1}
                        />
                        <label
                           className="custom-control-label"
                           htmlFor={"admin-switch-" + this.props.loadoutUser.id}
                        ></label>
                     </div>
                  </td>
                  <td
                     className={classnames(
                        "clickable",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
                     )}
                     onClick={() =>
                        this.deleteUserLoadout(this.props.loadoutUser.id)
                     }
                  >
                     <IconTrash />
                  </td>
               </>
            )}
            {this.state.isDeleted && (
               <>
                  <th scope="row">{this.props.loadoutUser.email} Deleted</th>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
               </>
            )}
         </tr>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(UserLoadoutSettings); // this is "currying"
