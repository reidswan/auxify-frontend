export const REDIRECT = "REDIRECT";

export function redirect(to) {
  return {
    type: REDIRECT,
    location: to,
  };
}

export function asyncActionsCreator(prefix) {
  let BEGIN = `${prefix}_BEGIN`;
  let SUCCESS = `${prefix}_SUCCESS`;
  let FAILURE = `${prefix}_FAILURE`;
  let CLEAR = `${prefix}_CLEAR`;

  let begin = () => {
    return {
      type: BEGIN,
    };
  };

  let success = (data) => {
    return {
      type: SUCCESS,
      data: data,
    };
  };

  let failure = (err) => {
    return {
      type: FAILURE,
      err: err,
    };
  };

  let clear = () => {
    return { type: CLEAR };
  };

  return {
    BEGIN,
    SUCCESS,
    FAILURE,
    CLEAR,
    begin,
    success,
    failure,
    clear,
  };
}

export function hasStatusCode(error, code) {
  return !!error && !!error.response && error.response.status === code;
}

export function isNotFoundError(error) {
  return hasStatusCode(error, 404);
}

export function isForbiddenError(error) {
  return hasStatusCode(error, 403);
}
