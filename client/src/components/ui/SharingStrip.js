import React from "react";
import classnames from "classnames";
import {
   IconPackage,
   IconEdit,
   IconUserCouple,
   IconKey,
} from "../../icons/icons.js";

// this is the little strip of icons appearing under a loadout name
export default class Header extends React.Component {
   render() {
      return (
         <>
            {this.props.loadout.numUsers > 1 && (
               <>
                  <span
                     style={{ fontSize: "1rem", opacity: 0.5 }}
                     className={classnames("button")}
                  >
                     {this.props.loadout.numUsers}
                  </span>
                  <span
                     className={classnames(
                        "button",
                        "loadout-card-icon",
                        "theme-icon-color",
                        "standard-sized-icon"
                     )}
                  >
                     <IconUserCouple />
                  </span>
                  &nbsp;&nbsp;
               </>
            )}
            {this.props.loadout.canPack === 1 && (
               <span
                  className={classnames(
                     "button",
                     "loadout-card-icon",
                     "theme-icon-color",
                     "standard-sized-icon"
                  )}
               >
                  <IconPackage />
               </span>
            )}
            {this.props.loadout.canEdit === 1 && (
               <span
                  className={classnames(
                     "button",
                     "loadout-card-icon",
                     "theme-icon-color",
                     "standard-sized-icon"
                  )}
               >
                  <IconEdit />
               </span>
            )}
            {this.props.loadout.isAdmin === 1 && (
               <span
                  className={classnames(
                     "button",
                     "theme-icon-color",
                     "loadout-card-icon",
                     "standard-sized-icon"
                  )}
               >
                  <IconKey />
               </span>
            )}
         </>
      );
   }
}
