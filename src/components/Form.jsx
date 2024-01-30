// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { usePosition } from "../hooks/usePosition";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCity } from "../contexts/CityContexts";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");
  const [countryCode, setContryCode] = useState(null);
  const navigate = useNavigate();

  const [mapLat, mapLng] = usePosition();
  const { createCity, loading } = useCity();

  useEffect(() => {
    async function fetchCity() {
      try {
        setMapError("");
        setIsMapLoading(true);
        const res = await fetch(
          `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
        );
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "You choose the wrong place in the map.Please choose the somewhere else 🗺"
          );
        setCityName(data.cityName || data.locality || "");
        setCountry(data.countryName);
        setContryCode(data.countryCode);
      } catch (err) {
        setMapError(err.message);
      } finally {
        setIsMapLoading(false);
      }
    }
    fetchCity();
  }, [mapLat, mapLng]);

  async function createCityHandler(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji: countryCode,
      date,
      notes,
      position: { lat: mapLat, lng: mapLng },
    };
    await createCity(newCity);
    navigate("/app");
  }

  if (isMapLoading) return <Spinner />;
  if (mapError) return <Message message={mapError} />;

  return (
    <form
      className={`${styles.form} ${loading ? styles.loading : ""}`}
      onSubmit={createCityHandler}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{ convertToEmoji(countryCode)}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
