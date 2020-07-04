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
};
