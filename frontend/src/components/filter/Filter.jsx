
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./filter.scss";

function Filter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  const [query, setQuery] = useState({
    location: params.get("location") || "",
    type: params.get("type") || "",
    property: params.get("property") || "",
    minPrice: params.get("min") || "",
    maxPrice: params.get("max") || "",
    bedroom: params.get("bedroom") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    
    if (query.location) searchParams.set("location", query.location);
    if (query.type) searchParams.set("type", query.type);
    if (query.property) searchParams.set("property", query.property);
    if (query.minPrice) searchParams.set("min", query.minPrice);
    if (query.maxPrice) searchParams.set("max", query.maxPrice);
    if (query.bedroom) searchParams.set("bedroom", query.bedroom);
    
    navigate(`/list?${searchParams.toString()}`);
  };

  return (
    <div className="filter">
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="location"
            placeholder="City Location"
            value={query.location}
            onChange={handleChange}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bottom">
          <div className="item">
            <label htmlFor="type">Type</label>
            <select 
              name="type" 
              id="type" 
              value={query.type} 
              onChange={handleChange}
            >
              <option value="">any</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="property">Property</label>
            <select 
              name="property" 
              id="property" 
              value={query.property} 
              onChange={handleChange}
            >
              <option value="">any</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="any"
              value={query.minPrice}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="any"
              value={query.maxPrice}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="bedroom">Bedroom</label>
            <input
              type="number"
              id="bedroom"
              name="bedroom"
              placeholder="any"
              value={query.bedroom}
              onChange={handleChange}
            />
          </div>
          <button type="submit">
            <img src="/search.png" alt="" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Filter;
