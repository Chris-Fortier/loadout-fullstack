const bcrypt = require("bcrypt");
const db = require("../db");
const selectUserByUsername = require("../queries/selectUserByUsername");
const selectUserIdByUsername = require("../queries/selectUserIdByUsername");
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
   getContentSummary(numChildren, numResolvedChildren, status) {
      const numUnresolvedChildren = numChildren - numResolvedChildren;
      if (numUnresolvedChildren > 0) {
         return numUnresolvedChildren + " left";
      }
      if (status === 0) {
         return "ready";
      }
      return "";
   },

   // returns true if a user has this username in the db, false if not
   checkIfUsernameExists(username) {
      console.log("checkIfUsernameExists()...", username);
      return db
         .query(selectUserByUsername, username)
         .then((users) => {
            if (users.length === 0) {
               return false;
            } else {
               console.log("username already in the db");
               return true;
            }
         })
         .catch((err) => {
            console.log("err", err);
         });
   },

   // returns the user id for an username or blank if there is no user
   getUserIdByUsername(username) {
      console.log("getUserIdByUsername()...", { username });
      return db
         .query(selectUserIdByUsername, username)
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
   checkIfUserLoadoutExists(userId, loadoutId) {
      console.log("checkIfUserLoadoutExists()...", { userId, loadoutId });
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
   TOKEN_EXPIRE_TIME: "3h",
};
