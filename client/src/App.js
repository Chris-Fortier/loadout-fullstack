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
            <Route component={NotFound} />
         </Switch>
      </Router>
   );
}

export default App;
