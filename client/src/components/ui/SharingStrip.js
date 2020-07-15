import React from "react";
import { UI_APPEARANCE } from "../../utils/helpers";
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
                     style={{ "font-size": "1rem", opacity: 0.5 }}
                     className={classnames(
                        (UI_APPEARANCE === "light" ||
                           UI_APPEARANCE === "dark") &&
                           "level-text-color-0",
                        UI_APPEARANCE === "colors" && "dark-text-color"
                     )}
                  >
                     {this.props.loadout.numUsers}
                  </span>
                  <span
                     className={classnames(
                        "loadout-card-icon",
                        UI_APPEARANCE === "dark" && "icon-light",
                        UI_APPEARANCE !== "dark" && "icon-dark"
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
                     "loadout-card-icon",
                     UI_APPEARANCE === "dark" && "icon-light",
                     UI_APPEARANCE !== "dark" && "icon-dark"
                  )}
               >
                  <IconPackage />
               </span>
            )}
            {this.props.loadout.canEdit === 1 && (
               <span
                  className={classnames(
                     "loadout-card-icon",
                     UI_APPEARANCE === "dark" && "icon-light",
                     UI_APPEARANCE !== "dark" && "icon-dark"
                  )}
               >
                  <IconEdit />
               </span>
            )}
            {this.props.loadout.isAdmin === 1 && (
               <span
                  className={classnames(
                     "loadout-card-icon",
                     UI_APPEARANCE === "dark" && "icon-light",
                     UI_APPEARANCE !== "dark" && "icon-dark"
                  )}
               >
                  <IconKey />
               </span>
            )}
         </>
      );
   }
}