

import paypal from '@paypal/checkout-server-sdk';

// PayPal Environment configuration
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,  // Replace with your PayPal Client ID
  process.env.PAYPAL_SECRET     // Replace with your PayPal Secret
);

const client = new paypal.core.PayPalHttpClient(environment);

export default client;
