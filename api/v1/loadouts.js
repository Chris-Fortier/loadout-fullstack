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
const setLoadoutDescendantsStatus = require("../../queries/setLoadoutDescendantsStatus");
const selectLoadout = require("../../queries/selectLoadout");
const { getContentSummary } = require("../../utils/helpers");
const selectChildItems = require("../../queries/selectChildItems");
const selectLoadoutDescendants = require("../../queries/selectLoadoutDescendants");
const validateJwt = require("../../utils/validateJwt");
const insertUserLoadout = require("../../queries/insertUserLoadout");
const selectUserLoadoutByIds = require("../../queries/selectUserLoadoutByIds");
const deleteUserLoadoutsByLoadout = require("../../queries/deleteUserLoadoutsByLoadout");

// @route      POST api/v1/loadouts/insert (going to post one thing to this list of things)
// @desc       Create a new item
// @access     Public
// test: http://localhost:3060/api/v1/loadouts/insert?parentId=e109827f-4bfa-4384-9ac9-979776d2512b&name=newTestItem
router.post("/insert", async (req, res) => {
   const { parentId, newItemId } = req.query; // destructuring to simplify code below, grabbing variables from req.body
   console.log({ parentId, newItemId });
   // console.log("uuid", uuid.v4());

   // newItemId = uuid.v4();

   const newItem = {
      id: newItemId, // use the uuid generated client side
      name: "Untitled Item",
      parent_id: parentId, // use given value for parent
      status: 0, // default status to zero (unpacked)
      created_at: Date.now(), // set this date to now
      last_edit_at: Date.now(), // set this date to now
      last_pack_at: Date.now(), // set this date to now
   };

   db.query(insertItem, newItem)
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json(newItemId);
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
               numResolvedChildren: num_packed_children,
               numUnresolvedChildren: num_children - num_packed_children,
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
// test: http://localhost:3060/api/v1/loadouts/children?itemId=42655170-7e10-4431-8d98-c2774f6414a4
router.get("/children", validateJwt, (req, res) => {
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
               numResolvedChildren: num_packed_children,
               numUnresolvedChildren: num_children - num_packed_children,
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

// @route      GET api/v1/loadouts/select-descendants
// @desc       selects all the items descendants of an entire loadout or item
// @access     Public
// test: http://localhost:3060/api/v1/loadouts/select-descendants?itemId=41b9bde9-4731-44d2-b471-d46d21aca680
// test: http://localhost:3060/api/v1/loadouts/select-descendants?itemId=42655170-7e10-4431-8d98-c2774f6414a4 -- one-night camping trip loadout
router.get("/select-descendants", (req, res) => {
   // TODO: need to verify that they have permission to view this loadout

   db.query(selectLoadoutDescendants, [req.query.itemId])
      // db.query(setItemStatus, [req.query.itemId])
      .then((loadout) => {
         // add the top-level loadout item to the list too
         db.query(selectLoadout, [req.query.itemId])
            // db.query(setItemStatus, [req.query.itemId])
            .then((dbRes) => {
               loadout.push(dbRes[0]); // add the top-level loadout item

               // convert to camelCase
               const camelCaseLoadout = loadout.map((item) => {
                  return {
                     id: item.id,
                     name: item.name,
                     parentId: item.parent_id,
                     status: item.status,
                     createdAt: item.created_at,
                     lastEditAt: item.last_edit_at,
                     lastPackAt: item.last_pack_at,
                  };
               });

               console.log("items received", loadout.length);
               res.status(200).json(camelCaseLoadout);
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
});

// @route      POST api/v1/loadouts/set-descendants-status
// @desc       set the status of all an item's or loadout's descendants something
// @access     Public
// test: http://localhost:3060/api/v1/loadouts/set-descendants-status?newStatus=1&itemId=41b9bde9-4731-44d2-b471-d46d21aca680
router.post("/set-descendants-status", (req, res) => {
   db.query(setLoadoutDescendantsStatus, [
      req.query.newStatus,
      Date.now(),
      req.query.itemId,
   ])
      // db.query(setItemStatus, [req.query.itemId])
      .then((dbRes) => {
         console.log("dbRes", dbRes);
         res.status(200).json("loadout descendants status changed");
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json(err);
      });
});

// @route      PUT api/v1/loadouts/insert-loadout
// @desc       create a new loadout and user loadout with full permissions for the creator
//             this is all done on the server after a simple API call, all the API needs is the token of the creator
// @access     Private
// test: http://localhost:3060/api/v1/loadouts/insert-loadout
router.put("/insert-loadout", validateJwt, async (req, res) => {
   const userId = req.user.id; // get the user id from the validateJwt

   // first, make the new loadout

   loadoutId = uuid.v4();

   const loadout = {
      id: loadoutId, // use the uuid generated
      name: "Untitled Loadout", // use given value for parent
      parent_id: null, // loadouts have a parent of null
      status: 0, // default status to zero (unpacked)
      created_at: Date.now(), // set this date to now
      last_edit_at: Date.now(), // set this date to now
      last_pack_at: Date.now(), // set this date to now
   };

   console.log("will create this loadout: ", loadout);

   db.query(insertItem, loadout)
      .then((dbRes) => {
         console.log("dbRes", dbRes);

         // second, make the user loadout xref

         const userLoadout = {
            id: uuid.v4(), // generate a uuid
            user_id: userId,
            loadout_id: loadoutId,

            // give the user full permissions since they created it
            can_edit: 1,
            can_pack: 1,
            is_admin: 1,
         };

         console.log("will create this userLoadout: ", userLoadout);

         db.query(insertUserLoadout, userLoadout)
            .then((dbRes) => {
               res.status(200).json(loadoutId);
            })
            .catch((err) => {
               console.log("err", err);
               dbError = `${err.code} ${err.sqlMessage}`; // format the database error
               // return a 400 error to user
               res.status(400).json({ dbError });
            });

         // res.status(200).json(loadoutId); // return the id of the new loadout to the client
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json({ dbError });
      });
});

// @route      PUT api/v1/loadouts/delete-loadout
// @desc       Delete a loadout and all user loadouts associated with it
//                only if the provided user token has admin privledges
// @access     Private
// test:       http://localhost:3060/api/v1/loadouts/delete-loadout?loadoutId=244331be-05f0-4dd5-ad8e-dc279a74d2aa
router.put("/delete-loadout", validateJwt, async (req, res) => {
   const userId = req.user.id; // get the user id from the validateJwt
   const loadoutId = req.query.loadoutId;

   db.query(selectUserLoadoutByIds, [userId, loadoutId])
      .then((userLoadouts) => {
         // check if the user has access to this loadout
         if (userLoadouts.length === 1) {
            console.log("user has access to this loadout");
            // check if the user has admin permissions on this loadout
            if (userLoadouts[0].is_admin === 1) {
               console.log("user has admin permissions on this loadout");
               // delete all xref user loadouts that reference this loadout
               db.query(deleteUserLoadoutsByLoadout, [loadoutId])
                  .then((dbRes) => {
                     console.log("all user-loadouts of a loadout deleted");
                     // delete the loadout
                     db.query(deleteItem, [loadoutId])
                        .then((dbRes) => {
                           console.log("loadout deleted");
                           res.status(200).json(
                              "user-loadouts and loadout deleted"
                           );
                        })
                        .catch((err) => {
                           console.log("err", err);
                           res.status(400).json({ dbError });
                        });
                  })
                  .catch((err) => {
                     console.log("err", err);
                     res.status(400).json(err);
                  });
            } else {
               res.status(400).json(
                  "user does not have admin permisson on this loadout"
               );
            }
         } else {
            res.status(400).json(
               "user does not have access to this loadout or the loadout doesn't exist"
            );
         }
      })
      .catch((err) => {
         console.log("err", err);
         res.status(400).json({ err });
      });

   // const { itemId } = req.query; // destructuring to simplify code below, grabbing variables from req.body
   // console.log({ itemId });
});

module.exports = router;
