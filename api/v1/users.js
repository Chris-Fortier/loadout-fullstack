// The users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const selectUserById = require("../../queries/selectUserById");
const selectUserByEmail = require("../../queries/selectUserByEmail");
const { toHash } = require("../../utils/helpers");
const getSignUpEmailError = require("../../validation/getSignUpEmailError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");
const getLoginEmailError = require("../../validation/getLoginEmailError");
const getLoginPasswordError = require("../../validation/getLoginPasswordError");

// @route      POST api/v1/users (going to post one thing to this list of things)
// @desc       Create a new user
// @access     Public
router.post("/", async (req, res) => {
   const { id, email, password, createdAt } = req.body; // destructuring to simplify code below, grabbing variables from req.body
   const signupEmailError = await getSignUpEmailError(email);
   const signupPasswordError = getSignUpPasswordError(password, email);
   let dbError = ""; // this will store some text describing an error from the database

   console.log({ signupEmailError, signupPasswordError });

   // if there are no errors with email and password:
   if (signupEmailError === "" && signupPasswordError == "") {
      // this is an express function
      const user = {
         id, // if the key and value are called the same, you can just have the key
         email, // if the key and value are called the same, you can just have the key
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
                     email: user.email,
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
         signupEmailError,
         signupPasswordError,
      });
   }
});

// @route      POST api/v1/auth
// @desc       Check this user against the db via email and password
// @access     Public
router.post("/auth", async (req, res) => {
   const { email, password } = req.body; // destructuring to simplify code below, grabbing variables from req.body
   const loginEmailError = getLoginEmailError(email);
   const loginPasswordError = await getLoginPasswordError(password, email);
   console.log({ loginEmailError, loginPasswordError }); // this form of console logging makes it clear what it is
   let dbError = ""; // this will store some text describing an error from the database

   // if there are no errors
   if (loginEmailError === "" && loginPasswordError == "") {
      // return the user to the client
      db.query(selectUserByEmail, email)
         .then((users) => {
            const user = users[0]; // the user is the first user in the array of 1 item
            res.status(200).json({
               id: user.id,
               email: user.email,
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
      res.status(400).json({ loginEmailError, loginPasswordError });
   }
});

module.exports = router;
