// Les imports importants
import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import {
  HashRouter,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";

// On ajoute notre css personnalisé
import "../css/app.css";

authAPI.setup();
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.isAuthenticated()
  );

  const NavBarWithRouter = withRouter(Navbar);

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
  };

  console.log(isAuthenticated);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <HashRouter>
        <NavBarWithRouter />
        <main className="container pt-5">
          <Switch>
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute path="/customers" component={CustomersPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
