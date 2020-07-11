const { EMAIL_REGEX, checkUserEmailExists } = require("../utils/helpers");

module.exports = async function getSignUpEmailError(email) {
   console.log("getSignUpEmailError()...");
   if (email === "") {
      return "Please enter your email address.";
   }
   if (!EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address.";
   }
   console.log("checkUserEmailExists(email)", checkUserEmailExists(email));
   if (await checkUserEmailExists(email)) {
      return "This email address already exists in the database.";
   }
   return "";
};
