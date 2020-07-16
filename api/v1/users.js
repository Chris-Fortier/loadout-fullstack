// The users resource
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const selectUserById = require("../../queries/selectUserById");
const selectUserByUsername = require("../../queries/selectUserByUsername");
const deleteUser = require("../../queries/deleteUser");
const { toHash } = require("../../utils/helpers");
const getSignUpUsernameError = require("../../validation/getSignUpUsernameError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");
const getLoginUsernameError = require("../../validation/getLoginUsernameError");
const getLoginPasswordError = require("../../validation/getLoginPasswordError");
const jwt = require("jsonwebtoken");
const validateJwt = require("../../utils/validateJwt");

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

// @route      POST api/v1/users/auth
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
            // TODO: repeat when creating a user
            // what the user is
            // the user is the first user in the array of 1 item (users[0])
            const user = {
               id: users[0].id,
               username: users[0].username,
               createdAt: users[0].created_at,
            };

            // this contains the user, a secret and the timeframe
            // 1m for testing, could be longer like 3h, 7d etc
            const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
               expiresIn: "60m",
            });

            res.status(200).json({ accessToken }); // instead of passing the user as the response, pass the access token
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

// @route      POST api/v1/users/delete
// @desc       Delete an existing user
// @access     Private
// test:
router.post("/delete", validateJwt, async (req, res) => {
   const userId = req.user.id; // get the user id from the validateJwt
   console.log({ userId });

   db.query(deleteUser, [userId])
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("User deleted");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json(err);
      });
});

module.exports = router;
