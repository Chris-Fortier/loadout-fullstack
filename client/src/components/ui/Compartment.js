import React from "react";
import { MAX_ITEM_NAME_LENGTH, LEVEL_COLORS } from "../../utils/helpers";
import classnames from "classnames";
import { connect } from "react-redux";
import actions from "../../store/actions";
import ItemCard from "../ui/ItemCard";
import {
   renameItem,
   processLoadout,
   deleteItemId,
   promoteChildrenThenDeleteItemId,
} from "../../utils/items";
import axios from "axios";
import {
   CancelMoveIcon,
   PutDownItem,
   AddIcon,
   DeleteIcon,
   UnpackAllIcon,
} from "../../icons/loadout-icons";
import store from "../../store/store";

class Compartment extends React.Component {
   constructor(props) {
      super(props); // boilerplate

      this.state = {
         isShowingDeleteConfirmation: false,
         isShowingUnpackConfirmation: false,
      };
   }

   // roll out a dialog for unpacking an item's contents
   renderUnpackConfirmation(item) {
      return (
         <div
            id="myModal"
            className="modal"
            onClick={() => {
               this.hideUnpackConfirmation();
            }}
         >
            <div
               className="modal-content"
               onClick={(e) => {
                  e.stopPropagation();
               }} // this stops it from doing the parent onClick even (stops it from closing if you click inside the modal)
            >
               <p>Unpack {item.name}</p>
               <div
                  className="button primary-action-button"
                  onClick={() => {
                     // console.log(`${option.text} clicked`);
                     this.confirmUnpackDescendants();
                  }}
               >
                  {`Unpack all ${item.numResolvedDescendants} packed items and subitems inside ${item.name}`}
               </div>
               <div
                  className="button secondary-action-button"
                  onClick={() => {
                     // console.log(`${option.text} clicked`);
                     this.hideUnpackConfirmation();
                  }}
               >
                  Cancel
               </div>
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
            store.dispatch({
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
            store.dispatch({
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
         store.dispatch({
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
      store.dispatch({
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
               store.dispatch({
                  type: actions.STORE_CURRENT_LOADOUT,
                  payload: processLoadout(this.props.currentLoadout), // process the loadout because the levels and counters would have changed
               });
            })
            .catch((error) => {
               console.log("axios error", error);
            });
      }
   }

   // TODO: kind of duplicated the delete modal from ItemCard

   renderContainerDeleteConfirmation() {
      // count the number of compartments the parent item has
      let numSiblingCompartments = 0; // this number includes this compartment
      for (let i in this.props.currentLoadout) {
         if (
            this.props.currentLoadout[i].parentId ===
            this.props.compartment.parentId
         ) {
            numSiblingCompartments++;
         }
      }
      console.log({ numSiblingCompartments });

      return (
         <div
            id="myModal"
            className="modal"
            onClick={() => {
               this.setState({ isShowingDeleteConfirmation: false });
            }}
         >
            <div
               className="modal-content"
               onClick={(e) => {
                  e.stopPropagation();
               }} // this stops it from doing the parent onClick even (stops it from closing if you click inside the modal)
            >
               <p>{`Are you sure you want to delete compartment "${this.props.compartment.name}"?`}</p>
               {this.props.compartment.numDescendants > 0 &&
                  numSiblingCompartments === 1 && (
                     <>
                        <div
                           className="button primary-action-button"
                           onClick={() => {
                              promoteChildrenThenDeleteItemId(
                                 this.props.currentLoadout,
                                 this.props.compartment.id
                              );
                              this.setState({
                                 isShowingDeleteConfirmation: false,
                              });
                           }}
                        >
                           {`Delete but promote it's ${this.props.compartment.numDescendants} subitems`}
                        </div>
                     </>
                  )}
               {this.props.compartment.numDescendants > 0 && (
                  <>
                     <div
                        className="button danger-action-button"
                        onClick={() => {
                           deleteItemId(
                              this.props.currentLoadout,
                              this.props.compartment.id
                           );
                           this.setState({
                              isShowingDeleteConfirmation: false,
                           });
                        }}
                     >
                        {`Delete it's ${this.props.compartment.numDescendants} subitems too`}
                     </div>
                  </>
               )}
               {this.props.compartment.numDescendants === 0 && (
                  <div
                     className="button primary-action-button"
                     onClick={() => {
                        deleteItemId(
                           this.props.currentLoadout,
                           this.props.compartment.id
                        );
                        this.setState({ isShowingDeleteConfirmation: false });
                     }}
                  >
                     {`Delete compartment "${this.props.compartment.name}"`}
                  </div>
               )}
               <div
                  className="button secondary-action-button"
                  onClick={() => {
                     this.setState({ isShowingDeleteConfirmation: false });
                  }}
               >
                  Cancel
               </div>
            </div>
         </div>
      );
   }

   render() {
      const thisItem = this.props.compartment;

      console.log("renderCompartment()...", thisItem);

      // set the rotating level colors
      const thisLevelRotated = (thisItem.level + LEVEL_COLORS) % LEVEL_COLORS;
      // const parentLevelRotated =
      //    (thisItem.level + LEVEL_COLORS - 1) % LEVEL_COLORS;
      const childLevelRotated =
         (thisItem.level + LEVEL_COLORS + 1) % LEVEL_COLORS;

      // stores whether the current user can edit the name of the compartment item (if the level is 1 they must be an admin, otherwise they must have editing rights)
      console.log(this.props.currentUserLoadout);
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
                     {!this.props.isEditMode &&
                        thisItem.level !== 0 &&
                        thisItem.status !== 4 &&
                        thisItem.numResolvedDescendants !== 0 &&
                        this.props.currentUserLoadout.canPack === 1 && (
                           <>
                              <span
                                 className={classnames(
                                    `icon-dark item-card-icon item-icon-colors item-icon-colors-${thisLevelRotated} clickable`
                                 )}
                                 onClick={(e) => {
                                    this.toggleUnpackRollout();
                                 }}
                                 title="Unpack.."
                              >
                                 <UnpackAllIcon />
                              </span>
                              {/* <span className="icon-button-gap"></span> */}
                           </>
                        )}
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
                              `level-text-color-child level-text-color-${childLevelRotated}`,
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
                     {thisItem.status === 4 && (
                        <>
                           <span
                              className={`item-card-icon clickable item-icon-colors item-icon-colors-${thisLevelRotated}`}
                              onClick={() =>
                                 this.setState({
                                    isShowingDeleteConfirmation: true,
                                 })
                              }
                              title="Delete this compartment..."
                           >
                              <DeleteIcon />
                           </span>
                           <span className="icon-button-gap"></span>
                        </>
                     )}
                     {/* <span className="icon-button-gap"></span>
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
                     </span> */}
                     <input
                        className={classnames(
                           `flex-fill level-text-color-this level-text-color-${thisLevelRotated}`,
                           {
                              "page-item-input": thisItem.status !== 4,
                              "compartment-input": thisItem.status === 4,
                           }
                        )}
                        defaultValue={thisItem.name}
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
                                    store.dispatch({
                                       type: actions.CLEAR_MOVEABLE_ITEM_IDS,
                                    });
                                 }}
                                 title="Cancel Move"
                              >
                                 <CancelMoveIcon />
                              </span>
                           </>
                        )}
                  </div>
               )}
            </div>
            {/* <div className="row">
               <div className="col"> */}
            {childItems.map((item) => (
               <ItemCard item={item} key={item.id} />
            ))}
            {childCompartments.map((compartment) => (
               // this.renderCompartment(compartment)
               <Compartment
                  compartment={compartment}
                  key={compartment.id}
                  // no idea why I need to pase these store things as props, why mapStateToProps doesn't work
                  currentItem={this.props.currentItem}
                  currentUserLoadout={this.props.currentUserLoadout}
                  currentLoadout={this.props.currentLoadout}
                  moveableItemIds={this.props.moveableItemIds}
                  isEditMode={this.props.isEditMode}
               />
            ))}
            {this.state.isShowingDeleteConfirmation &&
               this.renderContainerDeleteConfirmation()}
         </div>
      );
   }
}

// maps the store to props
function mapStateToProps(state) {
   return {
      // currentLoadout: state.currentLoadout,
      currentItem: state.currentItem,
      // currentUser: state.currentUser,
      currentUserLoadout: state.currentUserLoadout,
      isEditMode: state.isEditMode,
      currentLoadout: state.currentLoadout,
      moveableItemIds: state.moveableItemIds,
   };
}

export default connect(mapStateToProps)(Compartment);
