import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";
import SecureLS from "secure-ls";

const config = {
  encodingType: "des",
  isCompression: true,
  encryptionSecret: "my-secret-key",
};

const ls = new SecureLS(config);

const initialState = {
  user: null,
};

const localStore = {
  get: (item) => ls.get(item),
  set: (item, data = {}) => ls.set(item, data),
  remove: (item) => ls.remove(item),
  removeAll: () => ls.removeAll(),
};

if (ls.get("userData")) {
  // const userData = ls.get("userData");
  const userData = localStore.get("userData");
  const decodedToken = jwtDecode(userData.token);

  if (decodedToken.exp * 1000 < Date.now()) {
    ls.removeAll();
  } else {
    initialState.user = userData;
  }
}

const AuthContext = createContext({
  user: null,
  login: (data) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    // ls.set("userData", userData);
    localStore.set("userData", userData);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    // ls.removeAll();
    localStore.removeAll();
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider, localStore };
