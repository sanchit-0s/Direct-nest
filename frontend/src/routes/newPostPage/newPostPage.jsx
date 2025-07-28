import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import "./newPostPage.scss";

function NewPostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState(['']);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    
    // Add image URLs to the inputs with better validation
    const validImageURLs = imageURLs
      .filter(url => url.trim() !== '')
      .map(url => url.trim());
    
    console.log("Submitting with images:", validImageURLs);
    inputs.images = validImageURLs;

    try {
      const result = await createPost(inputs);
      console.log("Create post result:", result);
      if (result.message === "Post created successfully") {
        navigate("/profile");
      } else {
        setError(result.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("An error occurred while creating the post");
    } finally {
      setIsLoading(false);
    }
  };

  const addImageURL = () => {
    setImageURLs([...imageURLs, '']);
  };

  const removeImageURL = (index) => {
    const newImageURLs = imageURLs.filter((_, i) => i !== index);
    setImageURLs(newImageURLs);
  };

  const updateImageURL = (index, value) => {
    const newImageURLs = [...imageURLs];
    newImageURLs[index] = value;
    setImageURLs(newImageURLs);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="number" step="any" required />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="number" step="any" required />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" required>
                <option value="">Select Type</option>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" required>
                <option value="">Select Property</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="">Select Utilities</option>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="">Select Pet Policy</option>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input id="income" name="income" type="text" placeholder="Income requirements" />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School Distance (m)</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Distance (m)</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant Distance (m)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <div className="item">
              <label>Property Images</label>
              <div className="imageInputs">
                {imageURLs.map((url, index) => (
                  <div key={index} className="imageInputGroup">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageURL(index, e.target.value)}
                      placeholder="Enter image URL (e.g., https://images.pexels.com/...)"
                      className="imageInput"
                    />
                    {imageURLs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageURL(index)}
                        className="removeImageBtn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageURL}
                  className="addImageBtn"
                >
                  Add Another Image
                </button>
              </div>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="sendButton" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;