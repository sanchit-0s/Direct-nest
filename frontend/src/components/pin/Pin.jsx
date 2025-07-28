import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  const lat = parseFloat(item.latitude);
  const lng = parseFloat(item.longitude);

  // Don't render if coordinates are invalid
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }

  return (
    <Marker position={[lat, lng]}>
      <Popup>
        <div className="popupContainer">
          <img src={item.img} alt="" />
          <div className="textContainer">
            <Link to={`/post/${item.id || item._id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>₹ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;