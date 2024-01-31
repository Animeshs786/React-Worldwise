import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCity } from "../contexts/CityContexts";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ cities }) {
  const { currentCities, deleteCity, loading } = useCity();
  const { cityName, emoji, date, id, position } = cities;
  function removeCityHandler(e) {
    e.preventDefault();
    deleteCity(id);
  }
  if (loading) return <Spinner />;
  
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCities?.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button onClick={removeCityHandler} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
