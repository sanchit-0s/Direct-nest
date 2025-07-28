

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.scss";

const types = ["buy", "rent"];

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    type: "buy",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      type: query.type,
      location: query.location,
      min: query.minPrice || 0,
      max: query.maxPrice || 100000000,
    });
    navigate(`/list?${params.toString()}`);
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="location"
          placeholder="City Location"
          value={query.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          placeholder="Min Price"
          value={query.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={handleChange}
        />
        <button type="submit">
          <img src="/search.png" alt="search" />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
