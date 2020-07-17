import React from "react";
import Header from "../ui/Header";
import { IconEdit, IconUpLevel, IconUserCouple } from "../../icons/icons.js";
import {
   MAX_ITEM_NAME_LENGTH,
   LEVEL_COLORS,
   UI_APPEARANCE,
} from "../../utils/helpers";
import classnames from "classnames";
import { connect } from "react-redux";
import actions from "../../store/actions";
import ItemCard from "../ui/ItemCard";
import ItemCardEdit from "../ui/ItemCardEdit";
import { Link } from "react-router-dom"; // a React element for linking
import { processAllItems } from "../../utils/processItems";
import { movePageToDifferentItem } from "../../utils/movePageToDifferentItem";
import { renameItem, addItemTo, setDescendantsStatus } from "../../utils/items";
import { v4 as getUuid } from "uuid";
import isEmpty from "lodash/isEmpty";
import SharingStrip from "../ui/SharingStrip";

// ItemList2 is an alternate version that queries a single item's children to display from the database

class ItemList2 extends React.Component {
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
   rolloutUnpackConfirmation() {
      // const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath
      const currentItem = this.props.currentItem; // to simplify code below

      const unpackDescendantsText =
         "Unpack all items and subitems inside " + currentItem.name;

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
               className={classnames(
                  "button navigation-link",
                  UI_APPEARANCE === "dark" && "light-text-color",
                  UI_APPEARANCE !== "dark" && "dark-text-color"
               )}
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
      // update the database
      setDescendantsStatus(this.props.currentItem.id, 0); // 0 is unpacked status

      // update the data in props (this is what makes the change appear in the ui)
      // i needed to push completely new objects otherwise the redux state is unaware that the data changed
      // const newChildItems = [];
      // for (let c in this.props.childItems) {
      //    newChildItems.push({ ...this.props.childItems[c] });
      //    newChildItems[c].status = 0;
      //    console.log(newChildItems[c].status);
      // }
      // console.log("newChildItems", newChildItems);

      for (let c in this.props.childItems) {
         this.props.childItems[c].status = 0; // set each child item's status to 0 in the client
         console.log(this.props.childItems[c].status);
      }

      // now update the Redux store
      this.props.dispatch({
         type: actions.STORE_CHILD_ITEMS,
         payload: this.props.childItems,
      });

      this.hideUnpackConfirmation(); // close the message

      // refreshPage(this.props.currentItem.id); // still needed to update the sub counters (TODO do this on client side)
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

   // return the current item from state based on an itemIndexPath
   getItemFromStore() {
      const itemIndexPath = this.props.currentLoadout.itemIndexPath;
      console.log("getItemFromStore()...");
      console.log("itemIndexPath", itemIndexPath);
      let currentItem = this.props.currentLoadout.gear; // start at the top of the heirarchy

      // for each part of the itemIndexPath
      for (let levelIndex in itemIndexPath) {
         currentItem = currentItem.items[parseInt(itemIndexPath[levelIndex])];
      }

      currentItem.level = itemIndexPath.length; // put the level of the current item in the current item

      return currentItem;
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

   // open the loadout sharing settings (made this a function to avoid styling assosicated with Link)
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
   async addItemAndFocus() {
      const newItemId = getUuid(); // get the uuid client side that way it is easier to reference the id of the input element
      const otherId = await addItemTo(this.props.currentItem.id, newItemId); // add an item as a child of the current item
      console.log({ otherId });
      // refreshPage(this.props.currentItem.parentId); // refresh the page AFTER we generate the new item and before we set the focus on the new element
      const inputElementId = "edit-name-input-" + newItemId;
      console.log({ inputElementId });

      // add a new card for the new item without refreshing page
      // const newChildItems = [
      //    ...this.props.childItems,
      //    {
      //       name: "New Item",
      //       id: newItemId,
      //       status: 0,
      //       parentId: this.props.currentItem.id,
      //       numChildren: 0,
      //       numPackedChildren: 0,
      //       numUnpackedChildren: 0,
      //       contentSummary: "ready",
      //    },
      // ];

      // update the client side with an equivalent new item
      this.props.childItems.push({
         name: "Untitled Item",
         id: newItemId,
         status: 0,
         parentId: this.props.currentItem.id,
         numChildren: 0,
         numPackedChildren: 0,
         numUnpackedChildren: 0,
         contentSummary: "ready",
      });

      this.props.dispatch({
         type: actions.STORE_CHILD_ITEMS,
         payload: this.props.childItems,
      });

      // sets focus to the new item card and selects it's text
      const input = document.getElementById(inputElementId);
      input.focus();
      input.select();
   }

   // renames item on server and also in redux store
   renameThisItem(e) {
      console.log("the focus left this item");
      if (e.target.value !== this.props.currentItem.name) {
         console.log("the name was changed");
         console.log(
            "will rename ",
            this.props.currentItem.name,
            "to",
            e.target.value
         );
         renameItem(this.props.currentItem.id, e.target.value); // send the change of the name to the server

         // make local changes so we can see them immediately
         // its that all I have to do is this, direclty edit the name in props, no need to dispatch it
         this.props.currentItem.name = e.target.value; // rename the child to the new name

         // send the updated item to the store, even without this I see the changes with the code above
         this.props.dispatch({
            type: actions.STORE_CURRENT_ITEM,
            payload: this.props.currentItem,
         });
      } else {
         console.log("the name was not changed");
      }
   }

   // this unpacks all a given item's children
   unpackChildren(itemIndexPath) {
      console.log("unpackChildren()...");
      console.log("itemIndexPath", itemIndexPath);
      // console.log("Unpacking the children of " + item.name);
      // the item parameter is the item that we are unpacking all the children of
      // console.log("unpacking", item.name);
      // for (let i in item.items) {
      //    item.items[i].isPacked = false;
      // }
      // this.setState({ currentItem: item });

      // get the actual item I want to change based on the index path
      let copyOfGear = this.props.currentLoadout.gear;
      let currentItem = copyOfGear;
      for (let i in itemIndexPath) {
         currentItem = currentItem.items[itemIndexPath[i]]; // go one lever deeper for each index in itemIndexPath
      }
      console.log("name of target item:", currentItem.name);

      // copyOfGear.items[0].items[1].isPacked = !copyOfGear.items[0].items[1]
      //    .isPacked;
      for (let childIndex in currentItem.items) {
         currentItem.items[childIndex].isPacked = false;
      }

      // put the data back into the store
      // this.props.dispatch({
      //    type: actions.STORE_CURRENT_LOADOUT,
      //    payload: copyOfGear,
      // });

      processAllItems(this.props.currentLoadout.gear);
   }

   render() {
      console.log("Rendering page...");

      // get the current item
      // const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath
      // console.log("currentItem.level", currentItem.level);
      // let level = currentItem.level;
      const level = this.props.currentLevel;

      // stores whether the current user can edit the name of the current item (if the level is 1 they must be an admin, otherwise they must have editing rights)
      const thisUserCanEdit =
         (level === 1 && this.props.currentUserLoadout.isAdmin === 1) ||
         (level !== 1 && this.props.currentUserLoadout.canEdit === 1);

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
                        <div>
                           {level !== 0 && (
                              <span
                                 className={classnames(
                                    "up-level button navigation-link",
                                    (UI_APPEARANCE === "light" ||
                                       UI_APPEARANCE === "dark") &&
                                       "level-text-color-" +
                                          String(
                                             (level + LEVEL_COLORS - 1) %
                                                LEVEL_COLORS
                                          ),
                                    UI_APPEARANCE === "colors" &&
                                       "light-text-color"
                                 )}
                              >
                                 {this.props.currentItem.parentId !== null && (
                                    <span
                                       onClick={(e) => {
                                          // move to the parent item
                                          movePageToDifferentItem(
                                             this.props.currentItem.parentId,
                                             -1
                                          );
                                          // change the text in the page item editable input
                                          document.getElementById(
                                             "page-item-name-input"
                                          ).value = this.props.currentItem.parentName;
                                       }}
                                    >
                                       <div
                                          className={classnames(
                                             "left",
                                             UI_APPEARANCE !== "light" &&
                                                "icon-light",
                                             UI_APPEARANCE === "light" &&
                                                "icon-dark"
                                          )}
                                       >
                                          <IconUpLevel />
                                       </div>
                                       Back to{" "}
                                       {this.props.currentItem.parentName}
                                    </span>
                                 )}
                                 {this.props.currentItem.parentId === null && (
                                    <Link to="/loadout-list">
                                       <div
                                          className={classnames(
                                             "left",
                                             UI_APPEARANCE !== "light" &&
                                                "icon-light",
                                             UI_APPEARANCE === "light" &&
                                                "icon-dark"
                                          )}
                                       >
                                          <IconUpLevel />
                                       </div>
                                       Back to Loadouts
                                    </Link>
                                 )}
                              </span>
                           )}
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
                              level > 1 && "card super-item-card",
                              level > 1 &&
                                 UI_APPEARANCE === "light" &&
                                 "this-bg-light",
                              level > 1 &&
                                 UI_APPEARANCE === "dark" &&
                                 "this-bg-dark",
                              level > 1 &&
                                 UI_APPEARANCE === "colors" &&
                                 "level-color-" + String(level % LEVEL_COLORS)
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
                                             className={classnames(
                                                (UI_APPEARANCE === "light" ||
                                                   UI_APPEARANCE === "dark") &&
                                                   "level-text-color-" +
                                                      String(
                                                         level % LEVEL_COLORS
                                                      ),
                                                UI_APPEARANCE === "colors" &&
                                                   "dark-text-color"
                                             )}
                                          >
                                             {this.props.currentItem.name}
                                          </h4>
                                       </div>
                                       {level > 0 && (
                                          <div className="col">
                                             <h4
                                                className={classnames(
                                                   "float-right",
                                                   (UI_APPEARANCE === "light" ||
                                                      UI_APPEARANCE ===
                                                         "dark") &&
                                                      "level-text-color-" +
                                                         String(
                                                            (level + 1) %
                                                               LEVEL_COLORS
                                                         ),
                                                   UI_APPEARANCE === "colors" &&
                                                      "light-text-color"
                                                )}
                                             >
                                                {
                                                   this.props.currentItem
                                                      .contentSummary
                                                }
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
                                                className="edit-name"
                                                defaultValue={
                                                   this.props.currentItem.name
                                                }
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
                                       <div
                                          className={classnames(
                                             "d-flex button navigation-link d-block",
                                             UI_APPEARANCE === "dark" &&
                                                "light-text-color",
                                             UI_APPEARANCE !== "dark" &&
                                                "dark-text-color"
                                          )}
                                          // to="/loadout-sharing"
                                          onClick={(e) => {
                                             this.gotoSharing(e);
                                          }}
                                       >
                                          <div
                                             className={classnames(
                                                "left",
                                                UI_APPEARANCE === "dark" &&
                                                   "icon-light",
                                                UI_APPEARANCE !== "dark" &&
                                                   "icon-dark"
                                             )}
                                          >
                                             <IconUserCouple />
                                          </div>
                                          Loadout Settings&nbsp;&nbsp;
                                          <SharingStrip
                                             loadout={
                                                this.props.currentUserLoadout
                                             }
                                          />
                                       </div>
                                    )}

                                    {level > 0 && (
                                       <div
                                          className={classnames(
                                             "button navigation-link d-block",
                                             UI_APPEARANCE === "dark" &&
                                                "light-text-color",
                                             UI_APPEARANCE !== "dark" &&
                                                "dark-text-color",
                                             this.props.currentUserLoadout
                                                .canEdit === 0 && "disabled"
                                          )}
                                          onClick={(e) => {
                                             this.props.currentUserLoadout
                                                .canEdit === 1 &&
                                                this.toggleEditMode(e);
                                          }}
                                       >
                                          <div
                                             className={classnames(
                                                "left",
                                                UI_APPEARANCE === "dark" &&
                                                   "icon-light",
                                                UI_APPEARANCE !== "dark" &&
                                                   "icon-dark"
                                             )}
                                          >
                                             <IconEdit />
                                          </div>
                                          {this.props.isEditMode && (
                                             <>Done Editing</>
                                          )}
                                          {!this.props.isEditMode && (
                                             <>Edit Loadout</>
                                          )}
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
                                       this.props.childItems.map((item) => (
                                          <ItemCard
                                             item={item}
                                             key={item.id}
                                             rerenderParentCallback={
                                                this.rerenderParentCallback
                                             }
                                          />
                                       ))}
                                    {this.props.isEditMode &&
                                       this.props.childItems.map((item) => (
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
                                             UI_APPEARANCE === "dark" &&
                                                "light-text-color",
                                             UI_APPEARANCE !== "dark" &&
                                                "dark-text-color",
                                             (this.props.currentItem
                                                .numPackedChildren === 0 ||
                                                this.props.currentUserLoadout
                                                   .canPack === 0) &&
                                                "disabled"
                                          )}
                                          onClick={() =>
                                             this.props.currentItem
                                                .numPackedChildren !== 0 &&
                                             this.props.currentUserLoadout
                                                .canPack === 1 &&
                                             this.toggleUnpackRollout()
                                          }
                                       >
                                          Unpack {this.props.currentItem.name}
                                          ...
                                       </span>
                                       {this.state
                                          .isShowingUnpackConfirmation &&
                                          this.rolloutUnpackConfirmation()}
                                    </div>
                                 </>
                              )}
                              {this.props.isEditMode && (
                                 <>
                                    <div
                                       className="button secondary-action-button narrow-button"
                                       onClick={(e) => {
                                          this.addItemAndFocus();
                                       }}
                                    >
                                       Add item inside&nbsp;
                                       {this.props.currentItem.name}
                                    </div>
                                    {/* <div
                                       className="button primary-action-button"
                                       onClick={(e) => {
                                          addContainerTo(
                                             this.props.currentLoadout.gear,
                                             this.props.currentLoadout
                                                .itemIndexPath
                                          );
                                       }}
                                    >
                                       Add Container
                                    </div> */}
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
      childItems: state.childItems,
      currentLevel: state.currentLevel,
      currentUser: state.currentUser,
      currentUserLoadout: state.currentUserLoadout,
      isEditMode: state.isEditMode,
   };
}

export default connect(mapStateToProps)(ItemList2); // this is "currying"
