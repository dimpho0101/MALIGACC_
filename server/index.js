const express = require('express');
const fetch = require('node-fetch'); // or native fetch in Node 18+
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

app.post('/send-whatsapp', async (req, res) => {
  const { name, email, subject, message, phone, to } = req.body;
  if (!TOKEN || !PHONE_ID) return res.status(500).json({ error: 'Server not configured' });

  const toNumber = to || process.env.TO_NUMBER;
  if (!toNumber) return res.status(400).json({ error: 'No recipient number' });

  const text = [
    `Name: ${name || ''}`,
    phone ? `Phone: ${phone}` : '',
    `Email: ${email || ''}`,
    `Subject: ${subject || ''}`,
    `Message: ${message || ''}`
  ].filter(Boolean).join('\\n');

  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;
    const body = {
      messaging_product: 'whatsapp',
      to: toNumber,
      type: 'text',
      text: { body: text }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const json = await resp.json();
    if (!resp.ok) return res.status(500).json({ error: json });
    return res.json({ success: true, result: json });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));