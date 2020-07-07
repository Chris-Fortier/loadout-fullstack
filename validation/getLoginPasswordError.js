const db = require("../db");
const selectUserByEmail = require("../queries/selectUserByEmail");
const bcrypt = require("bcrypt");

module.exports = async function getSignUpPasswordError(password, email) {
   if (password === "") {
      // check if password input is blank
      return "Please enter your password. -s";
   }
   if ((await checkIsValidUser(email, password)) === false) {
      return "The email and password combination that you entered is invalid. -s";
   }
   return "";
};

function checkIsValidUser(email, password) {
   // get the user by email address
   // compare user.password with password
   // if a match, return true, else false
   return db
      .query(selectUserByEmail, email)
      .then(async (users) => {
         // console.log("users", users);
         const user = users[0];
         // compares the hashed password with the hashed password in the database
         const isValidUser = await bcrypt
            .compare(password, user.password)
            .then((isValidUser) => {
               console.log("isValidUser", isValidUser);
               return isValidUser;
               // every .then should have a return inside and be followed by a .catch
            })
            .catch((err) => {
               console.log("err", err);
            });
         return isValidUser; // we put this on its own line so we know what we are returning
      })
      .catch((err) => {
         console.log("err", err);
         const isValidUser = false;
         return isValidUser;
      });
}
