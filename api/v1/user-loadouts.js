// The user loadouts resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUserLoadouts = require("../../queries/selectUserLoadouts");
const insertUserLoadout = require("../../queries/insertUserLoadout");
const deleteUserLoadout = require("../../queries/deleteUserLoadout");
const {
   getContentSummary,
   getUserIdByUsername,
} = require("../../utils/helpers");
const getAddUserError = require("../../validation/getAddUserError");
const uuid = require("uuid");

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

               // username: userLoadout.username,
               loadoutName: userLoadout.name,
               canEdit: userLoadout.can_edit,
               canPack: userLoadout.can_pack,
               isAdmin: userLoadout.is_admin,
               loadoutId: userLoadout.loadout_id,
               numChildren: userLoadout.num_children,
               numPackedChildren: userLoadout.num_packed,
               contentSummary: getContentSummary(
                  userLoadout.num_children,
                  userLoadout.num_packed,
                  0 // sending status of 0 for a top level loadout
               ),
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

// @route      POST api/v1/user-loadouts/insert (going to post one thing to this list of things)
// @desc       Create a new user loadout
// @access     Public
// test: http://localhost:3060/api/v1/user-loadouts/insert?username=mike@email.com&loadoutId=42655170-7e10-4431-8d98-c2774f6414a4
router.post("/insert", async (req, res) => {
   console.log("router.post api/v1/user-loadouts/insert...");
   const { username, loadoutId, canEdit, canPack, isAdmin } = req.query; // destructuring to simplify code below, grabbing variables from req.body
   const addUserError = await getAddUserError(username, loadoutId); // check if there are any errors with the username that the user is trying to add
   let dbError = ""; // this will store some text describing an error from the database

   console.log({ username, loadoutId, addUserError });

   // if there are no errors:
   if (addUserError === "") {
      const userId = await getUserIdByUsername(username); // TODO this is actually the second time this is run during this whole process, it is also run inside getAddUserError

      // await getAddUserLoadoutError(userId, loadoutId); // check if this user loadout combo already exists

      // this is an express function
      const userLoadout = {
         id: uuid.v4(), // generate a uuid
         user_id: userId, // get the user id from the username
         loadout_id: loadoutId,
         can_edit: canEdit,
         can_pack: canPack,
         is_admin: isAdmin,
         // created_at: Date.now(), // set this date to now
      };

      console.log("will create this userLoadout: ", userLoadout);

      db.query(insertUserLoadout, userLoadout)
         .then((dbRes) => {
            res.status(200).json("New user loadout created");
         })
         .catch((err) => {
            console.log("err", err);
            dbError = `${err.code} ${err.sqlMessage}`; // format the database error
            // return a 400 error to user
            res.status(400).json({ dbError });
         });
   } else {
      // return a 400 error to user
      res.status(400).json({
         addUserError,
      });
   }
});

// @route      POST api/v1/user-loadouts/delete
// @desc       Delete an existing user-loadout
// @access     Public
// test: http://localhost:3060/api/v1/user-loadouts/delete?userLoadoutId=a02694bd-ab0f-4b53-ac76-7ef0adb7aebe
router.post("/delete", async (req, res) => {
   const { userLoadoutId } = req.query; // destructuring to simplify code below, grabbing variables from req.body

   db.query(deleteUserLoadout, [userLoadoutId])
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("user-loadout deleted");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json({ dbError });
      });
});

module.exports = router;
