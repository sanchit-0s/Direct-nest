
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllPosts } from "../../lib/api";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";

function ListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const locationParam = params.get("location")?.toLowerCase() || "";
  const min = parseInt(params.get("min")) || 0;
  const max = parseInt(params.get("max")) || Infinity;
  const type = params.get("type") || "";
  const property = params.get("property") || "";
  const bedroom = params.get("bedroom") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("List page: Fetching ALL posts from database...");
        const data = await getAllPosts();
        console.log("List page: Fetched all posts count:", data.length);
        console.log("List page: Posts data:", data);
        setPosts(data);
      } catch (error) {
        console.error("List page: Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  const filteredData = posts.filter((item) => {
    const addressMatch = item.address.toLowerCase().includes(locationParam);
    const priceMatch = item.price >= min && item.price <= max;
    const typeMatch = type === "" || item.type === type;
    const propertyMatch = property === "" || item.property === property;
    const bedroomMatch = bedroom === "" || item.bedroom?.toString() === bedroom;
    return addressMatch && priceMatch && typeMatch && propertyMatch && bedroomMatch;
  });

  // Convert posts to format expected by Map component
  const mapItems = filteredData.map(post => ({
    id: post._id,
    latitude: post.latitude,
    longitude: post.longitude,
    title: post.title,
    img: post.images.length > 0 ? post.images[0] : "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    bedroom: post.bedroom,
    price: post.price
  }));

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <Card 
                key={item._id} 
                item={{
                  id: item._id,
                  title: item.title,
                  img: item.images.length > 0 ? item.images[0] : "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  bedroom: item.bedroom,
                  bathroom: item.bathroom,
                  price: item.price,
                  address: item.address,
                  latitude: item.latitude,
                  longitude: item.longitude
                }} 
              />
            ))
          ) : (
            <p>No results found for your search.</p>
          )}
        </div>
      </div>
      <div className="mapContainer">
        <Map items={mapItems} />
      </div>
    </div>
  );
}

export default ListPage;

