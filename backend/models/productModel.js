const { Schema } = require('mongoose');
const { mongoose } = require('../config/mongo');
const ProductSchema = new Schema({
  sku: { type: String, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, index: true },
  image: { type: String },
  updatedAt: { type: Date, index: true, default: Date.now }
});
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);