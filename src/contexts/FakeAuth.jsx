import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "login":
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticate: true,
      };
    case "logout":
      return { ...state, loading: false, user: {}, isAuthenticate: false };
    case "error":
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error("Something went wrong !");
  }
}
const initialState = {
  loading: false,
  user: {},
  isAuthenticate: false,
  error: null,
};

function AuthProvider({ children }) {
  const [{ loading, user, isAuthenticate }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    dispatch({ type: "loading" });
    if (!email || !password) throw new Error("All field are required.");
    if (email !== FAKE_USER.email || password !== FAKE_USER.password)
      throw new Error("Email and password are incorrect");

    dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        loading,
        user,
        isAuthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth are called outside the AuthProvider.");
  return context;
}

export { AuthProvider, useAuth };
