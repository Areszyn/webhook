import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { createServer } from 'vercel-http';

const app = express();
app.use(bodyParser.json());

app.post('/dodo-webhook', (req, res) => {
  const payload = req.body;
  console.log('Webhook received:', payload);

  if (payload.event === 'payment.success') {
    console.log('✅ Payment succeeded:', payload.transaction_id);
  } else if (payload.event === 'payment.failed') {
    console.log('❌ Payment failed:', payload.transaction_id);
  }

  res.status(200).send('Webhook received');
});

function verifySignature(payload, signature, secret) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expectedSig;
}

// ✅ Wrap Express app for Vercel
export default createServer(app);
