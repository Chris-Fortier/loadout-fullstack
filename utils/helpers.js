const bcrypt = require("bcrypt");
const db = require("../db");
const selectUserByEmail = require("../queries/selectUserByEmail");
const selectUserIdByEmail = require("../queries/selectUserIdByEmail");
const selectUserLoadoutByIds = require("../queries/selectUserLoadoutByIds");

// this file is for short functions we will use throughout the app on the server side

module.exports = {
   // this converts rowpacket data
   toJson(data) {
      return JSON.stringify(data);
   },

   // safely parses without crashing the app
   toSafeParse(str) {
      try {
         JSON.parse(str);
      } catch (err) {
         console.log(err);
         return str;
      }
      return JSON.parse(str); // Could be undefined
   },

   // returns a hashed version of a given password
   toHash(myPlaintextPassword) {
      const saltRounds = 12;
      return bcrypt.hash(myPlaintextPassword, saltRounds);
   },

   // returns a short human-readable sumamry of the packed content of an item given the number of children and packed childred it has
   getContentSummary(numChildren, numPackedChildren, status) {
      const numUnpackedChildren = numChildren - numPackedChildren;
      if (numUnpackedChildren > 0) {
         return numUnpackedChildren + " left";
      }
      if (status === 0) {
         return "ready";
      }
      return "";
   },

   // returns true if a user has this email in the db, false if not
   checkUserEmailExists(email) {
      console.log("checkUserEmailExists()...");
      return db
         .query(selectUserByEmail, email)
         .then((users) => {
            if (users.length === 0) {
               return false;
            } else {
               console.log("email already in the db");
               return true;
            }
         })
         .catch((err) => {
            console.log("err", err);
         });
   },

   // returns the user id for an email or blank if there is no user
   getUserIdFromEmail(email) {
      console.log("getUserIdFromEmail()...", { email });
      return db
         .query(selectUserIdByEmail, email)
         .then((users) => {
            if (users.length === 0) {
               return "";
            } else {
               return users[0].id;
            }
         })
         .catch((err) => {
            console.log("err", err);
         });
   },

   // returns the user loadout id for a user id and loadout id or blank if it doesn't exist
   getUserLoadoutByIds(userId, loadoutId) {
      console.log("getUserLoadoutByIds()...", { userId, loadoutId });
      return db
         .query(selectUserLoadoutByIds, [userId, loadoutId])
         .then((userLoadouts) => {
            console.log("query worked");
            if (userLoadouts.length === 0) {
               return "";
            } else {
               return userLoadouts[0].id;
            }
         })
         .catch((err) => {
            console.log("err", err);
         });
   },

   // server side constants
   EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};
