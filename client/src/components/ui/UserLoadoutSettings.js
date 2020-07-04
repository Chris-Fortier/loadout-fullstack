import React from "react";
import { connect } from "react-redux";
import {
   // IconArrowThinRightCircle,
   IconTrash,
} from "../../icons/icons.js";

class UserLoadoutSettings extends React.Component {
   render() {
      return (
         <tr>
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
                     htmlFor={"can-edit-switch-" + this.props.loadoutUser.id}
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
                     htmlFor={"can-pack-switch-" + this.props.loadoutUser.id}
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
            <td>
               <button
                  className="clickable icon-dark"
                  id={"delete-shared-user-" + 1}
               >
                  <IconTrash />
               </button>
            </td>
         </tr>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(UserLoadoutSettings); // this is "currying"
