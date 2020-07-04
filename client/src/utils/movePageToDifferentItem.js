import actions from "../store/actions";
import store from "../store/store";

// move page to a different item
export default function movePageToDifferentItem(itemIndexPath) {
   console.log("movePageToDifferentItem()...itemIndexPath:", itemIndexPath);
   store.dispatch({
      type: actions.CHANGE_ITEM_INDEX_PATH,
      payload: itemIndexPath,
   });

   // this.setCurrentItem(itemIndexPath);

   // TODO how can I do this?
   // this.setState({ isEditMode: false, isShowingUnpackConfirmation: false }); // get out of edit mode if the current item changes

   window.scrollTo(0, 0); // sets focus to the top of the page
}
