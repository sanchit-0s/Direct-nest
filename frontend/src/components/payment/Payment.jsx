
import { useState, useEffect } from "react";
import { createPayment, updatePaymentStatus } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import "./payment.scss";

function Payment({ post, onClose }) {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: confirm, 2: payment details, 3: success
  const { user } = useAuth();

  const handleInitiatePayment = async () => {
    setLoading(true);
    try {
      const response = await createPayment(post._id, post.price);
      setPaymentData(response.payment);
      setStep(2);
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    if (!paymentData) return;
    
    setLoading(true);
    try {
      await updatePaymentStatus(paymentData._id, 'completed');
      setStep(3);
    } catch (error) {
      console.error('Error completing payment:', error);
      alert('Failed to complete payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="payment-modal">
      <div className="payment-content">
        <div className="payment-header">
          <h2>Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {step === 1 && (
          <div className="payment-confirm">
            <div className="property-info">
              <img src={post.images?.[0] || "/default-property.jpg"} alt={post.title} />
              <div>
                <h3>{post.title}</h3>
                <p>{post.address}</p>
                <div className="price">{formatCurrency(post.price)}</div>
              </div>
            </div>
            
            <div className="payment-summary">
              <div className="summary-row">
                <span>Property Price:</span>
                <span>{formatCurrency(post.price)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>{formatCurrency(post.price)}</span>
              </div>
            </div>

            <button 
              className="pay-btn" 
              onClick={handleInitiatePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        )}

        {step === 2 && paymentData && (
          <div className="payment-details">
            <h3>Payment Details</h3>
            <div className="transaction-info">
              <p><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
              <p><strong>Amount:</strong> {formatCurrency(paymentData.amount)}</p>
              <p><strong>Status:</strong> <span className="status pending">{paymentData.paymentStatus}</span></p>
            </div>

            <div className="bank-details">
              <h4>Transfer to the following account:</h4>
              <div className="bank-info">
                <div className="bank-row">
                  <span>Account Holder:</span>
                  <span>{paymentData.receiverBankDetails.accountHolderName}</span>
                </div>
                <div className="bank-row">
                  <span>Account Number:</span>
                  <span>{paymentData.receiverBankDetails.accountNumber}</span>
                </div>
                <div className="bank-row">
                  <span>IFSC Code:</span>
                  <span>{paymentData.receiverBankDetails.ifscCode}</span>
                </div>
                <div className="bank-row">
                  <span>Bank Name:</span>
                  <span>{paymentData.receiverBankDetails.bankName}</span>
                </div>
              </div>
            </div>

            <div className="payment-instructions">
              <h4>Payment Instructions:</h4>
              <ol>
                <li>Transfer the exact amount to the above bank account</li>
                <li>Use the Transaction ID as reference</li>
                <li>Click "Payment Completed" after successful transfer</li>
                <li>Keep the transaction receipt for your records</li>
              </ol>
            </div>

            <div className="payment-actions">
              <button 
                className="complete-btn" 
                onClick={handlePaymentComplete}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Payment Completed'}
              </button>
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Your payment has been processed successfully.</p>
            <p><strong>Transaction ID:</strong> {paymentData?.transactionId}</p>
            <p>You will receive a confirmation email shortly.</p>
            <button className="close-btn-success" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
