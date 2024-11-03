import React from 'react';
import PaymentShipping from './PaymentShipping';
const Checkout = ({ selectedProduct, history }) => {
  const handlePaymentSuccess = () => {
    // Redirect to a success page or show a success message
    history.push('/success');
  };

  const handleBuyNow = () => {
    // Logic to handle the buy now action
    // This could be a direct link to a payment processor or a function to handle payment
    console.log('Buy Now clicked for:', selectedProduct);
    // You can redirect to a payment page or process payment here
    history.push('/payment'); // Example redirect to a payment page
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <h2>Selected Product: {selectedProduct.name}</h2>
      <button onClick={handleBuyNow} className="buy-now-button">
        Buy Now
      </button>
      <PaymentShipping selectedProduct={selectedProduct} onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default Checkout;