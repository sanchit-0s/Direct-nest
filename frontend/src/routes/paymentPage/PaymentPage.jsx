
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getPostById } from "../../lib/api";
import "./paymentPage.scss";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: bank details form, 2: payment done
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleInputChange = (e) => {
    setBankDetails({
      ...bankDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentLoading(false);
      setStep(2);
    }, 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="paymentPage">
      <div className="paymentContainer">
        <div className="wrapper">
          {step === 1 && (
            <>
              <h1>Make Payment</h1>
              
              <div className="propertyInfo">
                <img src={post.images?.[0] || "/default-property.jpg"} alt={post.title} />
                <div className="propertyDetails">
                  <h2>{post.title}</h2>
                  <p className="address">{post.address}</p>
                  <div className="price">{formatCurrency(post.price)}</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="paymentForm">
                <h3>Enter Your Bank Details</h3>
                
                <div className="item">
                  <label htmlFor="accountHolderName">Account Holder Name</label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="item">
                  <label htmlFor="accountNumber">Account Number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="item">
                  <label htmlFor="ifscCode">IFSC Code</label>
                  <input
                    type="text"
                    id="ifscCode"
                    name="ifscCode"
                    value={bankDetails.ifscCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="item">
                  <label htmlFor="bankName">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="paymentSummary">
                  <div className="summaryRow total">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(post.price)}</span>
                  </div>
                </div>

                <div className="buttons">
                  <button 
                    type="submit" 
                    className="submitBtn" 
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? 'Processing Payment...' : 'Submit Payment'}
                  </button>
                  <button 
                    type="button" 
                    className="cancelBtn" 
                    onClick={() => navigate(`/`)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <div className="paymentSuccess">
              <div className="successIcon">✓</div>
              <h1>Payment Successful!</h1>
              <p>Your payment has been processed successfully.</p>
              
              <div className="paymentDetails">
                <h3>Payment Details</h3>
                <p><strong>Property:</strong> {post.title}</p>
                <p><strong>Amount:</strong> {formatCurrency(post.price)}</p>
                <p><strong>Account Holder:</strong> {bankDetails.accountHolderName}</p>
                <p><strong>Transaction ID:</strong> TXN_{Date.now()}</p>
              </div>

              <div className="buttons">
                <button 
                  className="homeBtn" 
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </button>
                {/* <button 
                  className="propertyBtn" 
                  onClick={() => navigate(`/property/${id}`)}
                >
                  Back to Property
                </button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
