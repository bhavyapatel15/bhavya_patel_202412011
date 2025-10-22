require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const mongo = require('./config/mongo');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const reportRoutes = require('./routes/reports');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(cors({
  origin: process.env.FRONTEND_URL || "*", 
  credentials: true
}));
app.use(express.json()); 
app.use('/uploads', express.static(uploadDir)); 

const MONGO = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mydb"; 
mongo.connect(MONGO)
     .then(() => console.log("MongoDB connected"))
     .catch(e => console.error("Mongo connection error:", e));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.send("API is working!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port', PORT));
