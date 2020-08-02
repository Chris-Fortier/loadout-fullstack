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
import { renameItem, processLoadout } from "../../utils/items";
import isEmpty from "lodash/isEmpty";
import SharingStrip from "../ui/SharingStrip";
import axios from "axios";

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

      // https://stackoverflow.com/questions/53441584/how-to-re-render-parent-component-when-anything-changes-in-child-component/53441679#:~:text=To%20rerender%20the%20parent%20you,forceUpdate()%20function.
      this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
   }

   // methods happen here, such as what happens when you click on a button

   rerenderParentCallback() {
      this.forceUpdate();
   }

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
               currentLoadout[c].status = 0; // unpack it
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
   addItemAndFocus() {
      // send request to server to add an item inside a parent
      axios
         .post("/api/v1/loadouts/insert?parentId=" + this.props.currentItem.id)
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

   // renames item on server and also in redux store
   renameThisItem(e) {
      console.log("the focus left this item");
      const currentItemName = this.props.currentLoadout.find((item) => {
         return item.id === this.props.currentItem.id;
      }).name;
      console.log("currentItemName", currentItemName);
      if (e.target.value !== currentItemName) {
         console.log("the name was changed");
         console.log(
            "will rename ",
            this.props.currentItem.name,
            "to",
            e.target.value
         );

         // rename the item on client in currentLoadout
         // make local changes so we can see them immediately
         const foundItem = this.props.currentLoadout.find(
            (item) => item.id === this.props.currentItem.id
         ); // find the specific item to change the name of
         console.log("foundItem.name", foundItem.name);
         foundItem.name = e.target.value; // rename the item to the new name
         // send update to Redux
         this.props.dispatch({
            type: actions.STORE_CURRENT_LOADOUT,
            payload: this.props.currentLoadout,
         });

         // if this is the currentUserLoadout, we need to change the name there too

         renameItem(this.props.currentItem.id, e.target.value); // send the change of the name to the server
      } else {
         console.log("the name was not changed");
      }
   }

   // moves all the items listed in moveableItemIds here
   moveItemsHere() {
      // TODO: prevent moving an item inside itself or own descendants, otherwise you will generate impossible loops
      const badNewParents = []; // start a list of parents that the items cannot be moved to
      console.log("badNewParents", badNewParents);

      console.log("this.props.currentLoadout", this.props.currentLoadout);

      const currentLoadout = this.props.currentLoadout; // required in order to access this.props.currentLoadout in the local function

      // add all child ids of an item to badNewParents, then continue with its grandchildren
      function addChildIdsToBadNewParents(parentId) {
         // find each child
         for (let c in currentLoadout) {
            if (currentLoadout[c].parentId === parentId) {
               badNewParents.push(currentLoadout[c].id);
               console.log("badNewParents", badNewParents);
               addChildIdsToBadNewParents(currentLoadout[c].id); // continue with its grandchildren
            }
         }
      }

      // add all child ids of an item to badNewParents, starting with all the items currently in the list
      for (let i in this.props.moveableItemIds) {
         badNewParents.push(this.props.moveableItemIds[i]); // add this item's id to the list
         console.log("badNewParents", badNewParents);
         addChildIdsToBadNewParents(
            // this.props.currentLoadout.find((item) => {
            //    return item.id === this.props.moveableItemIds[i].id;
            // })
            this.props.moveableItemIds[i]
         ); // add its children and descendants
      }

      console.log("badNewParents", badNewParents);

      // if the target new parent is in the list of bad parents, you cannot move the items here
      if (badNewParents.includes(this.props.currentItem.id)) {
         console.log(
            "You cannot move an item inside itself or its own descendants."
         );
      } else {
         // you can move them here

         const newLoadout = this.props.currentLoadout.map((item) => {
            const newItem = { ...item };
            // if this item is in the list of moveable items
            if (this.props.moveableItemIds.includes(item.id)) {
               newItem.parentId = this.props.currentItem.id; // assign the new parent
            }
            return newItem;
         });

         // send the new loadout to Redux
         this.props.dispatch({
            type: actions.STORE_CURRENT_LOADOUT,
            payload: processLoadout(newLoadout), // process the loadout because the levels and counters would have changed
         });

         // clear the moveable items
         this.props.dispatch({
            type: actions.CLEAR_MOVEABLE_ITEM_IDS,
         });
      }
   }

   render() {
      console.log("Rendering page...");

      // get this list of this item's children
      const childItems = this.props.currentLoadout.filter((item) => {
         return item.parentId === this.props.currentItem.id;
      });
      console.log("childItems", childItems);

      // get the current item object from the current loadout
      let currentItem = {};
      // console.log("this.props.currentItem.id", this.props.currentItem.id);
      // console.log("this.props.currentLoadout", this.props.currentLoadout);

      // default level before data is loaded so we won't briefly see a white background
      let level = 1;
      let thisLevelRotated = 1;
      let parentLevelRotated = 0;
      let childLevelRotated = 2;

      if (this.props.currentLoadout.length > 0) {
         currentItem = this.props.currentLoadout.filter((item) => {
            // console.log(item.id, this.props.currentItem.id);
            return item.id === this.props.currentItem.id;
         })[0];
         level = currentItem.level; // set level to this to use the new level generated in processLoadout
         thisLevelRotated = (level + LEVEL_COLORS) % LEVEL_COLORS;
         parentLevelRotated = (level + LEVEL_COLORS - 1) % LEVEL_COLORS;
         childLevelRotated = (level + LEVEL_COLORS + 1) % LEVEL_COLORS;
      }

      // get the current item
      // const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath
      // console.log("currentItem.level", currentItem.level);
      // let level = currentItem.level;
      // const level = this.props.currentLevel;

      // stores whether the current user can edit the name of the current item (if the level is 1 they must be an admin, otherwise they must have editing rights)
      const thisUserCanEdit =
         (level === 1 && this.props.currentUserLoadout.isAdmin === 1) ||
         (level !== 1 && this.props.currentUserLoadout.canEdit === 1);

      return (
         <div className={`ui-theme-${this.props.currentUser.uiTheme}`}>
            <Header />
            <div
               className={classnames(
                  "item-list parent-bg",
                  level < 2 && `parent-bg-level-${thisLevelRotated}`,
                  level >= 2 && ` parent-bg-level-${parentLevelRotated}`
               )}
            >
               <div className="container-fluid item-cards-container scroll-fix">
                  <div className="row">
                     <div className="col">
                        <div>
                           <span className={classnames(`up-level clickable`)}>
                              {currentItem.parentId !== null && (
                                 <span
                                    onClick={(e) => {
                                       // move to the parent item
                                       movePageToDifferentItem(
                                          currentItem.parentId,
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
                                          ).value = currentItem.parentName;
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
                                       {currentItem.parentName}
                                    </span>
                                 </span>
                              )}
                              {currentItem.parentId === null && (
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
                        <div
                           className={classnames(
                              "mb-8",
                              level > 1 &&
                                 `card super-item-card this-bg this-bg-level-${thisLevelRotated}`
                           )}
                        >
                           <div
                              className={classnames(level > 1 && "card-header")}
                           >
                              <div className="row">
                                 {(!this.props.isEditMode ||
                                    !thisUserCanEdit) && (
                                    <>
                                       <div className="col">
                                          <h4
                                             className={`level-text-color-this level-text-color-${thisLevelRotated}`}
                                          >
                                             {currentItem.name}
                                          </h4>
                                       </div>
                                       {level > 0 && (
                                          <div className="col">
                                             <h4
                                                className={`float-right level-text-color-child level-text-color-${childLevelRotated}`}
                                             >
                                                {currentItem.contentSummary}
                                             </h4>
                                          </div>
                                       )}
                                    </>
                                 )}
                                 {this.props.isEditMode && thisUserCanEdit && (
                                    <div className="col">
                                       <span className="flex-fill">
                                          <h4>
                                             <input
                                                className={`edit-name level-text-color-this level-text-color-${thisLevelRotated}`}
                                                defaultValue={currentItem.name}
                                                onBlur={(e) =>
                                                   this.renameThisItem(e)
                                                }
                                                maxLength={MAX_ITEM_NAME_LENGTH}
                                                id="page-item-name-input"
                                             />
                                          </h4>
                                       </span>
                                    </div>
                                 )}
                              </div>

                              <div className="row">
                                 <div className="col">
                                    {level === 1 && (
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
                                                loadout={
                                                   this.props.currentUserLoadout
                                                }
                                             />
                                          </span>
                                       </div>
                                    )}

                                    {level > 0 && (
                                       <div>
                                          <span
                                             className="clickable"
                                             onClick={(e) => {
                                                this.props.currentUserLoadout
                                                   .canEdit === 1 &&
                                                   this.toggleEditMode(e);
                                             }}
                                          >
                                             <span
                                                className={`button theme-icon-color standard-sized-icon`}
                                             >
                                                <IconEdit />
                                             </span>
                                             &nbsp;
                                             <span className="button navigation-link">
                                                {this.props.isEditMode && (
                                                   <>Done Editing</>
                                                )}
                                                {!this.props.isEditMode && (
                                                   <>Edit Loadout</>
                                                )}
                                             </span>
                                          </span>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div
                              className={classnames(level > 1 && "card-body")}
                           >
                              <div className="row">
                                 <div className="col">
                                    {/* {this.renderContainingItems(currentItem)} */}
                                    {!this.props.isEditMode &&
                                       childItems.map((item) => (
                                          <ItemCard
                                             item={item}
                                             key={item.id}
                                             rerenderParentCallback={
                                                this.rerenderParentCallback
                                             }
                                          />
                                       ))}
                                    {this.props.isEditMode &&
                                       childItems.map((item) => (
                                          <ItemCardEdit
                                             item={item}
                                             key={item.id}
                                          />
                                       ))}
                                 </div>
                              </div>
                              {!this.props.isEditMode && level !== 0 && (
                                 <>
                                    <div className={classnames("card-section")}>
                                       <span
                                          className={classnames(
                                             "button navigation-link w-100",
                                             (currentItem.numResolvedDescendants ===
                                                0 ||
                                                this.props.currentUserLoadout
                                                   .canPack === 0) &&
                                                "disabled"
                                          )}
                                          onClick={() =>
                                             currentItem.numResolvedDescendants !==
                                                0 &&
                                             this.props.currentUserLoadout
                                                .canPack === 1 &&
                                             this.toggleUnpackRollout()
                                          }
                                       >
                                          Unpack {currentItem.name}
                                          ...
                                       </span>
                                       {this.state
                                          .isShowingUnpackConfirmation &&
                                          currentItem.numResolvedDescendants !==
                                             0 &&
                                          this.rolloutUnpackConfirmation(
                                             `Unpack all ${currentItem.numDescendants} items and subitems inside ${currentItem.name}`
                                          )}
                                    </div>
                                 </>
                              )}
                              {this.props.isEditMode && (
                                 <>
                                    <div
                                       className="button secondary-action-button"
                                       onClick={(e) => {
                                          this.addItemAndFocus();
                                       }}
                                    >
                                       Add item inside&nbsp;
                                       {currentItem.name}
                                    </div>

                                    {this.props.moveableItemIds.length > 0 && (
                                       <>
                                          <div
                                             className="button secondary-action-button"
                                             onClick={(e) => {
                                                this.moveItemsHere();
                                             }}
                                          >
                                             Move&nbsp;
                                             {this.props.moveableItemIds.length}
                                             &nbsp;Picked Up Items To&nbsp;
                                             {currentItem.name}
                                          </div>
                                          <div
                                             className="button secondary-action-button"
                                             onClick={() => {
                                                this.props.dispatch({
                                                   type:
                                                      actions.CLEAR_MOVEABLE_ITEM_IDS,
                                                });
                                             }}
                                          >
                                             Cancel Move
                                          </div>
                                       </>
                                    )}
                                 </>
                              )}
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
      currentItem: state.currentItem,
      currentUser: state.currentUser,
      currentUserLoadout: state.currentUserLoadout,
      isEditMode: state.isEditMode,
      currentLoadout: state.currentLoadout,
      moveableItemIds: state.moveableItemIds,
   };
}

export default connect(mapStateToProps)(ItemList); // this is "currying"
