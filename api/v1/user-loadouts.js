// The user loadouts resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUserLoadouts = require("../../queries/selectUserLoadouts"); // change this

// @route      GET api/v1/user-loadouts (http://localhost:3045/api/v1/user-loadouts)  // change this
// @desc       Get all user loadouts for a user
// @access     Public
router.get("/", (req, res) => {
   console.log(req.query);
   const userId = req.query.userId; // put the query into some consts

   // change this
   // db.query(selectUserLoadouts(userId))
   // https://www.npmjs.com/package/mysql#escaping-query-values
   db.query(selectUserLoadouts, [userId]) // this syntax style prevents hackers
      .then((userLoadouts) => {
         // successful response
         // console.log(userLoadouts);

         // we need to convert the names of our data from database-side snake_case to camelCase
         // we can also use this to "shape the data" for the client
         // this is where we can "shrink out payload", the data we sent to the client
         // I suspect this is where I am going to convert flattened loadouts to nested
         const camelCaseUserLoadouts = userLoadouts.map((userLoadout) => {
            // for every userLoadout, return a new object
            return {
               // id: userLoadout.id,
               // imagery: userLoadout.imagery,
               // answer: userLoadout.answer,
               // userId: userLoadout.user_id,
               // createdAt: userLoadout.created_at,
               // nextAttemptAt: userLoadout.next_attempt_at,
               // lastAttemptAt: userLoadout.last_attempt_at,
               // totalSuccessfulAttempts: userLoadout.total_successful_attempts,
               // level: userLoadout.level,

               email: userLoadout.email,
               loadoutName: userLoadout.loadout_name,
               canEdit: userLoadout.can_edit,
               canPack: userLoadout.can_pack,
               isAdmin: userLoadout.is_admin,
               loadoutId: userLoadout.loadout_id,
            };
         });

         res.json(camelCaseUserLoadouts);
      })
      .catch((err) => {
         // report error
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
