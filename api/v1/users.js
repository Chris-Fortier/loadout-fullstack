// The users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUser = require("../../queries/selectUser");
// const { toJson, toSafeParse } = require("../../utils/helpers");

// @route      GET api/v1/users
// @desc       Get a valid user via email and password
// @access     Public
router.get("/", (req, res) => {
   const { email, password } = req.query; // put the query into some consts (destructoring es6)
   db.query(selectUser, [email, password]) // this syntax style prevents hackers
      .then((users) => {
         // successful response
         // console.log(users);

         // we need to convert the names of our data from database-side snake_case to camelCase
         // we can also use this to "shape the data" for the client
         // this is where we can "shrink out payload", the data we sent to the client
         // I suspect this is where I am going to convert flattened loadouts to nested
         const camelCaseUsers = users.map((user) => {
            // for every user, return a new object
            return {
               id: user.id,
               email: user.email,
               createdAt: user.created_at,
            };
         });

         res.json(camelCaseUsers);
      })
      .catch((err) => {
         // report error to the user
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
