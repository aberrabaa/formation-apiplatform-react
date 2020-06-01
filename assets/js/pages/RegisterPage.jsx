import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import usersApi from "../services/usersApi";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // gestion du changement des ipmputs dans les formulaires
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiErrors = { ...errors };
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme à votre mot de passe original";
      setErrors(apiErrors);
      return;
    }
    try {
      await usersApi.register(user);
      // TODO FLASH succes
      setErrors({});
      history.replace("/login");
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
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre joli prénom"
          value={user.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Votre nom de famille"
          value={user.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="email"
          label="Adresse Email"
          placeholder="Votre adresse email"
          type="email"
          value={user.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          value={user.password}
          onChange={handleChange}
          type="password"
          error={errors.password}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation de mot de passe"
          placeholder="Confirmer votre super mot de passe"
          value={user.passwordConfirm}
          onChange={handleChange}
          type="password"
          error={errors.passwordConfirm}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai deja un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
