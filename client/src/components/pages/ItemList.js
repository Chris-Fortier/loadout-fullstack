import React from "react";
import Header from "../ui/Header";
import { IconEdit, IconUpLevel, IconUserCouple } from "../../icons/icons.js";
import { MAX_ITEM_NAME_LENGTH, LEVEL_COLORS } from "../../utils/helpers";
import classnames from "classnames";
import { connect } from "react-redux";
import actions from "../../store/actions";
import ItemCard from "../ui/ItemCard";
import ItemCardEdit from "../ui/ItemCardEdit";
import { Link } from "react-router-dom"; // a React element for linking
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";
import {
   renameItem,
   processLoadout,
   toggleMoveableItemId,
   deleteItemId,
} from "../../utils/items";
import isEmpty from "lodash/isEmpty";
import SharingStrip from "../ui/SharingStrip";
import axios from "axios";
import {
   PickUpItem,
   PutDownItem,
   AddIcon,
   DeleteIcon,
} from "../../icons/loadout-icons";

class ItemList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      // set default state values

      this.state = {
         isShowingPacked: true,
         isPackedOnBottom: false,
         // isEditMode: false,
         isShowingUnpackConfirmation: false,
      };

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

   // roll out a dialog for unpacking an item's contents
   rolloutUnpackConfirmation(unpackDescendantsText) {
      return (
         <div>
            {/* {unpackChildrenText !== "" && (
               <div
                  className="button primary-action-button"
                  onClick={(e) => {
                     this.confirmUnpackChildren();
                  }}
               >
                  {unpackChildrenText}
               </div>
            )} */}

            {unpackDescendantsText !== "" && (
               <div
                  className="button primary-action-button"
                  onClick={(e) => {
                     this.confirmUnpackDescendants();
                  }}
               >
                  {unpackDescendantsText}
               </div>
            )}

            <div
               className={classnames("button navigation-link")}
               onClick={() => this.toggleUnpackRollout()}
            >
               <br />
               Cancel
            </div>
         </div>
      );
   }

   // unpack all descendants of the current item
   confirmUnpackDescendants() {
      const currentLoadout = this.props.currentLoadout;

      // unpack all descendants in the client
      function unpackDescendants(parentIndex) {
         for (let c in currentLoadout) {
            if (currentLoadout[c].parentId === currentLoadout[parentIndex].id) {
               console.log(currentLoadout[c].name, "unpacked");
               // if its not a compartment
               if (currentLoadout[c].status !== 4) {
                  currentLoadout[c].status = 0; // unpack it
               }
               unpackDescendants(c); // unpack any descendants
            }
         }
      }
      unpackDescendants(
         currentLoadout.findIndex((item) => {
            return item.id === this.props.currentItem.id;
         })
      );

      // do client side change immediately for the sake of responsiveness
      this.props.dispatch({
         type: actions.STORE_CURRENT_LOADOUT,
         payload: processLoadout(currentLoadout),
      }); // update Redux

      // set the status in the database
      axios
         .put(
            "/api/v1/loadouts/set-descendants-status?newStatus=" +
               0 +
               "&itemId=" +
               this.props.currentItem.id
         )
         .then((res) => {
            console.log("axios res", res);
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });

      this.hideUnpackConfirmation(); // close the message
   }

   confirmUnpackChildren() {
      this.unpackChildren(this.props.currentLoadout.itemIndexPath); // unpack all descendants of the current item
      this.hideUnpackConfirmation(); // close the message
   }

   // show the unpack all confirmation
   showUnpackConfirmation() {
      this.setState({ isShowingUnpackConfirmation: true });
      // console.log("window.scrollHeight:", window.scrollHeight);
      // window.scrollTop = window.scrollHeight; // sets focus to the top of the page
   }

   // hide the unpack all confirmation
   hideUnpackConfirmation() {
      this.setState({ isShowingUnpackConfirmation: false }); // hide the unpack menu if it's open
   }

   // toggle the unpack all confirmation
   toggleUnpackRollout() {
      if (this.state.isShowingUnpackConfirmation) {
         this.hideUnpackConfirmation();
      } else if (!this.state.isShowingUnpackConfirmation) {
         this.showUnpackConfirmation();
      }
   }

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

   // toggle show packed items
   toggleShowPacked() {
      this.setState({ isShowingPacked: !this.state.isShowingPacked });
   }

   // toggle put packed on bottom
   togglePackedOnBottom() {
      this.setState({ isPackedOnBottom: !this.state.isPackedOnBottom });
   }

   // toggle mode from pack to edit
   toggleEditMode() {
      // this.setState({ isEditMode: !this.state.isEditMode });
      this.props.dispatch({
         type: actions.SET_EDIT_MODE,
         payload: !this.props.isEditMode,
      });
      this.hideUnpackConfirmation();
   }

   // adds a new item on the server, updates the page and focuses on the text of the new item
   addItemAndFocus(parentId) {
      // send request to server to add an item inside a parent
      axios
         .post("/api/v1/loadouts/insert?parentId=" + parentId)
         .then((res) => {
            // an item was added, get the response new item
            const newItem = res.data; // get the new item

            console.log({ newItem });
            const inputElementId = "edit-name-input-" + newItem.id;
            console.log({ inputElementId });

            // update currentLoadout in Redux
            this.props.currentLoadout.push(newItem);
            this.props.dispatch({
               type: actions.STORE_CURRENT_LOADOUT,
               payload: processLoadout(this.props.currentLoadout),
            });

            // sets focus to the new item card and selects it's text
            const input = document.getElementById(inputElementId);
            input.focus();
            input.select();
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });
   }

   // adds a new compartment on the server, updates the page and focuses on the text of the new compartment
   addCompartmentAndFocus(parentId) {
      // send request to server to add an compartment inside a parent
      axios
         .post("/api/v1/loadouts/insert-compartment?parentId=" + parentId)
         .then((res) => {
            // an compartment was added, get the response new compartment
            const newCompartment = res.data; // get the new compartment

            const inputElementId =
               "compartment-name-input-" + newCompartment.id;

            // update currentLoadout in Redux
            this.props.currentLoadout.push(newCompartment); // add the new compartment
            // if the server says it is the first compartment for the item, move the items children to it to match what happened on the server
            console.log("newCompartment", newCompartment);
            if (newCompartment.isFirstChildCompartment) {
               console.log("moving root children to first compartment");
               for (let i in this.props.currentLoadout) {
                  if (
                     this.props.currentLoadout[i].parentId === parentId &&
                     this.props.currentLoadout[i].status !== 4
                  ) {
                     console.log(
                        `   moving ${this.props.currentLoadout[i].name}`
                     );
                     this.props.currentLoadout[i].parentId = newCompartment.id;
                  }
               }
            }
            // push to Redux
            this.props.dispatch({
               type: actions.STORE_CURRENT_LOADOUT,
               payload: processLoadout(this.props.currentLoadout),
            });

            // sets focus to the new card and selects it's text
            const input = document.getElementById(inputElementId);
            input.focus();
            input.select();
         })
         .catch((error) => {
            // handle error
            console.log("axios error", error);
         });
   }

   // renames item on server and also in redux store
   renameThisItem(e, itemId) {
      console.log("the focus left this item");
      const currentItemName = this.props.currentLoadout.find((item) => {
         return item.id === itemId;
      }).name;
      console.log("currentItemName", currentItemName);
      if (e.target.value !== currentItemName) {
         console.log("the name was changed");
         console.log("will rename ", currentItemName, "to", e.target.value);

         // rename the item on client in currentLoadout
         // make local changes so we can see them immediately
         const foundItem = this.props.currentLoadout.find(
            (item) => item.id === itemId
         ); // find the specific item to change the name of
         console.log("foundItem.name", foundItem.name);
         foundItem.name = e.target.value; // rename the item to the new name
         // send update to Redux
         this.props.dispatch({
            type: actions.STORE_CURRENT_LOADOUT,
            payload: this.props.currentLoadout,
         });

         // if this is the currentUserLoadout, we need to change the name there too

         renameItem(itemId, e.target.value); // send the change of the name to the server
      } else {
         console.log("the name was not changed");
      }
   }

   // moves all the items listed in moveableItemIds here
   // all the testing is done on the server
   moveItems(destId) {
      const listOfItemIdsToMove = [...this.props.moveableItemIds]; // make a copy because we will be removing them from the store
      // clear the moveable items
      this.props.dispatch({
         type: actions.CLEAR_MOVEABLE_ITEM_IDS,
      });

      for (let i in listOfItemIdsToMove) {
         axios
            .put(
               "/api/v1/loadouts/move-item?itemId=" +
                  listOfItemIdsToMove[i] +
                  "&newParentId=" +
                  destId
            )
            .then((res) => {
               console.log("axios res", res);

               // update the parent on the client
               this.props.currentLoadout.find((item) => {
                  return item.id === listOfItemIdsToMove[i];
               }).parentId = destId;

               // send the updated loadout to Redux
               this.props.dispatch({
                  type: actions.STORE_CURRENT_LOADOUT,
                  payload: processLoadout(this.props.currentLoadout), // process the loadout because the levels and counters would have changed
               });
            })
            .catch((error) => {
               console.log("axios error", error);
            });
      }
   }

   renderCompartment(thisItem) {
      console.log("renderCompartment()...", thisItem);

      // set the rotating level colors
      const thisLevelRotated = (thisItem.level + LEVEL_COLORS) % LEVEL_COLORS;
      const parentLevelRotated =
         (thisItem.level + LEVEL_COLORS - 1) % LEVEL_COLORS;
      const childLevelRotated =
         (thisItem.level + LEVEL_COLORS + 1) % LEVEL_COLORS;

      // stores whether the current user can edit the name of the compartment item (if the level is 1 they must be an admin, otherwise they must have editing rights)
      const thisUserCanEdit =
         (thisItem.level === 1 &&
            this.props.currentUserLoadout.isAdmin === 1) ||
         (thisItem.level !== 1 && this.props.currentUserLoadout.canEdit === 1);

      // get this list of this item's direct children
      // this filters out compartments/groups
      const childItems = this.props.currentLoadout.filter((item) => {
         return item.parentId === thisItem.id && item.status !== 4;
      });

      // get the list of this item's compartments
      const childCompartments = this.props.currentLoadout.filter((item) => {
         return item.parentId === thisItem.id && item.status === 4;
      });

      // generate thew summary text that will be part of the move buttons here button
      let moveableItemsSummary = "";
      if (this.props.moveableItemIds.length === 1) {
         const singleItem = (moveableItemsSummary = this.props.currentLoadout.find(
            (item) => {
               return item.id === this.props.moveableItemIds[0];
            }
         ));
         if (singleItem !== undefined) {
            moveableItemsSummary = singleItem.name;
         } else {
            // the name is unavailable with this method because we are in a different loadout
            moveableItemsSummary = "Item";
         }
      } else if (this.props.moveableItemIds.length > 1) {
         moveableItemsSummary =
            this.props.moveableItemIds.length + " Picked Up Items";
      }

      // determine if this item has compartments or not
      const hasCompartments =
         this.props.currentLoadout.filter((item) => {
            return item.parentId === thisItem.id && item.status === 4;
         }).length > 0;
      console.log({ name: thisItem.name, hasCompartments });

      return (
         <div
            className={classnames(
               thisItem.level > 1 &&
                  `this-bg this-bg-level-${thisLevelRotated} item-card-border-${thisLevelRotated}`,
               thisItem.status !== 4 && "item-card-main-group",
               thisItem.status === 4 && "item-card-sub-group"
            )}
         >
            <div>
               {(!this.props.isEditMode || !thisUserCanEdit) && (
                  <div className="d-flex">
                     <span
                        className={classnames(
                           `flex-fill level-text-color-this level-text-color-${thisLevelRotated}`,
                           {
                              "page-item-title": thisItem.status !== 4,
                              "compartment-title": thisItem.status === 4,
                           }
                        )}
                     >
                        {thisItem.name}
                     </span>
                     {thisItem.level > 0 && (
                        <span
                           className={classnames(
                              `page-item-title level-text-color-child level-text-color-${childLevelRotated}`,
                              {
                                 "page-item-title": thisItem.status !== 4,
                                 "compartment-title": thisItem.status === 4,
                              }
                           )}
                        >
                           {thisItem.contentSummary}
                        </span>
                     )}
                  </div>
               )}
               {this.props.isEditMode && thisUserCanEdit && (
                  <div className="d-flex">
                     <span
                        className={`item-card-icon clickable item-icon-colors item-icon-colors-${thisLevelRotated}`}
                        // onClick={() => this.toggleDeleteRollout()} TODO: need to make a rollout
                        onClick={() =>
                           deleteItemId(this.props.currentLoadout, thisItem.id)
                        }
                     >
                        <DeleteIcon />
                     </span>
                     <span className="icon-button-gap"></span>
                     <span
                        className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${thisLevelRotated}`}
                        onClick={() => toggleMoveableItemId(thisItem.id)}
                        title="Pick up or put down"
                     >
                        {!this.props.moveableItemIds.includes(thisItem.id) && (
                           <PickUpItem />
                        )}
                        {this.props.moveableItemIds.includes(thisItem.id) && (
                           <PutDownItem />
                        )}
                     </span>
                     <span className="icon-button-gap"></span>
                     <input
                        className={classnames(
                           `flex-fill level-text-color-this level-text-color-${thisLevelRotated}`,
                           {
                              "page-item-input": thisItem.status !== 4,
                              "compartment-input": thisItem.status === 4,
                           }
                        )}
                        value={thisItem.name}
                        onBlur={(e) => this.renameThisItem(e, thisItem.id)}
                        maxLength={MAX_ITEM_NAME_LENGTH}
                        id={`compartment-name-input-${thisItem.id}`}
                     />
                     {thisItem.status !== 4 && (
                        <>
                           <span className="icon-button-gap"></span>

                           <span
                              className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${thisLevelRotated}`}
                              onClick={(e) => {
                                 this.addCompartmentAndFocus(thisItem.id);
                              }}
                              title={`Add compartment inside ${thisItem.name}`}
                           >
                              <AddIcon />
                           </span>
                        </>
                     )}
                     {!hasCompartments && (
                        <>
                           <span className="icon-button-gap"></span>
                           <span
                              className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${childLevelRotated}`}
                              onClick={(e) => {
                                 this.addItemAndFocus(thisItem.id);
                              }}
                              title={`Add item inside ${thisItem.name}`}
                           >
                              <AddIcon />
                           </span>
                        </>
                     )}
                     {this.props.moveableItemIds.length > 0 &&
                        !hasCompartments && (
                           <>
                              <span className="icon-button-gap"></span>
                              <span
                                 className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${childLevelRotated}`}
                                 onClick={(e) => {
                                    this.moveItems(thisItem.id);
                                 }}
                                 title={`Move ${moveableItemsSummary} To ${thisItem.name}`}
                              >
                                 <PutDownItem />
                              </span>
                              <span className="icon-button-gap"></span>
                              <span
                                 className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${childLevelRotated}`}
                                 onClick={() => {
                                    this.props.dispatch({
                                       type: actions.CLEAR_MOVEABLE_ITEM_IDS,
                                    });
                                 }}
                                 title="Cancel Move"
                              >
                                 <PickUpItem />
                              </span>
                           </>
                        )}
                  </div>
               )}
            </div>
            <div className="row">
               <div className="col">
                  {/* {this.renderContainingItems(thisItem)} */}
                  {!this.props.isEditMode &&
                     childItems.map((item) => (
                        <ItemCard item={item} key={item.id} />
                     ))}
                  {this.props.isEditMode && (
                     <>
                        {childItems.map((item) => (
                           <ItemCardEdit item={item} key={item.id} />
                        ))}
                        {/* {!hasCompartments && (
                           <div
                              className="button secondary-action-button d-flex item-card-inline-button"
                              onClick={(e) => {
                                 this.addItemAndFocus(thisItem.id);
                              }}
                           >
                              <span
                                 className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${childLevelRotated}`}
                              >
                                 <AddIcon />
                              </span>
                              <span className="flex-fill">
                                 Add item inside&nbsp;
                                 {thisItem.name}
                              </span>
                           </div>
                        )} */}
                        {/* {thisItem.status !== 4 && (
                           <div
                              className="button secondary-action-button d-flex"
                              onClick={(e) => {
                                 this.addCompartmentAndFocus(thisItem.id);
                              }}
                           >
                              <span
                                 className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${childLevelRotated}`}
                              >
                                 <AddIcon />
                              </span>
                              <span className="flex-fill">
                                 Add compartment inside&nbsp;
                                 {thisItem.name}
                              </span>
                           </div>
                        )} */}
                        {/* {this.props.moveableItemIds.length > 0 &&
                           !hasCompartments && (
                              <>
                                 <div
                                    className="button secondary-action-button d-flex"
                                    onClick={(e) => {
                                       this.moveItems(thisItem.id);
                                    }}
                                 >
                                    <span
                                       className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${childLevelRotated}`}
                                    >
                                       <PutDownItem />
                                    </span>
                                    <span className="flex-fill">
                                       Move&nbsp;{moveableItemsSummary}
                                       &nbsp;To&nbsp;
                                       {thisItem.name}
                                    </span>
                                 </div>

                                 <div
                                    className="button secondary-action-button d-flex"
                                    onClick={() => {
                                       this.props.dispatch({
                                          type: actions.CLEAR_MOVEABLE_ITEM_IDS,
                                       });
                                    }}
                                 >
                                    <span
                                       className={`item-card-icon clickable theme-icon-color item-icon-colors item-icon-colors-${childLevelRotated}`}
                                    >
                                       <PutDownItem />
                                    </span>
                                    <span className="flex-fill">
                                       Cancel Move
                                    </span>
                                 </div>
                              </>
                           )} */}
                     </>
                  )}
                  {childCompartments.map((compartment) =>
                     this.renderCompartment(compartment)
                  )}
               </div>
            </div>
            {!this.props.isEditMode &&
               thisItem.level !== 0 &&
               thisItem.status !== 4 && (
                  <>
                     <div className={classnames("card-section")}>
                        <span
                           className={classnames(
                              "button navigation-link w-100",
                              (thisItem.numResolvedDescendants === 0 ||
                                 this.props.currentUserLoadout.canPack === 0) &&
                                 "disabled"
                           )}
                           onClick={() =>
                              thisItem.numResolvedDescendants !== 0 &&
                              this.props.currentUserLoadout.canPack === 1 &&
                              this.toggleUnpackRollout()
                           }
                        >
                           Unpack {thisItem.name}
                           ...
                        </span>
                        {this.state.isShowingUnpackConfirmation &&
                           thisItem.numResolvedDescendants !== 0 &&
                           this.rolloutUnpackConfirmation(
                              `Unpack all ${thisItem.numDescendants} items and subitems inside ${thisItem.name}`
                           )}
                     </div>
                  </>
               )}
         </div>
      );
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

      return (
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
                  <div className="row">
                     <div className="col">
                        {pageItem.level === 1 && (
                           <div>
                              <span
                                 className="clickable"
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
                           </div>
                        )}

                        {pageItem.level > 0 && (
                           <div>
                              <span
                                 className="clickable"
                                 onClick={(e) => {
                                    this.props.currentUserLoadout.canEdit ===
                                       1 && this.toggleEditMode(e);
                                 }}
                              >
                                 <span
                                    className={`button theme-icon-color standard-sized-icon`}
                                 >
                                    <IconEdit />
                                 </span>
                                 &nbsp;
                                 <span className="button navigation-link">
                                    {this.props.isEditMode && <>Done Editing</>}
                                    {!this.props.isEditMode && (
                                       <>Edit Loadout</>
                                    )}
                                 </span>
                              </span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="row">
                     <div className="col">
                        <div>
                           <span className={classnames(`up-level clickable`)}>
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
                                          ).value = pageItem.upLevelName;
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
                        {this.renderCompartment(pageItem)}
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
      currentItem: state.currentItem,
      currentUser: state.currentUser,
      currentUserLoadout: state.currentUserLoadout,
      isEditMode: state.isEditMode,
      currentLoadout: state.currentLoadout,
      moveableItemIds: state.moveableItemIds,
   };
}

export default connect(mapStateToProps)(ItemList); // this is "currying"
