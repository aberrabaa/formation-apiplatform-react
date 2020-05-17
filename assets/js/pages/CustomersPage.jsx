import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import customersAPI from "../services/customersAPI";

const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Permet d'aller récupérer les customers
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Au chargement du composant on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Gestion de la suppression d'un customer
  const handleDelete = async (id) => {
    // Ici on va mixer l'approche optimiste (on supprime de la liste tout de suite meme si la requete de suppression
    // est toujours en cours) et pessimiste (on ne supprime de la liste qu'une fois la requete terminee)
    // en créant une copie du tableau des customers au début, afin d'être en mesure de le remettre si
    // finalement la suppression côté API echouait.

    // Copie de la liste des customers
    const originalCustomers = [...customers];

    // Approche optimiste
    setCustomers(customers.filter((customer) => customer.id !== id));

    try {
      await customersAPI.delete(id);
      console.log("ok");
    } catch (error) {
      setCustomers(originalCustomers);
      console.log(error.response);
    }

    /* Methode vu debut de formation (attention enlever egalement le async lors de l'appel)
    customersAPI
      .delete(id)
      .then((response) => console.log("ok"))
      .catch((error) => {
        setCustomers(originalCustomers);
        console.log(error.response);
      });
      */
  };

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  // Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  // Filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  //Pagination des données.
  const paginatedCustomers =
    filteredCustomers.length > itemsPerPage
      ? Pagination.getData(filteredCustomers, currentPage, itemsPerPage)
      : filteredCustomers;

  return (
    <>
      <h1>Liste des clients</h1>
      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher ..."
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {paginatedCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="#">
                  {customer.firstName} {customer.lastName}
                </a>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td className="text-center">
                <span className="badge badge-light">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()} €
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
