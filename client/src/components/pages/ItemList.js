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
import {
   renameItem,
   //addItemTo,
   processLoadout,
} from "../../utils/items";
// import { v4 as getUuid } from "uuid";
import isEmpty from "lodash/isEmpty";
import SharingStrip from "../ui/SharingStrip";
import axios from "axios";

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
         .post(
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
         // its that all I have to do is this, directly edit the name in props, no need to dispatch it
         this.props.currentItem.name = e.target.value; // rename the child to the new name

         // TODO: update current loadout
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

      // get this list of this item's children
      const childItems = this.props.currentLoadout.filter((item) => {
         return item.parentId === this.props.currentItem.id;
      });
      console.log("childItems", childItems);

      // get the current item object from the current loadout
      let currentItem = {};
      // console.log("this.props.currentItem.id", this.props.currentItem.id);
      // console.log("this.props.currentLoadout", this.props.currentLoadout);
      if (this.props.currentLoadout.length > 0) {
         currentItem = this.props.currentLoadout.filter((item) => {
            // console.log(item.id, this.props.currentItem.id);
            return item.id === this.props.currentItem.id;
         })[0];
      }
      // console.log("currentItem", currentItem);

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
                                       Back to&nbsp;
                                       {currentItem.parentName}
                                    </span>
                                 )}
                                 {currentItem.parentId === null && (
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
                                       Back to My Loadouts
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
                              "mb-8",
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
                                             {currentItem.name}
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
                                                className="edit-name"
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
                                                className={classnames(
                                                   "button",
                                                   UI_APPEARANCE === "dark" &&
                                                      "icon-light light-text-color",
                                                   UI_APPEARANCE !== "dark" &&
                                                      "icon-dark dark-text-color"
                                                )}
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
                                                className={classnames(
                                                   "button",
                                                   UI_APPEARANCE === "dark" &&
                                                      "icon-light light-text-color",
                                                   UI_APPEARANCE !== "dark" &&
                                                      "icon-dark dark-text-color"
                                                )}
                                             >
                                                <IconEdit />
                                             </span>
                                             &nbsp;
                                             {this.props.isEditMode && (
                                                <>Done Editing</>
                                             )}
                                             {!this.props.isEditMode && (
                                                <>Edit Loadout</>
                                             )}
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
                                             UI_APPEARANCE === "dark" &&
                                                "light-text-color",
                                             UI_APPEARANCE !== "dark" &&
                                                "dark-text-color",
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
                                       className="button secondary-action-button narrow-button"
                                       onClick={(e) => {
                                          this.addItemAndFocus();
                                       }}
                                    >
                                       Add item inside&nbsp;
                                       {currentItem.name}
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
      currentLevel: state.currentLevel,
      currentUser: state.currentUser,
      currentUserLoadout: state.currentUserLoadout,
      isEditMode: state.isEditMode,
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(ItemList2); // this is "currying"
