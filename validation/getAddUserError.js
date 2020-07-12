const {
   checkIfUsernameExists,
   getUserIdByUsername,
   checkIfUserLoadoutExists,
} = require("../utils/helpers");

// returns errors for adding an existing user to a loadout
module.exports = async function getAddUserError(username, loadoutId) {
   // console.log(
   //    "getAddUserError()...Checking for errors with the username the user entered",
   //    username
   // );
   // let errorMessage = "";
   if (username === "") {
      return "Please enter the username of the user you wish to share the loadout with.";
   }
   // console.log("checkIfUsernameExists(username)", checkIfUsernameExists(username));
   userId = await getUserIdByUsername(username);
   if (userId === "") {
      return "This username is either misspelled or doesn't exist.";
   }
   userLoadoutId = await checkIfUserLoadoutExists(userId, loadoutId);
   if (userLoadoutId !== "") {
      return "This loadout is already shared with this user.";
   }
   // console.log({ errorMessage });
   return "";
};
