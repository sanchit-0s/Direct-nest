import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, createOrGetChat, toggleSavePost } from "../../lib/api";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";

import "./singlePage.scss";
import { useAuth } from "../../context/AuthContext";

function SinglePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSendMessage = async () => {
    if (!user) {
      alert("Please log in to send a message");
      navigate("/login");
      return;
    }

    if (user._id === post.userId._id) {
      alert("You cannot send a message to yourself");
      return;
    }

    try {
      const chat = await createOrGetChat(post.userId._id);
      navigate("/profile", { state: { activeChatId: chat._id } });
    } catch (error) {
      console.error("Error creating/getting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  const handleSavePost = async () => {
    if (!user) {
      alert("Please log in to save posts");
      navigate("/login");
      return;
    }

    try {
      const response = await toggleSavePost(id);
      setIsSaved(response.isSaved);
      alert(response.message);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const images = post?.images || [];

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={images.length > 0 ? images : ["https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">₹ {post.price}</div>
              </div>
              <div className="user">
                <img
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt=""
                />
                <span>{post.userId?.username || "Unknown User"}</span>
              </div>
            </div>
            <div className="bottom">{post.description}</div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                <p>{post.utilities === 'owner' ? 'Owner is responsible' : 
                     post.utilities === 'tenant' ? 'Tenant is responsible' : 'Shared'}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>{post.pet === 'allowed' ? 'Pets Allowed' : 'Pets Not Allowed'}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom{post.bathroom > 1 ? 's' : ''}</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{post.school}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[{
              id: post._id,
              latitude: post.latitude,
              longitude: post.longitude,
              title: post.title
            }]} />
          </div>
          <div className="buttons">
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button onClick={() => navigate(`/payment/${id}`)}>
              <img src="/fee.png" alt="" />
              Make Payment
            </button>
            <button onClick={handleSavePost}>
              <img src="/save.png" alt="" />
              {isSaved ? "Remove from Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>

      </div>
  );
}

export default SinglePage;