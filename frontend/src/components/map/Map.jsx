import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";

function Map({ items }) {
  // Filter out items with invalid coordinates
  const validItems = items.filter(item => 
    item.latitude && 
    item.longitude && 
    !isNaN(parseFloat(item.latitude)) && 
    !isNaN(parseFloat(item.longitude))
  );

  // Use center of India or first valid item coordinates
  const mapCenter = validItems.length > 0 
    ? [parseFloat(validItems[0].latitude), parseFloat(validItems[0].longitude)]
    : [28.6139, 77.2090]; // Delhi, India as default

  return (
    <MapContainer
      center={mapCenter}
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validItems.map((item) => (
        <Pin key={item.id || item._id} item={item} />
      ))}
    </MapContainer>
  );
}

export default Map;