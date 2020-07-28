import React from "react";
import "./style/master.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
// import AllKits from "./components/pages/AllKits";
import NotFound from "./components/pages/NotFound";
import LoadoutList from "./components/pages/LoadoutList";
import LoadoutSharing from "./components/pages/LoadoutSharing";
import StyleTester from "./components/pages/StyleTester";
import AccountSettings from "./components/pages/AccountSettings";
import ItemList from "./components/pages/ItemList";
import Presentation from "./components/pages/Presentation";
import jwtDecode from "jwt-decode";
import store from "./store/store";
import actions from "./store/actions";
import axios from "axios";
import { refreshPeriodically } from "./utils/movePageToDifferentItem";

const authTokenLoadout = localStorage.authTokenLoadout; // get the auth token from local storage
if (authTokenLoadout) {
   const currentTimeInSec = Date.now() / 1000;
   const user = jwtDecode(authTokenLoadout);
   if (currentTimeInSec > user.exp) {
      console.log("expired token");

      // remove the currentUser from the global state / redux store
      store.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: {},
      });

      // remove the default headers
      delete axios.defaults.headers.common["x-auth-token"];
   } else {
      // authToken is not expired

      console.log("valid token");

      // store the user in global state / redux store (currentUser)
      store.dispatch({
         type: actions.UPDATE_CURRENT_USER,
         payload: user,
      });

      // set authorization headers for every request
      axios.defaults.headers.common["x-auth-token"] = authTokenLoadout;

      // redirect to create-answer, this is in an if statement so it won't keep refereshing forever
      if (window.location.pathname === "/") {
         window.location.href = "/loadout-list"; // so if the user goes to our website with a valid token, they will go here
      }
   }
} else {
   console.log("no token");

   // remove the default headers in the off chance they exist for some reason
   delete axios.defaults.headers.common["x-auth-token"];
}

// start the refresh function
// refreshPeriodically(5000);

function App() {
   // I think these declare different urls as differnt React components under the hood
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/loadout-list" component={LoadoutList} />
            <Route exact path="/loadout-sharing" component={LoadoutSharing} />
            <Route exact path="/style-tester" component={StyleTester} />
            <Route exact path="/account-settings" component={AccountSettings} />
            <Route exact path="/item-list" component={ItemList} />
            <Route exact path="/presentation" component={Presentation} />
            <Route component={NotFound} />
         </Switch>
      </Router>
   );
}

export default App;
