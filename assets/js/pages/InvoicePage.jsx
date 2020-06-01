import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import customersAPI from "../services/customersAPI";
import axios from "axios";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });

  // Recuperation des clients
  const fetchCustomer = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      history.replace("/invoices");
      // TODO Flash notification erreur
    }
  };

  // Recuperation d'une facture
  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await invoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      // TODO notification erreur
      history.replace("/invoices");
    }
  };
  // Recuperation de la liste des clients à chaque chargement du composant
  useEffect(() => {
    fetchCustomer();
  }, []);

  // Recuperation de la bonne facture client quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  // gestion du changement des ipmputs dans les formulaires
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
        // Flash notification succes
      } else {
        await invoicesAPI.create(invoice);
        // TODO : Flash notification succes
        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);

        // TODO : Flash notification d'ereurs
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Creation d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />

        <Select
          name="customer"
          label="Client"
          onChange={handleChange}
          value={invoice.customer}
          error={errors.customer}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName}
              {customer.lastName}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="Status"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
