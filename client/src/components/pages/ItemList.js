import React from "react";
import Header from "../ui/Header";
import { IconEdit, IconUpLevel, IconUserCouple } from "../../icons/icons.js";
import { LEVEL_COLORS } from "../../utils/helpers";
import classnames from "classnames";
import { connect } from "react-redux";
import actions from "../../store/actions";
import { Link } from "react-router-dom"; // a React element for linking
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";
import isEmpty from "lodash/isEmpty";
import SharingStrip from "../ui/SharingStrip";
import Compartment from "../ui/Compartment";

class ItemList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // initialize Redux stuff that should be empty if on this page:
      props.dispatch({
         type: actions.STORE_USER_LOADOUTS,
         payload: [],
      });
      props.dispatch({
         type: actions.STORE_CURRENT_LOADOUT_USER_LOADOUTS,
         payload: [],
      });

      // if the user finds themselves on this page but they are not logged in, send them to the landing page
      // TODO, this is duplicated code
      if (isEmpty(this.props.currentUser)) {
         console.log("There is no user object, kicking to landing page.");
         this.props.history.push("/");
      } else if (isEmpty(this.props.currentUserLoadout)) {
         console.log(
            "There is no current item but there is a user, kicking to loadouts page."
         );
         this.props.history.push("/loadout-list");
      }
   }

   // methods happen here, such as what happens when you click on a button

   // goes back to the loadouts page
   exitLoadout() {
      console.log("exitLoadout()...");
      // remove the store of the loadout
      this.props.dispatch({
         type: actions.CLEAR_CURRENT_LOADOUT,
         payload: {},
      });
   }

   // open the loadout sharing settings (made this a function to avoid styling associated with Link)
   gotoSharing() {
      this.props.history.push("/loadout-sharing");
   }

   // // toggle show packed items
   // toggleShowPacked() {
   //    this.setState({ isShowingPacked: !this.state.isShowingPacked });
   // }

   // // toggle put packed on bottom
   // togglePackedOnBottom() {
   //    this.setState({ isPackedOnBottom: !this.state.isPackedOnBottom });
   // }

   // toggle mode from pack to edit
   toggleEditMode() {
      // this.setState({ isEditMode: !this.state.isEditMode });
      this.props.dispatch({
         type: actions.SET_EDIT_MODE,
         payload: !this.props.isEditMode,
      });
      this.props.dispatch({
         type: actions.CLEAR_MOVEABLE_ITEM_IDS,
      });
      // this.hideUnpackConfirmation();
   }

   rotateLevel(level) {
      return (level + LEVEL_COLORS) % LEVEL_COLORS;
   }

   render() {
      console.log("Rendering page...");

      // get the current item object from the current loadout
      let pageItem = {};
      // console.log("this.props.currentItem.id", this.props.currentItem.id);
      // console.log("this.props.currentLoadout", this.props.currentLoadout);

      // default level before data is loaded so we won't briefly see a white background
      // let level = 1;
      // let thisLevelRotated = 1;
      // let parentLevelRotated = 0;
      // let childLevelRotated = 2;

      if (this.props.currentLoadout.length > 0) {
         pageItem = this.props.currentLoadout.filter((item) => {
            // console.log(item.id, this.props.currentItem.id);
            return item.id === this.props.currentItem.id;
         })[0];
         // level = pageItem.level; // set level to this to use the new level generated in processLoadout
         // thisLevelRotated = (level + LEVEL_COLORS) % LEVEL_COLORS;
         // parentLevelRotated = (level + LEVEL_COLORS - 1) % LEVEL_COLORS;
         // childLevelRotated = (level + LEVEL_COLORS + 1) % LEVEL_COLORS;
      }

      // get the current item
      // const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath
      // console.log("currentItem.level", currentItem.level);
      // let level = currentItem.level;
      // const level = this.props.currentLevel;

      const parentLevelRotated = this.rotateLevel(pageItem.level - 1);

      // get tooltip for Edit Loadout link
      let editTooltip = "";
      if (this.props.currentUserLoadout.canEdit === 1) {
         editTooltip = "Enter edit mode";
      } else {
         editTooltip =
            "This user does not have edit permissions on this loadout.";
      }

      return (
         <>
            <div
               className={classnames(
                  // !this.props.isEditMode &&
                  `ui-theme-${this.props.currentUser.uiTheme}`
                  // this.props.isEditMode && `ui-theme-2`
               )}
            >
               <Header />

               <div
                  className={classnames(
                     "item-list parent-bg",
                     pageItem.level < 2 &&
                        `parent-bg-level-${this.rotateLevel(pageItem.level)}`,
                     pageItem.level >= 2 &&
                        ` parent-bg-level-${parentLevelRotated}`
                  )}
               >
                  <div className="container-fluid item-cards-container scroll-fix">
                     {this.props.currentLoadout.length > 0 && (
                        <>
                           <div className="row">
                              <div className="col">
                                 <span
                                    className="clickable float-right"
                                    onClick={(e) => {
                                       this.gotoSharing(e);
                                    }}
                                 >
                                    <span
                                       className={`button theme-icon-color standard-sized-icon`}
                                    >
                                       <IconUserCouple />
                                    </span>
                                    &nbsp;
                                    <span className="button navigation-link">
                                       Loadout Settings
                                    </span>
                                    &nbsp;&nbsp;
                                    <SharingStrip
                                       loadout={this.props.currentUserLoadout}
                                    />
                                 </span>

                                 <span
                                    className={classnames({
                                       clickable:
                                          this.props.currentUserLoadout
                                             .canEdit === 1,
                                       disabled:
                                          this.props.currentUserLoadout
                                             .canEdit !== 1,
                                    })}
                                    onClick={(e) => {
                                       this.props.currentUserLoadout.canEdit ===
                                          1 && this.toggleEditMode(e);
                                    }}
                                    title={editTooltip}
                                 >
                                    <span
                                       className={`button theme-icon-color standard-sized-icon`}
                                    >
                                       <IconEdit />
                                    </span>
                                    &nbsp;
                                    <span
                                       className={classnames({
                                          "button navigation-link":
                                             this.props.currentUserLoadout
                                                .canEdit === 1,
                                       })}
                                    >
                                       {this.props.isEditMode && (
                                          <>Done Editing</>
                                       )}
                                       {!this.props.isEditMode && (
                                          <>Edit Loadout</>
                                       )}
                                    </span>
                                 </span>
                              </div>
                           </div>

                           <div className="row">
                              <div className="col">
                                 <div>
                                    <span
                                       className={classnames(
                                          `up-level clickable`
                                       )}
                                    >
                                       {pageItem.upLevelId !== null && (
                                          <span
                                             onClick={(e) => {
                                                // move to the parent item
                                                movePageToDifferentItem(
                                                   pageItem.upLevelId,
                                                   -1
                                                );
                                                // change the text in the page item editable input
                                                if (
                                                   document.getElementById(
                                                      "page-item-name-input"
                                                   ) !== null
                                                ) {
                                                   document.getElementById(
                                                      "page-item-name-input"
                                                   ).value =
                                                      pageItem.upLevelName;
                                                }
                                             }}
                                          >
                                             <div
                                                className={`button item-icon-colors standard-sized-icon item-icon-colors-${parentLevelRotated}`}
                                             >
                                                <IconUpLevel />
                                             </div>
                                             <span
                                                className={`button navigation-link level-text-color-parent level-text-color-${parentLevelRotated}`}
                                             >
                                                Back to&nbsp;
                                                {pageItem.upLevelName}
                                             </span>
                                          </span>
                                       )}
                                       {pageItem.upLevelId === null && (
                                          <Link to="/loadout-list">
                                             <div
                                                className={`button item-icon-colors standard-sized-icon item-icon-colors-${parentLevelRotated}`}
                                             >
                                                <IconUpLevel />
                                             </div>
                                             <span
                                                className={`button navigation-link level-text-color-parent level-text-color-${parentLevelRotated}`}
                                             >
                                                Back to My Loadouts
                                             </span>
                                          </Link>
                                       )}
                                    </span>
                                 </div>

                                 {/* the following adds empty space above the super card in edit mode so it doesn't shift */}
                                 {/* {level !== 0 && this.props.isEditMode && (
                           <div className="up-level">
                              <br />
                           </div>
                        )} */}

                                 {/* <img src={iconEdit} className="icon-dark" /> */}
                                 <Compartment
                                    compartment={pageItem}
                                    key={pageItem.id}
                                 />
                              </div>
                           </div>
                        </>
                     )}
                     {this.props.currentLoadout.length === 0 && <>Loading...</>}
                  </div>
               </div>
            </div>
         </>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // currentLoadout: state.currentLoadout,
      currentItem: state.currentItem,
      currentUser: state.currentUser,
      currentUserLoadout: state.currentUserLoadout,
      isEditMode: state.isEditMode,
      currentLoadout: state.currentLoadout,
      moveableItemIds: state.moveableItemIds,
   };
}

export default connect(mapStateToProps)(ItemList); // this is "currying"
