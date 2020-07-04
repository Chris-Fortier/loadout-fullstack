import React from "react";
import Header from "../ui/Header";
import orderBy from "lodash/orderBy";
import {
   IconEdit,
   // IconCog,
   // IconAddCircle,
   // IconArrowThickUpCircle,
   // IconArrowThickDownCircle,
   // IconArchive,
   IconArrowThinLeftCircle,
   // IconArrowThinRightCircle,
   // IconTrash,
   // IconChevronDown,
   // IconChevronUp,
   IconUserCouple,
} from "../../icons/icons.js";
import {
   // MOVE_UPDOWN,
   MAX_ITEM_NAME_LENGTH,
   LEVEL_COLORS,
   // SUBITEM_DISPLAY_MODE,
   UI_APPEARANCE,
} from "../../utils/helpers";
import classnames from "classnames";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import ItemCard from "../ui/ItemCard";
import ItemCardEdit from "../ui/ItemCardEdit";
// import { Link } from "react-router-dom"; // a React element for linking
import { processAllItems } from "../../utils/processItems";
import movePageToDifferentItem from "../../utils/movePageToDifferentItem";
import {
   // getItemFromPath,
   // getParentItemFromPath,
   renameItem,
   addItemTo,
   addContainerTo,
} from "../../utils/items";

