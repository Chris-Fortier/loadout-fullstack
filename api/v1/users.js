// The users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUser = require("../../queries/selectUser");
const insertUser = require("../../queries/insertUser");
const { toJson, toSafeParse, toHash } = require("../../utils/helpers");

// @route      GET api/v1/users
// @desc       Get a valid user via email and password
// @access     Public
router.post("/", async (req, res) => {
   const user = {
      id: req.body.id,
      email: req.body.email,
      password: await toHash(req.body.password), // hash the password (npm install bcrypt)
      created_at: req.body.createdAt,
   };

   db.query(insertUser, user)
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         // return the user data to we can put in redux store
      })
      .catch((err) => {
         console.log("err", err);
         // return a 400 error to user
      });
}); // this is an express function

// @route      POST api/v1/users (going to post one thing to this list of things)
// @desc       Creat a new user
// @access     Public
router.post("/", async (req, res) => {
   const user = req.body;
   // hash the password
   // npm install bcrypt
   const newPassword = await toHash(user.password);
   user.password = newPassword;
   console.log(user);
}); // this is an express function

module.exports = router;
