const { checkIfUsernameExists } = require("../utils/helpers");

module.exports = async function getSignUpUsernameError(username) {
   console.log("getSignUpUsernameError()...");
   if (username === "") {
      return "Please enter a username.";
   }
   console.log(
      "checkIfUsernameExists(username)",
      checkIfUsernameExists(username)
   );
   if (await checkIfUsernameExists(username)) {
      return "This username already exists.";
   }
   return "";
};
