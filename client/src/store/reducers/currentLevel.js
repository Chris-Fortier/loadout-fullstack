import actions from "../actions";

export default function currentLevel(currentLevel = 0, action) {
   // default for state is an empty array

   // action has two things in it: action.payload and action.type

   let newCurrentLevel = currentLevel; // make a copy of it as we cannot change the original one in place

   switch (action.type) {
      case actions.CHANGE_CURRENT_LEVEL:
         console.log("FIRED CHANGE_CURRENT_LEVEL");
         newCurrentLevel += action.payload; // change the currentLevel up or down
         return newCurrentLevel;
      default:
         return currentLevel;
   }
}
