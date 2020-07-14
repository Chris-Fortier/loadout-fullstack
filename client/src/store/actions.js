// having this file enables intellisense so you can type actions. and see a list of valid actions

// we use screaming snake case to show that this is a global thing
const actions = {
   UPDATE_CURRENT_USER: "UPDATE_CURRENT_USER",
   STORE_CURRENT_ITEM: "STORE_CURRENT_ITEM",
   STORE_CHILD_ITEMS: "STORE_CHILD_ITEMS",
   CHANGE_CURRENT_LEVEL: "CHANGE_CURRENT_LEVEL", // adjusts current level up or down
   RESET_CURRENT_LEVEL: "RESET_CURRENT_LEVEL", // sets current level to 0
   STORE_CURRENT_USER_LOADOUT: "STORE_CURRENT_USER_LOADOUT",
   STORE_USER_LOADOUTS: "STORE_USER_LOADOUTS",
};

export default actions;
