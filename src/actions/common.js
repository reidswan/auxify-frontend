export const REDIRECT = "REDIRECT";

export function redirect(to) {
  return {
    "type": REDIRECT,
    "location": to
  }
}

export function asyncActionsCreator(prefix) {
  let BEGIN = `${prefix}_BEGIN`;
  let SUCCESS = `${prefix}_SUCCESS`;
  let FAILURE =`${prefix}_FAILURE`;

  let begin = () => {
    return {
      "type": BEGIN
    }
  };

  let success = (data) => {
    return {
      "type": SUCCESS,
      "data": data
    }
  };

  let failure = (err) => {
    return {
      "type": FAILURE,
      "err": err
    }
  };

  return {
    BEGIN, SUCCESS, FAILURE, begin, success, failure
  }
}
