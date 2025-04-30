import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
app.use(bodyParser.json());

app.post('/dodo-webhook', (req, res) => {
  const payload = req.body;
  console.log('Webhook received:', payload);

  // Optional: Verify signature if needed
  // const secret = process.env.DODO_SECRET;
  // const signature = req.headers['x-dodo-signature'];
  // if (!verifySignature(payload, signature, secret)) {
  //   return res.status(401).send('Invalid signature');
  // }

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

// ❌ REMOVE app.listen()
// ✅ Export app for Vercel
export default app;
