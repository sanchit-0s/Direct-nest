
import { useState, useEffect } from "react";
import { getUserPayments } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import "./paymentHistory.scss";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const userPayments = await getUserPayments();
      setPayments(userPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  if (loading) return <div>Loading payments...</div>;

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      
      {payments.length === 0 ? (
        <div className="no-payments">No payments found</div>
      ) : (
        <div className="payments-list">
          {payments.map((payment) => (
            <div key={payment._id} className="payment-item">
              <div className="payment-info">
                <div className="payment-property">
                  <h4>{payment.postId?.title || 'Property'}</h4>
                  <p>{payment.postId?.address}</p>
                </div>
                
                <div className="payment-details">
                  <div className="payment-amount">
                    {formatCurrency(payment.amount)}
                  </div>
                  <div className="payment-parties">
                    {payment.payerId._id === user._id ? (
                      <span>To: {payment.receiverId.username}</span>
                    ) : (
                      <span>From: {payment.payerId.username}</span>
                    )}
                  </div>
                  <div className="payment-date">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
                
                <div className="payment-status">
                  <span 
                    className={`status ${payment.paymentStatus}`}
                    style={{ color: getStatusColor(payment.paymentStatus) }}
                  >
                    {payment.paymentStatus.toUpperCase()}
                  </span>
                  <div className="transaction-id">
                    ID: {payment.transactionId}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