class ItemList extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      console.log("props.currentLoadout", props.currentLoadout);

      if (props.currentLoadout.gear.length === 0) {
         axios
            .get(
               "https://raw.githubusercontent.com/Chris-Fortier/loadout/master/src/mock-data/loadouts.json"
            )
            // .get(
            //    "http://localhost:3060/api/v1/user-loadouts/?userId=84fbbb78-b2a2-11ea-b3de-0242ac130004"
            // )
            .then((res) => {
               // handle success
               // res is shorthand for response
               console.log(res);
               // props.dispatch({
               //    type: actions.STORE_CURRENT_LOADOUT,
               //    payload: res.data,
               // }); // dispatching an action
               processAllItems(res.data); // initial processing of items that creates derived properties
               // res.data is the data from the response
            })
            .catch((error) => {
               // handle error
               console.log(error);
            });
      }

      // set default state values

      this.state = {
         isShowingPacked: true,
         isPackedOnBottom: false,
         isEditMode: false,
         isShowingUnpackConfirmation: false,
      };
   }

   // methods happen here, such as what happens when you click on a button

   // roll out a dialog for unpacking an item's contents
   rolloutUnpackConfirmation() {
      const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath

      let itemsText = "";
      if (currentItem.numPackedChildren > 1) {
         itemsText = currentItem.numPackedChildren + " items";
      } else if (currentItem.numPackedChildren === 1) {
         itemsText = "1 item";
      }

      const numSubItems =
         currentItem.numPackedDescendants - currentItem.numPackedChildren;

      let subItemsText = "";
      if (numSubItems > 1) {
         subItemsText = numSubItems + " subitems";
      } else if (numSubItems === 1) {
         subItemsText = "1 subitem";
      }

      // set up the text of the unpack children button if there are packed children
      let unpackChildrenText = "";
      if (itemsText !== "") {
         unpackChildrenText = "unpack " + itemsText;
      }

      // set up the text of the unpack descendants button if there are packed descendants
      let unpackDescendantsText = "";
      if (itemsText !== "" && subItemsText !== "") {
         unpackDescendantsText = "unpack " + itemsText + " and " + subItemsText;
      } else if (subItemsText !== "") {
         unpackDescendantsText = "unpack " + subItemsText;
      }

      return (
         <div>
            {unpackChildrenText !== "" && (
               <div
                  className="button primary-action-button"
                  onClick={(e) => {
                     this.confirmUnpackChildren();
                  }}
               >
                  {unpackChildrenText}
               </div>
            )}

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
               Cancel
            </div>
         </div>
      );
   }

   confirmUnpackDescendants() {
      this.unpackDescendants(this.props.currentLoadout.itemIndexPath); // unpack all descendants of the current item

      // put the data back into the store
      // this.props.dispatch({
      //    type: actions.STORE_CURRENT_LOADOUT,
      //    payload: this.props.currentLoadout.gear,
      // });

      processAllItems(this.props.currentLoadout.gear);

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
      this.setState({ isEditMode: !this.state.isEditMode });
      this.hideUnpackConfirmation();
   }

   // this unpacks all a given item's children and all their descendants
   unpackDescendants(itemIndexPath) {
      console.log("unpackDescendants()...");
      // console.log("unpacking", item.name);
      // for (let i in item.items) {
      //    item.items[i].isPacked = false;
      //    if (item.items[i].hasOwnProperty("items")) {
      //       // unpack all this item's items and so on
      //       this.unpackDescendants(item.items[i]);
      //    }
      // }
      // this.setState({ currentItem: item });

      console.log("itemIndexPath", itemIndexPath);

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
         if (currentItem.items[childIndex].hasOwnProperty("items")) {
            // unpack all this item's items and so on
            // console.log("childIndex:", childIndex);
            // console.log("itemIndexPath:", itemIndexPath);
            // const newItemIndexPath = itemIndexPath.push(childIndex);
            // console.log("newItemIndexPath:", newItemIndexPath);
            this.unpackDescendants([...itemIndexPath, childIndex]);
         }
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

   // // sets the name of the current item (the item which the entire page is currently the focus of)
   // setCurrentItemName(e) {
   //    const currentItem = this.getItemFromStore();
   //    console.log("rename " + currentItem.name + " to " + e.target.value);
   //    // let itemDataCopy = this.state.currentItem; // copy itemsData from state to local
   //    // itemDataCopy.name = e.target.value; // change the desired item's name to match input
   //    // this.setState({ currentItem: itemDataCopy }); // makes it update the input that the user can see
   // }

   renderContainingItems(parentItem) {
      const items = parentItem.items; // to simplify code below

      console.log("Rendering containing items of", parentItem.name);

      let displayedItems = items; // initialize a new list for displayed items

      displayedItems = orderBy(displayedItems, "name", "asc"); // sort the items by name
      // displayedItems = items;

      // order by which items have the most unpacked subitems
      // displayedItems = orderBy(displayedItems, "numUnpackedDescendants", "asc");

      // sort the items by packed status if desired, with packed items on bottom
      if (this.state.isPackedOnBottom) {
         displayedItems = orderBy(displayedItems, "isPacked", "asc");
      }

      // hide packed items if desired
      if (this.state.isShowingPacked === false) {
         displayedItems = displayedItems.filter(
            (item) => item.isPacked === false
         ); // keep only the unpacked items
      }

      console.log("displayedItems:", displayedItems);
      // render each sub item

      if (this.state.isEditMode) {
         // do edit mode version of item cards
         return displayedItems.map((item) => (
            <ItemCardEdit item={item} key={item.id} />
         ));
      } else {
         // do packing mode version of item cards
         return displayedItems.map((item) => (
            <ItemCard item={item} key={item.id} />
         ));
      }
   }

   render() {
      console.log("Rendering page...");

      // these are classes that are different if we are at the top level or a lower level
      // let pageBgClasses = "";
      // let pageContentClasses = "";
      // let levelHeaderClasses = "";
      // let levelBodyClasses = "";

      // get the current item
      // const currentItem = this.state.currentItem; // old value
      // const currentItem = this.props.currentLoadout.gear; // redux value
      const currentItem = this.getItemFromStore(); // get the current item from store based on the store's itemIndexPath
      console.log("currentItem.level", currentItem.level);

      // this.props.item = currentItem; // set the props of item for this component to the current item

      let level = currentItem.level;
      // if (level !== 0) {
      //    // pageContentClasses = "card super-item-card this-bg-light";
      //    levelHeaderClasses = "card-header";
      //    levelBodyClasses = "card-body";
      // }

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
                                       "light-text-color",
                                    {
                                       hidden: this.state.isEditMode,
                                    }
                                 )}
                                 onClick={(e) => {
                                    movePageToDifferentItem(
                                       this.props.currentLoadout.itemIndexPath.slice(
                                          0,
                                          -1
                                       )
                                    ); // move to current path with the last part removed to go up a level
                                 }}
                              >
                                 <div
                                    className={classnames(
                                       "icon-dark left",
                                       UI_APPEARANCE === "colors" &&
                                          "icon-light",
                                       UI_APPEARANCE !== "colors" && "icon-dark"
                                    )}
                                 >
                                    <IconArrowThinLeftCircle />
                                 </div>
                                 Back to {currentItem.parentName}
                              </span>
                           )}
                        </div>

                        {/* the following adds empty space above the super card in edit mode so it doesn't shift */}
                        {/* {level !== 0 && this.state.isEditMode && (
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
                           <div className={level > 1 && "card-header"}>
                              <div className="row">
                                 {!this.state.isEditMode && (
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
                                                {currentItem.contentSummaryText}
                                             </h4>
                                          </div>
                                       )}
                                    </>
                                 )}
                                 {this.state.isEditMode && (
                                    <div className="col">
                                       <span className="flex-fill">
                                          <h4>
                                             <input
                                                className="edit-name"
                                                defaultValue={currentItem.name}
                                                onChange={(e) =>
                                                   renameItem(
                                                      this.props.currentLoadout
                                                         .gear,
                                                      this.props.currentLoadout
                                                         .itemIndexPath,
                                                      e.target.value
                                                   )
                                                }
                                                maxLength={MAX_ITEM_NAME_LENGTH}
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
                                             "button navigation-link d-block",
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
                                          Loadout Sharing Settings
                                       </div>
                                    )}

                                    {level > 0 && (
                                       <div
                                          className={classnames(
                                             "button navigation-link d-block",
                                             UI_APPEARANCE === "dark" &&
                                                "light-text-color",
                                             UI_APPEARANCE !== "dark" &&
                                                "dark-text-color"
                                          )}
                                          onClick={(e) => {
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
                                          {this.state.isEditMode && (
                                             <>Done Editing</>
                                          )}
                                          {!this.state.isEditMode && (
                                             <>Edit Loadout</>
                                          )}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div className={level > 1 && "card-body"}>
                              <div className="row">
                                 <div className="col">
                                    {this.renderContainingItems(currentItem)}
                                 </div>
                              </div>
                              {!this.state.isEditMode && level !== 0 && (
                                 <>
                                    <div
                                       className={classnames("card-section", {
                                          disabled:
                                             currentItem.numPackedDescendants ===
                                             0,
                                       })}
                                    >
                                       <span
                                          className={classnames(
                                             "button navigation-link w-100",
                                             UI_APPEARANCE === "dark" &&
                                                "light-text-color",
                                             UI_APPEARANCE !== "dark" &&
                                                "dark-text-color"
                                          )}
                                          onClick={() =>
                                             this.toggleUnpackRollout()
                                          }
                                       >
                                          Unpack...
                                       </span>
                                       {this.state
                                          .isShowingUnpackConfirmation &&
                                          this.rolloutUnpackConfirmation()}
                                    </div>
                                 </>
                              )}
                              {this.state.isEditMode && (
                                 <>
                                    <div
                                       className="button primary-action-button"
                                       onClick={(e) => {
                                          addItemTo(
                                             this.props.currentLoadout.gear,
                                             this.props.currentLoadout
                                                .itemIndexPath
                                          );
                                       }}
                                    >
                                       Add Item
                                    </div>
                                    <div
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
                                    </div>
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
      currentLoadout: state.currentLoadout,
   };
}

export default connect(mapStateToProps)(ItemList); // this is "currying"
