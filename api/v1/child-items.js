// The child items resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectChildItems = require("../../queries/selectChildItems"); // change this

// @route      GET api/v1/child-items (http://localhost:3045/api/v1/child-items)  // change this
// @desc       Get all user loadouts for a user
// @access     Public
router.get("/", (req, res) => {
   console.log(req.query);
   const itemId = req.query.itemId; // put the query into some consts

   // change this
   // db.query(selectChildItems(itemId))
   // https://www.npmjs.com/package/mysql#escaping-query-values
   db.query(selectChildItems, [itemId]) // this syntax style prevents hackers
      .then((childItems) => {
         // successful response
         // console.log(childItems);

         // we need to convert the names of our data from database-side snake_case to camelCase
         // we can also use this to "shape the data" for the client
         // this is where we can "shrink out payload", the data we sent to the client
         // I suspect this is where I am going to convert flattened loadouts to nested
         const camelCaseChildItems = childItems.map((userLoadout) => {
            // for every userLoadout, return a new object
            return {
               name: userLoadout.name,
               status: userLoadout.status,
            };
         });

         res.json(camelCaseChildItems);
      })
      .catch((err) => {
         // report error
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
