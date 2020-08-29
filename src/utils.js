import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function getExpiryTime(token) {
  let tokenData = jwtDecode(token);
  if (!!tokenData && tokenData.exp) {
    return new Date(tokenData.exp * 1000);
  }
  return null;
}

export function isTokenExpired(token) {
  try {
    let expTime = getExpiryTime(token);
    if (!!expTime) {
      return new Date() > expTime;
    } else {
      return false;
    }
  } catch (e) {
    console.error("Failed to check token data", e);
  }
  // assume token is invalid on failed decode
  return true;
}

export function clearToken() {
  cookies.remove("token", { path: "/" });
}

export function loadToken() {
  let token = cookies.get("token");
  if (!token) return null;
  else if (isTokenExpired(token)) {
    clearToken();
    return null;
  } else {
    return token;
  }
}

export function storeToken(token) {
  let options = { sameSite: "strict", path: "/" };
  cookies.set("token", token, options);
}
