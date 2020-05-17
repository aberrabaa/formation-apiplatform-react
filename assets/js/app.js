// Les imports importants
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import { HashRouter, Switch, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";

// On ajoute notre css personnalisé
import "../css/app.css";

console.log("Hello Webpack Encore! Edit me in assets/js/app.js");

const App = () => {
  return (
    <HashRouter>
      <Navbar />
      <main className="container pt-5">
        <Switch>
          <Route path="/customers" component={CustomersPage} />
          <Route path="/invoices" component={InvoicesPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </HashRouter>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
