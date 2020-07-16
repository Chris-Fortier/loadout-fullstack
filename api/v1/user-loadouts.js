// The user loadouts resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUserLoadouts = require("../../queries/selectUserLoadouts");
const insertUserLoadout = require("../../queries/insertUserLoadout");
const deleteUserLoadout = require("../../queries/deleteUserLoadout");
const deleteUserLoadoutsByUser = require("../../queries/deleteUserLoadoutsByUser");
const selectUserLoadoutByIds = require("../../queries/selectUserLoadoutByIds");
const deleteUserLoadoutByIds = require("../../queries/deleteUserLoadoutByIds");
const setUserLoadout = require("../../queries/setUserLoadout");
const {
   getContentSummary,
   getUserIdByUsername,
} = require("../../utils/helpers");
const getAddUserError = require("../../validation/getAddUserError");
const uuid = require("uuid");
const validateJwt = require("../../utils/validateJwt");

// @route      GET api/v1/user-loadouts (http://localhost:3045/api/v1/user-loadouts)  // change this
// @desc       Get all user loadouts for a user
// @access     Private
// test: http://localhost:3060/api/v1/user-loadouts
router.get("/", validateJwt, (req, res) => {
   const userId = req.user.id; // get the user id from the validateJwt

   // change this
   // db.query(selectUserLoadouts(userId))
   // https://www.npmjs.com/package/mysql#escaping-query-values
   db.query(selectUserLoadouts, [userId]) // this syntax style prevents hackers
      .then((userLoadouts) => {
         // successful response

         const camelCaseUserLoadouts = userLoadouts.map((userLoadout) => {
            // for every userLoadout, return a new object

            // convert null counts to zeros
            let numChildren = userLoadout.num_children;
            if (numChildren === null) numChildren = 0;
            let numPackedChildren = userLoadout.num_packed;
            if (numPackedChildren === null) numPackedChildren = 0;

            return {
               loadoutName: userLoadout.name,
               canEdit: userLoadout.can_edit,
               canPack: userLoadout.can_pack,
               isAdmin: userLoadout.is_admin,
               loadoutId: userLoadout.loadout_id,
               numChildren: numChildren,
               numPackedChildren: numPackedChildren,
               numUsers: userLoadout.num_users, // the number of users who have access to the loadout
               contentSummary: getContentSummary(
                  numChildren,
                  numPackedChildren,
                  0 // sending status of 0 for a top level loadout
               ),
               // contentSummary: "Hello",
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
// @access     Private
// test: http://localhost:3060/api/v1/user-loadouts/insert?username=sean&loadoutId=42655170-7e10-4431-8d98-c2774f6414a4&canEdit=0&canPack=1&isAdmin=0
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

// @route      PUT api/v1/user-loadouts/delete
// @desc       delete a user loadout
//                only if the provided user token has admin privledges adn they are not deleting themself
// @access     Private
// test:       http://localhost:3060/api/v1/user-loadouts/delete?userId=a7ce95c7-d9ca-4788-912e-a4e91b7f7e66&loadoutId=8fc62fd2-0fd0-4b25-b3f4-7698a8301d2b
router.put("/delete", validateJwt, async (req, res) => {
   const deleterUserId = req.user.id; // the user id of the user who is trying to delete the user loadout
   const userId = req.query.userId; // the user id of the user loadout
   const loadoutId = req.query.loadoutId; // the loadout id of the user loadout

   // we can delete if the user is deleting their own user loadout unless they are an admin
   // we can also delete if the user is an admin and they are deleting a user loadout for a different user
   db.query(selectUserLoadoutByIds, [deleterUserId, loadoutId])
      .then((userLoadouts) => {
         // check if the user who is performing the delete has access to this loadout
         if (userLoadouts.length === 1) {
            console.log("user has access to this loadout");
            // check if the user has admin permissions on this loadout
            if (userLoadouts[0].is_admin === 1) {
               if (deleterUserId !== userId) {
                  db.query(deleteUserLoadoutByIds, [userId, loadoutId])
                     .then((dbRes) => {
                        console.log("dbRes", dbRes);
                        res.status(200).json(
                           "admin removed another user from this loadout" // reproduced
                        );
                     })
                     .catch((err) => {
                        console.log("err", err);
                        res.status(400).json({ dbError });
                     });
               } else {
                  res.status(400).json(
                     "admin cannot remove themself from loadout" // reproduced
                  );
               }
            } else {
               if (deleterUserId === userId) {
                  db.query(deleteUserLoadout, [userLoadouts[0].id])
                     .then((dbRes) => {
                        console.log("dbRes", dbRes);
                        res.status(200).json(
                           "user removed themself from loadout" // reproduced
                        );
                     })
                     .catch((err) => {
                        console.log("err", err);
                        res.status(400).json({ dbError });
                     });
               } else {
                  res.status(400).json(
                     "you cannot remove other users from a loadout unless you are an admin" // reproduced
                  );
               }
            }
         } else {
            res.status(400).json(
               "user does not have access to this loadout or the loadout doesn't exist" // reproduced
            );
         }
      })
      .catch((err) => {
         res.status(400).json(err);
      });
});

// @route      POST api/v1/user-loadouts/delete-all-by-user
// @desc       Delete all the user loadouts of a user (needed before deleting a user)
// @access     Private
// test: http://localhost:3060/api/v1/user-loadouts/delete-all-by-user
router.post("/delete-all-by-user", validateJwt, async (req, res) => {
   const userId = req.user.id;
   console.log({ userId });

   db.query(deleteUserLoadoutsByUser, [userId])
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("all user-loadouts of a user deleted");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json(err);
      });
});

// @route      PUT api/v1/user-loadouts/set-permissions
// @desc       sets permissions on a user loadout
//                only if the provided user token has admin privledges
// @access     Private
// test:       http://localhost:3060/api/v1/user-loadouts/set-permissions?userId=a7ce95c7-d9ca-4788-912e-a4e91b7f7e66&loadoutId=3196365f-538d-4ffe-9fd4-b45e8560397e&canPack=3&canEdit=3&isAdmin=3
router.put("/set-permissions", validateJwt, async (req, res) => {
   const adminUserId = req.user.id; // get the user id from the validateJwt, this is the admin's user id who is trying to make the change
   const userId = req.query.userId; // the user id of the user's permissions we are dealing with
   const loadoutId = req.query.loadoutId;
   const canPack = req.query.canPack;
   const canEdit = req.query.canEdit;
   const isAdmin = req.query.isAdmin;

   console.log({ adminUserId, userId, loadoutId, canPack, canEdit, isAdmin });

   // make sure all the values are valid
   if (
      (canPack === "0" || canPack === "1") &&
      (canEdit === "0" || canEdit === "1") &&
      (isAdmin === "0" || isAdmin === "1")
   ) {
      // the admin cannot remove admin privledges from self, so if the adminUserId and userLoadout userId are the same, set isAdmin to 1
      if (isAdmin === "0" && adminUserId === userId) {
         res.status(400).json(
            "an admin cannot take admin permissions from self"
         );
         console.log("an admin cannot take admin permissions from self");
      } else {
         db.query(selectUserLoadoutByIds, [adminUserId, loadoutId])
            .then((userLoadouts) => {
               // check if the user has access to this loadout
               if (userLoadouts.length === 1) {
                  console.log("user has access to this loadout");
                  // check if the user has admin permissions on this loadout
                  if (userLoadouts[0].is_admin === 1) {
                     console.log("user has admin permissions on this loadout");
                     // update the permissions on the user loadout
                     db.query(setUserLoadout, [
                        canPack,
                        canEdit,
                        isAdmin,
                        userId,
                        loadoutId,
                     ])
                        .then((dbRes) => {
                           console.log("userLoadout permissions assigned");
                           res.status(200).json({ dbRes });
                        })
                        .catch((err) => {
                           console.log("err", err);
                           res.status(400).json(err);
                        });
                  } else {
                     res.status(400).json(
                        "user does not have admin permisson on this loadout"
                     );
                  }
               } else {
                  res.status(400).json(
                     "user does not have access to this loadout or the loadout doesn't exist"
                  );
               }
            })
            .catch((err) => {
               console.log("err", err);
               res.status(400).json({ err });
            });
      }
   } else {
      res.status(400).json("one or more permission values are not valid");
      console.log("one or more permission values are not valid");
   }

   // const { itemId } = req.query; // destructuring to simplify code below, grabbing variables from req.body
   // console.log({ itemId });
});

module.exports = router;
