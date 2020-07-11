// The loadouts resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const uuid = require("uuid");
const insertItem = require("../../queries/insertItem");
const deleteItem = require("../../queries/deleteItem");
const setItemName = require("../../queries/setItemName");
const setItemStatus = require("../../queries/setItemStatus");
const selectItemInfo = require("../../queries/selectItemInfo");
const { getContentSummary } = require("../../utils/helpers");
const selectChildItems = require("../../queries/selectChildItems");

// @route      POST api/v1/loadouts/insert (going to post one thing to this list of things)
// @desc       Create a new item
// @access     Public
// test: http://localhost:3060/api/v1/loadouts/insert?parentId=e109827f-4bfa-4384-9ac9-979776d2512b&name=newTestItem
router.post("/insert", async (req, res) => {
   const { parentId, name } = req.query; // destructuring to simplify code below, grabbing variables from req.body
   console.log({ parentId, name });
   // console.log("uuid", uuid.v4());

   const newItem = {
      id: uuid.v4(), // generate a uuid
      name: name, // use given value for parent
      parent_id: parentId, // use given value for parent
      status: 0, // default status to zero (unpacked)
      created_at: Date.now(), // set this date to now
      last_edit_at: Date.now(), // set this date to now
      last_pack_at: Date.now(), // set this date to now
   };

   db.query(insertItem, newItem)
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("New item created");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json({ dbError });
      });
});

// @route      POST api/v1/loadouts/delete
// @desc       Delete an existing item
// @access     Public
// test: http://localhost:3060/api/v1/loadouts/delete?itemId=089abe6c-4f07-4a6e-b8b5-290333335251
router.post("/delete", async (req, res) => {
   const { itemId } = req.query; // destructuring to simplify code below, grabbing variables from req.body
   console.log({ itemId });

   db.query(deleteItem, [itemId])
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("Item deleted");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json({ dbError });
      });
});

// @route      POST api/v1/loadouts/set-name
// @desc       Rename the item
// @access     Public
// test: http://localhost:3060/api/v1/loadouts/set-name?itemId=0674f34b-f0d8-4eac-bbc1-213d37acdf3f&newName=sleepwear7
router.post("/set-name", (req, res) => {
   console.log("set-name called", [
      req.query.newName,
      Date.now(),
      req.query.itemId,
   ]);

   db.query(setItemName, [req.query.newName, Date.now(), req.query.itemId])
      // db.query(setItemName, [req.query.itemId])
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("Item name changed");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json(err);
      });
});

// @route      POST api/v1/loadouts/set-status
// @desc       set the status to something
// @access     Public
// test: http://localhost:3060/api/v1/loadouts/set-status?newStatus=1&itemId=0674f34b-f0d8-4eac-bbc1-213d37acdf3f
router.post("/set-status", (req, res) => {
   console.log("set-status called", [
      req.query.newStatus,
      Date.now(),
      req.query.itemId,
   ]);

   db.query(setItemStatus, [req.query.newStatus, Date.now(), req.query.itemId])
      // db.query(setItemStatus, [req.query.itemId])
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("Item status changed");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json(err);
      });
});

// @route      GET api/v1/loadouts/info
// @desc       Get all data and derived data for a given item
// @access     Public
// test:
router.get("/info", (req, res) => {
   console.log("req.query", req.query);

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
               parentName: item.parent_name,
               parentId: item.parent_id,
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

         res.json(camelCaseItemInfo);
      })
      .catch((err) => {
         // report error
         console.log(err);
         res.status(400).json(err);
      });
});

// @route      GET api/v1/loadouts/children
// @desc       Get all the child items of an item
// @access     Public
router.get("/children", (req, res) => {
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
               parentId: item.parent_id,
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
