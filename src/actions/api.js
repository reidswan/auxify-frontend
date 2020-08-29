import axios from "axios";

const HOST = "http://localhost:8080"; // TODO make this configurable

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

export default { get, post };
