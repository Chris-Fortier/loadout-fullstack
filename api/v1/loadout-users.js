// The loadout users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectLoadoutUsers = require("../../queries/selectLoadoutUsers");

// @route      GET api/v1/loadout-users (http://localhost:3045/api/v1/loadout-users)
// @desc       Get all users for a loadout
// @access     Public
router.get("/", (req, res) => {
   console.log("req.query", req.query);
   const loadoutId = req.query.loadoutId; // put the query into some consts (destructoring es6)

   // change this
   // db.query(selectLoadoutUsers(loadoutId))
   // https://www.npmjs.com/package/mysql#escaping-query-values
   db.query(selectLoadoutUsers, [loadoutId]) // this syntax style prevents hackers
      .then((loadoutUsers) => {
         // successful response
         // console.log(loadoutUsers);

         // we need to convert the names of our data from database-side snake_case to camelCase
         // we can also use this to "shape the data" for the client
         // this is where we can "shrink out payload", the data we sent to the client
         // I suspect this is where I am going to convert flattened loadouts to nested
         const camelCaseLoadoutUsers = loadoutUsers.map((loadoutUser) => {
            // for every loadoutUser, return a new object
            return {
               // id: loadoutUser.id,
               // imagery: loadoutUser.imagery,
               // answer: loadoutUser.answer,
               // userId: loadoutUser.user_id,
               // createdAt: loadoutUser.created_at,
               // nextAttemptAt: loadoutUser.next_attempt_at,
               // lastAttemptAt: loadoutUser.last_attempt_at,
               // totalSuccessfulAttempts: loadoutUser.total_successful_attempts,
               // level: loadoutUser.level,

               username: loadoutUser.username,
               loadoutName: loadoutUser.loadout_name,
               canEdit: loadoutUser.can_edit,
               canPack: loadoutUser.can_pack,
               isAdmin: loadoutUser.is_admin,
               id: loadoutUser.id,
               userId: loadoutUser.user_id,
            };
         });

         res.json(camelCaseLoadoutUsers);
      })
      .catch((err) => {
         // report error
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
