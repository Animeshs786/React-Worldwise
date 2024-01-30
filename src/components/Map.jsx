import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useCity } from "../contexts/CityContexts";
import Button from "./Button";
import { useGeolocation } from "../hooks/useGeolocation";
import { useEffect, useState } from "react";
import { usePosition } from "../hooks/usePosition";

function Map() {
  const [mapPosition, setMapPosition] = useState({
    lat:25.197525,
    lng:55.274288,
  });
  const { cities } = useCity();
  const [lat,lng]=usePosition();
  

  useEffect(() => {
    if (lat && lng) setMapPosition({ lat, lng });
  }, [lat, lng]);

  const {
    isLoading: isGeolocationLoading,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(()=>{
   if(geoLocationPosition) setMapPosition({lat:geoLocationPosition.lat,lng:geoLocationPosition.lng});
  },[geoLocationPosition]);


  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isGeolocationLoading ? "Loading..." : "Current Location"}
        </Button>
      )}
      <MapContainer
        center={[mapPosition.lat, mapPosition.lng]}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <MapRenderComponent position={mapPosition} />
        <MapEventComponent />
      </MapContainer>
    </div>
  );
}

function MapRenderComponent({ position }) {
  const map = useMap();
  map.setView([position.lat, position.lng]);
  return null;
}

function MapEventComponent() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      const { latlng } = e;
      navigate(`form?lat=${latlng.lat}&lng=${latlng.lng}`);
    },
  });

  return null;
}

export default Map;
