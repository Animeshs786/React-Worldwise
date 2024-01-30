import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCity } from "../contexts/CityContexts";

function CountryList() {
  const {loading,cities}=useCity();
  if (loading) return <Spinner />;
  if (!cities.length) return <Message message="NO cities found yet!" />;

    const countries=cities.reduce((accumulator, currentValue) => {
        if(!accumulator.some((item)=>item.country===currentValue.country)){
            accumulator=[...accumulator,{country:currentValue.country,emoji:currentValue.emoji}]
        }
        return accumulator;
    },[]);

  return (
    <ul className={styles.countryList}>
       {countries.map((country, index) => (
        <CountryItem country={country} key={index} />
      ))}
    </ul>
  );
}

export default CountryList;
