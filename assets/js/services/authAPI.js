import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Requete http d'authentification et stockage du token dans le storage et sur axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Stockage du token en local storage
      window.localStorage.setItem("authToken", token);

      // On previent axios qu'on a maintenant un header par defaut sur toutes nos futures requetes http
      setAxiosToken(token);

      return true;
    });
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token Le token Jwt
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  // Voir si on a un token
  const token = window.localStorage.getItem("authToken");

  // Si le token est valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 *
 */
function isAuthenticated() {
  // Voir si on a un token
  const token = window.localStorage.getItem("authToken");

  // Si le token est valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
