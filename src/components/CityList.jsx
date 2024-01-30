import { useCity } from "../contexts/CityContexts";

import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CityItem from "./CityItem";

function CityList() {
  const {loading,cities}=useCity();
  if (loading) return <Spinner />;
  if (!cities.length) return <Message message="NO cities found yet!" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((cities, index) => (
        <CityItem cities={cities} key={index} />
      ))}
    </ul>
  );
}

export default CityList;
