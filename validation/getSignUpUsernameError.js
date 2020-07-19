const { checkIfUsernameExists } = require("../utils/helpers");

module.exports = async function getSignUpUsernameError(username) {
   if (username === "") {
      return "Please enter a username.";
   }
   if (await checkIfUsernameExists(username)) {
      return "This username already exists.";
   }
   return "";
};
