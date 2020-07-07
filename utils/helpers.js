const bcrypt = require("bcrypt");

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

   // server side constants
   EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};
