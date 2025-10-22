require('dotenv').config();
const bcrypt = require('bcryptjs');
const prismaClient = require('../config/prismaClient');
const mongoose = require('mongoose');
const Product = require('../models/productModel');
async function main() {
  const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom_products';
  await mongoose.connect(MONGO);
  const adminPass = await bcrypt.hash('AdminPass123', 10);
  const customerPass = await bcrypt.hash('CustomerPass123', 10);
  await prismaClient.user.upsert({ where: { email: 'admin@example.com' }, update: {}, create: { name: 'Admin User', email: 'admin@example.com', passwordHash: adminPass, role: 'admin' } });
  await prismaClient.user.upsert({ where: { email: 'customer@example.com' }, update: {}, create: { name: 'Customer User', email: 'customer@example.com', passwordHash: customerPass, role: 'customer' } });
  const sample = [
    { sku: 'SKU-1001', name: 'Wireless Headphones', price: 2499, category: 'electronics' },
    { sku: 'SKU-1002', name: 'Smartphone Stand', price: 499, category: 'electronics' },
    { sku: 'SKU-1003', name: 'Cotton T-Shirt', price: 799, category: 'fashion' },
    { sku: 'SKU-1004', name: 'Ceramic Mug', price: 299, category: 'home' },
    { sku: 'SKU-1005', name: 'Bestselling Novel', price: 399, category: 'books' }
  ];
  for (const p of sample) {
    await Product.updateOne({ sku: p.sku }, { $set: p }, { upsert: true });
  }
  console.log('Seed complete');
  process.exit(0);
}
main().catch(e=>{ console.error(e); process.exit(1); });
