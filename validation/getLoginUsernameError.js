module.exports = function getLoginUsernameError(username) {
   console.log("getLoginUsernameError()...");
   if (username === "") {
      return "Please enter your username.";
   }
   return "";
};
