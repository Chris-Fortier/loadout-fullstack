// The users resource
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const selectUserById = require("../../queries/selectUserById");
const selectUserByUsername = require("../../queries/selectUserByUsername");
const deleteUser = require("../../queries/deleteUser");
const setUserUsername = require("../../queries/setUserUsername");
const deleteUserLoadoutsByUser = require("../../queries/deleteUserLoadoutsByUser");
const setUserPassword = require("../../queries/setUserPassword");
const { toHash, TOKEN_EXPIRE_TIME } = require("../../utils/helpers");
const getSignUpUsernameError = require("../../validation/getSignUpUsernameError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");
const getLoginUsernameError = require("../../validation/getLoginUsernameError");
const getLoginPasswordError = require("../../validation/getLoginPasswordError");
const jwt = require("jsonwebtoken");
const validateJwt = require("../../utils/validateJwt");
const setUserLastLoginAt = require("../../queries/setUserLastLoginAt");
const checkPasswordAgainstUserId = require("../../validation/checkPasswordAgainstUserId");

// TODO: generate uuid on server instead of client
// TODO: generate dates on server instead of client

// @route      POST api/v1/users (going to post one thing to this list of things)
// @desc       Create a new user
// @access     Public
router.post("/", async (req, res) => {
   const { id, username, password, createdAt } = req.body; // destructuring to simplify code below, grabbing variables from req.body
   const signupUsernameError = await getSignUpUsernameError(username);
   const signupPasswordError = getSignUpPasswordError(password);
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
                  // TODO: duplicated code
                  // what the user is
                  // the user is the first user in the array of 1 item (users[0])
                  thisLoginAt = Date.now();
                  const user = {
                     id: users[0].id,
                     username: users[0].username,
                     createdAt: users[0].created_at,
                     lastLoginAt: users[0].last_login_at,
                     thisLoginAt: thisLoginAt,
                     uiTheme: users[0].ui_theme,
                  };

                  // this contains the user, a secret and the timeframe
                  // 1m for testing, could be longer like 3h, 7d etc
                  const accessToken = jwt.sign(
                     user,
                     process.env.JWT_ACCESS_SECRET,
                     {
                        expiresIn: TOKEN_EXPIRE_TIME,
                     }
                  );

                  // enter new last login
                  db.query(setUserLastLoginAt, [thisLoginAt, users[0].id])
                     .then(() => {
                        res.status(200).json({ accessToken }); // instead of passing the user as the response, pass the access token
                     })
                     .catch((err) => {
                        res.status(400).json("error updating last login time");
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
            // TODO: duplicated code
            // what the user is
            // the user is the first user in the array of 1 item (users[0])
            thisLoginAt = Date.now();
            const user = {
               id: users[0].id,
               username: users[0].username,
               createdAt: users[0].created_at,
               lastLoginAt: users[0].last_login_at,
               thisLoginAt: thisLoginAt,
               uiTheme: users[0].ui_theme,
            };

            // this contains the user, a secret and the timeframe
            // 1m for testing, could be longer like 3h, 7d etc
            const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
               expiresIn: TOKEN_EXPIRE_TIME,
            });

            // enter new last login
            db.query(setUserLastLoginAt, [thisLoginAt, users[0].id])
               .then(() => {
                  res.status(200).json({ accessToken }); // instead of passing the user as the response, pass the access token
               })
               .catch((err) => {
                  res.status(400).json("error updating last login time");
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
      res.status(400).json({ loginUsernameError, loginPasswordError });
   }
});

// @route      PUT api/v1/users/delete
// @desc       Delete an existing user
// @access     Private
// test:
router.put("/delete", validateJwt, async (req, res) => {
   console.log("req.body", req.body);
   const { password } = req.body; // grabbing variable from req.body
   const userId = req.user.id; // get the user id from the JWT

   const deleteAccountPasswordError = await checkPasswordAgainstUserId(
      password,
      userId
   ); // check to see if the password submitted is correct

   if (deleteAccountPasswordError === "") {
      // if it gets this far, username can be changed

      // TODO: can probably do the first part by doing something with foreign keys and cascading

      // first delete all the user's user loadouts
      db.query(deleteUserLoadoutsByUser, [userId])
         .then((dbRes) => {
            console.log("dbRes", dbRes);
            console.log("all user-loadouts of a user deleted");
            // then delete the user
            db.query(deleteUser, [userId])
               .then((dbRes) => {
                  console.log("dbRes", dbRes);
                  res.status(200).json(
                     "all user-loadouts of a user deleted and user deleted"
                  );
               })
               .catch((err) => {
                  console.log("err", err);
                  res.status(400).json(err);
               });
         })
         .catch((err) => {
            console.log("err", err);
            res.status(400).json(err);
         });
   } else {
      // return a 400 error to user
      console.log({ deleteAccountPasswordError });
      res.status(400).json({
         deleteAccountPasswordError,
      });
   }
});

// @route      PUT api/v1/users/set-username
// @desc       change a username
// @access     Private
// test:
router.put("/set-username", validateJwt, async (req, res) => {
   // console.log("req.body", req.body);

   const { newUsername, password } = req.body; // grabbing variables from req.body
   const userId = req.user.id; // get the user id from the JWT
   console.log({ userId });
   const changeUsernameUsernameError = await getSignUpUsernameError(
      newUsername
   ); // check to see if the new username is valid
   console.log({ changeUsernameUsernameError });
   const changeUsernamePasswordError = await checkPasswordAgainstUserId(
      password,
      userId
   ); // check to see if the password submitted is correct
   console.log({
      userId,
      changeUsernameUsernameError,
      changeUsernamePasswordError,
   });

   if (
      changeUsernameUsernameError === "" &&
      changeUsernamePasswordError === ""
   ) {
      // if it gets this far, username can be changed
      console.log("username can be changed");
      // res.status(200).json("Username can be changed");

      db.query(setUserUsername, [newUsername, userId])
         .then((dbRes) => {
            console.log("dbRes", dbRes);
            res.status(200).json("username changed to " + newUsername);
         })
         .catch((err) => {
            console.log("err", err);
            res.status(400).json(err);
         });
   } else {
      // return a 400 error to user
      res.status(400).json({
         changeUsernameUsernameError,
         changeUsernamePasswordError,
      });
   }
});

// @route      PUT api/v1/users/set-password
// @desc       change a password
// @access     Private
// test:
router.put("/set-password", validateJwt, async (req, res) => {
   const { oldPassword, newPassword } = req.body; // grabbing variables from req.body
   const userId = req.user.id; // get the user id from the JWT
   const changePasswordOldPasswordError = await checkPasswordAgainstUserId(
      oldPassword,
      userId
   ); // check to see if the oldPassword submitted is correct
   const changePasswordNewPasswordError = await getSignUpPasswordError(
      newPassword
   ); // check to see if the newPassword submitted is gtg
   let changePasswordResult = "";
   let resStatus = 200;

   // if there are no errors, change the password
   if (
      changePasswordOldPasswordError === "" &&
      changePasswordNewPasswordError === ""
   ) {
      // if it gets this far, password can be changed

      db.query(setUserPassword, [await toHash(newPassword), userId])
         .then((dbRes) => {
            resStatus = 200;
            changePasswordResult = "Your password was changed.";
            sendResponse();
         })
         .catch((err) => {
            resStatus = 400;
            changePasswordResult = "There was an error on the server.";
            sendResponse();
         });
   } else {
      // return error to user
      resStatus = 400;
      sendResponse();
   }

   // finally send the response which is a list of errors or a success message
   // made this a function to ensure it happens last when I call it inside thens and catches
   function sendResponse() {
      console.log(resStatus, {
         changePasswordOldPasswordError,
         changePasswordNewPasswordError,
         changePasswordResult,
      });
      res.status(resStatus).json({
         changePasswordOldPasswordError,
         changePasswordNewPasswordError,
         changePasswordResult,
      });
   }
});
module.exports = router;
