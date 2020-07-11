module.exports = function getSignUpPasswordError(password, email) {
   if (password === "") {
      // check if password input is blank
      return "Please create a password.";
   }
   if (password.length < 9) {
      // check if password is less than 9 characters
      return "Your password must be at least 9 characters.";
   }
   if (checkHasLocalPart(password, email)) {
      // check if the local part of email is in the password
      return "Your password cannot contain your email address.";
   }
   const uniqChars = [...new Set(password)]; // move this down here so it won't be made unless needed
   if (uniqChars.length < 3) {
      // check if the password has less than 3 unique characters
      return "Your password must have at least three unique characters.";
   }

   return "";
};

// tests if the local part of the email is inside the password
function checkHasLocalPart(password, email) {
   if (email.length < 4) {
      return false;
   } else {
      const localPart = email.split("@")[0];
      return password.includes(localPart);
   }
}
