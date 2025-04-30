const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // For HMAC verification (if needed)

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Webhook Endpoint
app.post('/dodo-webhook', (req, res) => {
  const payload = req.body;
  console.log('Webhook received:', payload);

  // 🔐 Verify Signature (if Dodo provides a secret)
  // const secret = process.env.DODO_SECRET;
  // const signature = req.headers['x-dodo-signature'];
  // if (!verifySignature(payload, signature, secret)) {
  //   return res.status(401).send('Invalid signature');
  // }

  // Process events
  if (payload.event === 'payment.success') {
    console.log('✅ Payment succeeded:', payload.transaction_id);
    // Update database, send email, etc.
  } else if (payload.event === 'payment.failed') {
    console.log('❌ Payment failed:', payload.transaction_id);
  }

  res.status(200).send('Webhook received');
});

// Helper: HMAC validation (optional)
function verifySignature(payload, signature, secret) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expectedSig;
}

// Start server (for local testing)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; // For Vercel
