import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Dodo secret key (the key you just provided)
const DODO_SECRET = 'whsec_vIfkrNjYaFU9njDyAnGCCqQz';

app.post('/dodo-webhook', (req, res) => {
  const payload = req.body;
  console.log('Webhook received:', payload);

  // Get the signature from the header
  const signature = req.headers['x-dodo-signature'];
  console.log('Received signature:', signature);

  // Verify the signature
  if (!verifySignature(payload, signature, DODO_SECRET)) {
    console.log('❌ Invalid signature');
    return res.status(401).send('Invalid signature');
  }

  // Handle events
  if (payload.event === 'payment.succeeded') {
    console.log('✅ Payment succeeded:', payload.transaction_id);
  } else if (payload.event === 'payment.failed') {
    console.log('❌ Payment failed:', payload.transaction_id);
  }

  res.status(200).send('Webhook received');
});

// Function to verify the signature
function verifySignature(payload, signature, secret) {
  const dataString = JSON.stringify(payload);  // Convert payload to string
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(dataString)
    .digest('hex');  // Generate the signature using the secret

  return signature === expectedSig;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app; // For Vercel
