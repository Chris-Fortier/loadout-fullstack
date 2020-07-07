const { EMAIL_REGEX } = require("../utils/helpers");

module.exports = function getLoginEmailError(email) {
   console.log("getLoginEmailError()...");
   if (email === "") {
      return "Please enter your email address.";
   }
   if (!EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address.";
   }
   return "";
};
