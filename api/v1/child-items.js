// The child items resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectChildItems = require("../../queries/selectChildItems");
const { getContentSummary } = require("../../utils/helpers");

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
         const camelCaseChildItems = childItems.map((item) => {
            // for every item, return a new object

            // this is a hack because I can't get my query to get zeros instead of nulls if the count is zero
            // TODO duplicated code
            let num_children = item.num_children;
            if (num_children === null) num_children = 0;
            let num_packed_children = item.num_packed_children;
            if (num_packed_children === null) num_packed_children = 0;

            return {
               name: item.name,
               status: item.status,
               id: item.id,
               numChildren: num_children,
               numPackedChildren: num_packed_children,
               numUnpackedChildren: num_children - num_packed_children,
               contentSummary: getContentSummary(
                  num_children,
                  num_packed_children,
                  item.status
               ),
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
