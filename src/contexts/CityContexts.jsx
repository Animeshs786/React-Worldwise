import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CityContext = createContext();
const BASE_URL = "http://localhost:9000";

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null };
    case "cities/loading":
      return { ...state, loading: false, cities: action.payload };
    case "city/loading":
      return { ...state, loading: false, currentCities: action.payload };
    case "city/create":
      return {
        ...state,
        loading: false,
        cities: [...state.cities, action.payload],
        currentCities: action.payload,
      };
    case "city/delete":
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== +action.payload),
        currentCities: {},
      };
    case "error":
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error("Something went wrong!");
  }
}
const initialState = {
  cities: [],
  loading: false,
  currentCities: {},
  error: null,
};

function CityProvider({ children }) {
  const [{ cities, loading, currentCities, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loading", payload: data });
      } catch (err) {
        dispatch({ type: "error", payload: err.message });
        console.log(err.message);
      }
    }
    fetchCities();
  }, []);

  const currentCitiesHandler = useCallback(async function (id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loading", payload: data });
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
      console.log(err.message);
    }
  }, []);

  async function createCity(city) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(city),
      });
      const data = await res.json();
      dispatch({ type: "city/create", payload: data });
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
      console.log(err.message);
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/delete", payload: id });
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
      console.log(err.message);
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        loading,
        currentCities,
        currentCitiesHandler,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error("Context use outside the City Context");
  return context;
}

export { CityProvider, useCity };
