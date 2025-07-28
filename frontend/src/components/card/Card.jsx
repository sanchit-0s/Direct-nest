import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrGetChat } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import "./card.scss";

function Card({ item }) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const defaultImage =
    "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  let imageUrl = defaultImage;

  if (
    item.images &&
    Array.isArray(item.images) &&
    item.images.length > 0 &&
    typeof item.images[0] === "string" &&
    item.images[0].startsWith("http")
  ) {
    imageUrl = item.images[0];
  } else if (item.img && typeof item.img === "string" && item.img.startsWith("http")) {
    imageUrl = item.img;
  }

  const postId = item._id || item.id;

  const handleMessageClick = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to send messages");
      return;
    }

    if (item.userId === user._id) {
      alert("You cannot message yourself");
      return;
    }

    try {
      const chat = await createOrGetChat(item.userId);
      console.log("Chat created or fetched:", chat);
      if (chat && chat._id) {
        navigate("/profile", { state: { activeChatId: chat._id } });
      } else {
        alert("Unexpected response from server.");
        console.error("Invalid chat object:", chat);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat");
    }
  };

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <div className="card">
      <Link to={`/post/${postId}`} className="imageContainer">
        <img
          src={imageError ? defaultImage : imageUrl}
          alt={item.title || "Post image"}
          onError={(e) => {
            e.target.src = defaultImage;
            setImageError(true);
          }}
        />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/post/${postId}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="Location pin" />
          <span>{item.address}</span>
        </p>
        <div className="price">
          ₹{" "}
          {typeof item.price === "number"
            ? item.price.toLocaleString()
            : item.price}
        </div>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="bedroom" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="bathroom" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="save icon" />
            </div>
            <div
              className="icon"
              onClick={handleMessageClick}
              style={{ cursor: "pointer" }}
            >
              <img src="/chat.png" alt="chat icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
