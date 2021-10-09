import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// import Admin from "./pages/admin/Admin";
import Login from "./pages/login/Login";
// import AuthRoute from "./pages/common/AuthRouter";
import "./style/main.scss";
import 'react-toastify/dist/ReactToastify.css';
import AuthRoute from "./pages/common/AuthRouter";
import Admin from "./pages/admin/Admin";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route exact path="/">
            { <AuthRoute component={Admin} redirectTo={"/login"}></AuthRoute> }
          </Route>
          <Route exact path="/login">
            <Login></Login>
          </Route>
        </Switch>
      </Router>
      <ToastContainer />
    </Fragment>
  );
}

export default App;