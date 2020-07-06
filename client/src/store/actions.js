// having this file enables intellisense so you can type actions. and see a list of valid actions

// we use screaming snake case to show that this is a global thing
const actions = {
   UPDATE_CURRENT_USER: "UPDATE_CURRENT_USER",
   STORE_CURRENT_LOADOUT: "STORE_CURRENT_LOADOUT",
   CHANGE_ITEM_INDEX_PATH: "CHANGE_ITEM_INDEX_PATH",
   CLEAR_CURRENT_LOADOUT: "CLEAR_CURRENT_LOADOUT",
   STORE_CURRENT_ITEM: "STORE_CURRENT_ITEM",
   STORE_CHILD_ITEMS: "STORE_CHILD_ITEMS",
   CHANGE_CURRENT_LEVEL: "CHANGE_CURRENT_LEVEL", // adjusts current level up or down
   RESET_CURRENT_LEVEL: "RESET_CURRENT_LEVEL", // sets current level to 0
};

export default actions;
