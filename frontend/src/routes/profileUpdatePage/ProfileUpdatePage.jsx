
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import "./profileUpdatePage.scss";

function ProfileUpdatePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    profile: {
      firstName: user?.profile?.firstName || "",
      lastName: user?.profile?.lastName || "",
      phone: user?.profile?.phone || "",
      address: user?.profile?.address || "",
    },
    bankDetails: {
      accountNumber: user?.bankDetails?.accountNumber || "",
      ifscCode: user?.bankDetails?.ifscCode || "",
      accountHolderName: user?.bankDetails?.accountHolderName || "",
      bankName: user?.bankDetails?.bankName || "",
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await updateUserProfile(formData);
      setUser(response.user);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          
          {error && <div className="error">{error}</div>}
          
          <div className="section">
            <h3>Basic Information</h3>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="section">
            <h3>Personal Details</h3>
            <input
              name="profile.firstName"
              type="text"
              placeholder="First Name"
              value={formData.profile.firstName}
              onChange={handleChange}
            />
            <input
              name="profile.lastName"
              type="text"
              placeholder="Last Name"
              value={formData.profile.lastName}
              onChange={handleChange}
            />
            <input
              name="profile.phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.profile.phone}
              onChange={handleChange}
            />
            <textarea
              name="profile.address"
              placeholder="Address"
              value={formData.profile.address}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="section">
            <h3>Bank Details</h3>
            <input
              name="bankDetails.accountHolderName"
              type="text"
              placeholder="Account Holder Name"
              value={formData.bankDetails.accountHolderName}
              onChange={handleChange}
            />
            <input
              name="bankDetails.accountNumber"
              type="text"
              placeholder="Account Number"
              value={formData.bankDetails.accountNumber}
              onChange={handleChange}
            />
            <input
              name="bankDetails.ifscCode"
              type="text"
              placeholder="IFSC Code"
              value={formData.bankDetails.ifscCode}
              onChange={handleChange}
            />
            <input
              name="bankDetails.bankName"
              type="text"
              placeholder="Bank Name"
              value={formData.bankDetails.bankName}
              onChange={handleChange}
            />
          </div>

          <div className="buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button type="button" onClick={() => navigate("/profile")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
