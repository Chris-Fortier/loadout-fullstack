const express = require("express");
var cors = require("cors");
const app = express();
const path = require("path");

app.use(cors());

app.use(express.json());

// redirect from http to https
// https://jaketrent.com/post/https-redirect-node-heroku/
if (process.env.NODE_ENV === "production") {
   app.use((req, res, next) => {
      if (req.header("x-forwarded-proto") !== "https")
         res.redirect(`https://${req.header("host")}${req.url}`);
      else next();
   });
}

// app.use((req, res, next) => {
//    res.redirect(`google.com`);
// });

// need one of these for every url route

// app.use(route, require(file));
app.use("/api/v1/users", require("./api/v1/users"));
app.use("/api/v1/user-loadouts", require("./api/v1/user-loadouts"));
app.use("/api/v1/loadout-users", require("./api/v1/loadout-users"));
app.use("/api/v1/loadouts", require("./api/v1/loadouts"));

// if none of the routes are hit ("*"), use what's in the build folder
// for loadout, since the client folder is one level up from the server folder, the paths need to be changed
// is this relative to the folder server.js is in or relative to the root of the repo?
app.use(express.static("client/build"));
app.get("*", (req, res) => {
   // "*" is a wildcard
   res.sendFile(path.resolve(__dirname, "client", "build", "index.html")); // __dirname means present directory
});

const port = process.env.PORT || 3060; // use the variable we have for the port or a default port of 3060
app.listen(port, () =>
   console.log(`Server running at listening at http://localhost:${port}`)
);

// go to http://localhost:3060/api/v1/users to see the user object
