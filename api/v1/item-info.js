// The item info resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectItemInfo = require("../../queries/selectItemInfo"); // change this

// @route      GET api/v1/item-info (http://localhost:3045/api/v1/item-info)  // change this
// @desc       Get all data and derived data for a given item
// @access     Public
router.get("/", (req, res) => {
   console.log(req.query);

   // put the query into some consts
   const itemId = req.query.itemId;

   // change this
   // db.query(selectItemInfo(itemId))
   // https://www.npmjs.com/package/mysql#escaping-query-values
   db.query(selectItemInfo, [
      itemId,
      itemId,
      itemId,
      itemId,
      itemId,
      itemId,
      itemId,
   ]) // this syntax style prevents hackers
      .then((itemInfo) => {
         // successful response
         // console.log(itemInfo);

         // we need to convert the names of our data from database-side snake_case to camelCase
         // we can also use this to "shape the data" for the client
         // this is where we can "shrink out payload", the data we sent to the client
         const camelCaseItemInfo = itemInfo.map((item) => {
            // for every item, return a new object
            const numUnpackedChildren =
               item.num_children - item.num_packed_children;
            let contentSummaryText;
            if (numUnpackedChildren > 0) {
               contentSummaryText = numUnpackedChildren + " left";
            } else if (!item.isPacked) {
               contentSummaryText = "ready";
            } else {
               contentSummaryText = "";
            }

            return {
               name: item.name,
               status: item.status,
               id: item.id,
               parentName: item.parent_name,
               parentId: item.parent_id,
               numChildren: item.num_children,
               numPackedChildren: item.num_packed_children,
               numUnpackedChildren: numUnpackedChildren,
               contentSummaryText: contentSummaryText,
            };
         });

         res.json(camelCaseItemInfo);
      })
      .catch((err) => {
         // report error
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
