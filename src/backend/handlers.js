const stripe = require('stripe')(process.env.sk_test_51ObW35JuImlUjwClMcXxCRaL1p4Dz7H3BL7ySfC67MWmPjY0vEwmqjeqhfnjqrwI2qV6Q7Xi2PVFXN7uCluFHPu000vLRfrBXf);
const { v4: uuidv4 } = require('uuid');

// Function to generate a reservation ID
const generateReservationId = () => {
  return 'res-' + uuidv4();
};

const handlePayment = async (stripe, cart, navigate, totalCost) => {
  try {
    // Convert totalCost to cents
    const amountInCents = Math.round(totalCost * 100);

    // Create a payment intent using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Convert totalCost to cents
      currency: 'usd',
    });

    // Redirect to the payment form page with the client secret
    navigate('/payment', { state: { clientSecret: paymentIntent.client_secret } });
  } catch (error) {
    console.error('Error processing payment:', error);
  }
};


// Function to get reservation details
const getReservationDetails = (cart, totalCost) => {
  const reservationDetails = {
    reservationId: generateReservationId(),
    items: cart,
    total: totalCost,
    user: 'currentUser',
  };
  console.log('Generated Reservation Details:', reservationDetails);
  return reservationDetails;
};



module.exports = {
  getReservationDetails,
  generateReservationId,
  handlePayment
};
