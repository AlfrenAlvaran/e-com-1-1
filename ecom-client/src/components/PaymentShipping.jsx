import React, { useState } from 'react';

const PaymentShipping = ({ selectedProduct, onPaymentSuccess }) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically handle the payment processing
    // For now, we will just simulate a successful payment
    console.log('Payment processed for:', selectedProduct);
    console.log('Shipping Address:', shippingAddress);
    onPaymentSuccess(); // Call the success handler
  };

  return (
    <div className="payment-shipping">
      <h2>Payment and Shipping</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Shipping Address:
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Payment Method:
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="creditCard">Gcash</option>
              <option value="paypal">Paymaya</option>
              <option value="bankTransfer">Cash on Delivery</option>
            </select>
          </label>
        </div>
        <button type="submit">Complete Purchase</button>
      </form>
    </div>
  );
};

export default PaymentShipping;