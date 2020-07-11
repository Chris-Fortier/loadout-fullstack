const {
   EMAIL_REGEX,
   checkUserEmailExists,
   getUserIdFromEmail,
   getUserLoadoutByIds,
} = require("../utils/helpers");

// returns errors for adding an existing user to a loadout
module.exports = async function getAddUserError(email, loadoutId) {
   // console.log(
   //    "getAddUserError()...Checking for errors with the email the user entered",
   //    email
   // );
   // let errorMessage = "";
   if (email === "") {
      return "Please enter the email of the user you wish to share the loadout with.";
   }
   if (!EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address.";
   }
   // console.log("checkUserEmailExists(email)", checkUserEmailExists(email));
   userId = await getUserIdFromEmail(email);
   if (userId === "") {
      return "This email address is not associated with any user account.";
   }
   userLoadoutId = await getUserLoadoutByIds(userId, loadoutId);
   if (userLoadoutId !== "") {
      return "This loadout is already shared with this user.";
   }
   // console.log({ errorMessage });
   return "";
};
