import axios from "axios";

function getApiHost() {
  if (!!document.location.hostname.match(/localhost/)) {
    return "http://localhost:8080";
  }
  return "https://api.auxify.reidswan.com";
}

const HOST = getApiHost(); // TODO make this configurable

export function get(route, token, config = {}) {
  if (!!token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  let actualRoute = route.startsWith("/") ? route : "/" + route;
  return axios.get(`${HOST}${actualRoute}`, config);
}

export function post(route, body, token, config = {}) {
  if (!!token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  let actualRoute = route.startsWith("/") ? route : "/" + route;
  return axios.post(`${HOST}${actualRoute}`, body, config);
}

export function put(route, body, token, config = {}) {
  if (!!token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  let actualRoute = route.startsWith("/") ? route : "/" + route;
  return axios.put(`${HOST}${actualRoute}`, body, config);
}

export default { get, post, put };
