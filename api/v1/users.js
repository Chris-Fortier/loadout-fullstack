// The users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const selectUserById = require("../../queries/selectUserById");
const selectUserByUsername = require("../../queries/selectUserByUsername");
const { toHash } = require("../../utils/helpers");
const getSignUpUsernameError = require("../../validation/getSignUpUsernameError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");
const getLoginUsernameError = require("../../validation/getLoginUsernameError");
const getLoginPasswordError = require("../../validation/getLoginPasswordError");

// @route      POST api/v1/users (going to post one thing to this list of things)
// @desc       Create a new user
// @access     Public
router.post("/", async (req, res) => {
   const { id, username, password, createdAt } = req.body; // destructuring to simplify code below, grabbing variables from req.body
   const signupUsernameError = await getSignUpUsernameError(username);
   const signupPasswordError = getSignUpPasswordError(password, username);
   let dbError = ""; // this will store some text describing an error from the database

   console.log({ signupUsernameError, signupPasswordError });

   // if there are no errors with username and password:
   if (signupUsernameError === "" && signupPasswordError == "") {
      // this is an express function
      const user = {
         id, // if the key and value are called the same, you can just have the key
         username, // if the key and value are called the same, you can just have the key
         password: await toHash(password), // hash the password (npm install bcrypt)
         created_at: createdAt,
      };

      db.query(insertUser, user)
         .then((dbRes) => {
            // return the user data to we can put in redux store
            db.query(selectUserById, id)
               .then((users) => {
                  const user = users[0]; // the user is the first user in the array of 1 item
                  res.status(200).json({
                     id: user.id,
                     username: user.username,
                     createdAt: user.created_at,
                  });
               })
               .catch((err) => {
                  console.log("err", err);
                  dbError = `${err.code} ${err.sqlMessage}`; // format the database error
                  // return a 400 error to user
                  res.status(400).json({ dbError });
               });
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
         signupUsernameError,
         signupPasswordError,
      });
   }
});

// @route      POST api/v1/auth
// @desc       Check this user against the db via username and password
// @access     Public
router.post("/auth", async (req, res) => {
   const { username, password } = req.body; // destructuring to simplify code below, grabbing variables from req.body
   const loginUsernameError = getLoginUsernameError(username);
   const loginPasswordError = await getLoginPasswordError(password, username);
   console.log({ loginUsernameError, loginPasswordError }); // this form of console logging makes it clear what it is
   let dbError = ""; // this will store some text describing an error from the database

   // if there are no errors
   if (loginUsernameError === "" && loginPasswordError == "") {
      // return the user to the client
      db.query(selectUserByUsername, username)
         .then((users) => {
            const user = users[0]; // the user is the first user in the array of 1 item
            res.status(200).json({
               id: user.id,
               username: user.username,
               createdAt: user.created_at,
            });
            // this then statement is executing a side-effect
         })
         .catch((err) => {
            console.log("err", err);
            dbError = `${err.code} ${err.sqlMessage}`; // format the database error
            // return a 400 error to user
            res.status(400).json({ dbError });
         });
   } else {
      // return a 400 error to user
      res.status(400).json({ loginUsernameError, loginPasswordError });
   }
});

module.exports = router;
