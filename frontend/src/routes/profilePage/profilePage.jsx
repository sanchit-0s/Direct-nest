import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserPosts, getAllPosts } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import PaymentHistory from "../../components/paymentHistory/PaymentHistory";
import "./profilePage.scss";

function ProfilePage() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const activeChatId = location.state?.activeChatId;
  const [activeTab, setActiveTab] = useState('posts');
    const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        console.log("Fetching all posts...");
        const posts = await getAllPosts();
        console.log("Fetched posts:", posts);
        // Remove duplicates based on _id
        const uniquePosts = posts.filter((post, index, self) => 
          index === self.findIndex(p => p._id === post._id)
        );
        setUserPosts(uniquePosts);
      } catch (error) {
        console.error("Error fetching all posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []); // Remove user dependency to prevent re-fetching

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  // Convert posts to format expected by List component
  const listData = userPosts.map(post => {
    // Better image URL validation and fallback
    let imageUrl = "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

    if (post.images && post.images.length > 0) {
      const firstImage = post.images[0];
      // Check if it's a valid URL
      if (firstImage && (firstImage.startsWith('http://') || firstImage.startsWith('https://'))) {
        imageUrl = firstImage;
      }
    }

    return {
      id: post._id,
      _id: post._id,
      title: post.title || 'Untitled',
      img: imageUrl,
      images: post.images || [],
      bedroom: post.bedroom || 0,
      bathroom: post.bathroom || 0,
      price: post.price || 0,
      address: post.address || 'No address',
      latitude: parseFloat(post.latitude) || 0,
      longitude: parseFloat(post.longitude) || 0,
      description: post.description || '',
      type: post.type || 'sale',
      property: post.property || 'apartment',
      userId: post.userId?._id || post.userId
    };
  });



  // Convert saved posts to format expected by List component
  const savedListData = savedPosts.map(post => {
    let imageUrl = "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

    if (post.images && post.images.length > 0) {
      const firstImage = post.images[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
        imageUrl = firstImage;
      }
    }

    return {
      id: post._id,
      title: post.title,
      img: imageUrl,
      bedroom: post.bedroom,
      bathroom: post.bathroom,
      price: post.price,
      address: post.address,
      latitude: post.latitude,
      longitude: post.longitude,
    };
  });

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <button onClick={() => navigate("/profile/update")}>Update Profile</button>
          </div>
           <div className="tabs">
              <button 
                className={activeTab === 'posts' ? 'active' : ''} 
                onClick={() => setActiveTab('posts')}
              >
                My Posts
              </button>
              {/* <button 
                className={activeTab === 'payments' ? 'active' : ''} 
                onClick={() => setActiveTab('payments')}
              >
                Payment History
              </button> */}
            </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
              />
            </span>
            <span>Username: <b>{user.username}</b></span>
            <span>E-mail: <b>{user.email}</b></span>
            <button onClick={() => navigate("/add")}>Create New Post</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <button onClick={() => navigate("/add")}>Create New Post</button>
          </div>
          {loading ? (
            <div>Loading your posts...</div>
          ) : (
            activeTab === 'posts' && <List data={listData} />
          )}
          {activeTab === 'payments' && <PaymentHistory />}
          <div className="title">
            {/* <h1>Saved List</h1> */}
          </div>
          <List data={[]} />
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat activeChatId={activeChatId} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;