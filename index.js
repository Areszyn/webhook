import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser to parse incoming JSON payload
app.use(bodyParser.json());

// Define your Dodo secret here (you can set it in environment variables for security)
const DODO_SECRET = process.env.DODO_SECRET || 'your-dodo-secret-here';

// Webhook endpoint
app.post('/dodo-webhook', (req, res) => {
  const payload = req.body;
  console.log('Webhook received:', payload);

  // 🔐 Verify Signature (ensure the webhook is from Dodo Payment)
  const signature = req.headers['x-dodo-signature'];
  if (!verifySignature(payload, signature, DODO_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Handle payment success or failure
  if (payload.event === 'payment.succeeded') {
    console.log('✅ Payment succeeded:', payload.transaction_id);
  } else if (payload.event === 'payment.failed') {
    console.log('❌ Payment failed:', payload.transaction_id);
  }

  // Respond with a success status
  res.status(200).send('Webhook received');
});

// Function to verify the signature of the webhook payload
function verifySignature(payload, signature, secret) {
  const dataString = JSON.stringify(payload);
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(dataString)
    .digest('hex');
  return signature === expectedSig;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app; // For Vercel deployment
