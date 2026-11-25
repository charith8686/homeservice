const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Node.js/Express API. User and booking data remain in browser Local Storage.
const services = [
  { name: 'Plumbing', description: 'Tap and pipe repairs', price: 499, emoji: '🔧' },
  { name: 'Electrical', description: 'Lights and switch repairs', price: 599, emoji: '💡' },
  { name: 'Cleaning', description: 'Basic home cleaning', price: 799, emoji: '🧹' }
];

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'HomeServices' }));
app.get('/api/services', (req, res) => res.json(services));

app.listen(PORT, () => console.log(`HomeServices API running at http://localhost:${PORT}`));
