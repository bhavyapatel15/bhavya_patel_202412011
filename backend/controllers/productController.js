const Product = require('../models/productModel');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function determineSort(req) {
  if (req.headers['x-sort'] === 'asc') return { price: 1 };
  if (req.query.sort === 'asc') return { price: 1 };
  return { price: -1 };
}

async function getCategories(req,res)
{
  try {
    const categories = await Product.distinct('category')
    res.json({ categories })
  } catch (e) {
    console.error('categories', e)
    res.status(500).json({ error: 'Server error' })
  }
}

async function listProducts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(50, parseInt(req.query.limit || '10'));
    const filter = {};

    if (req.query.category) {
      const c = String(req.query.category).trim();
      filter.category = { $regex: '^' + escapeRegExp(c) + '$', $options: 'i' };
    }

    if (req.query.q) filter.name = { $regex: req.query.q, $options: 'i' };

    const sort = determineSort(req);
    const items = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Product.countDocuments(filter);
    const host = req.get('host');
    const protocol = req.protocol; 
    const itemsWithFullImage = items.map(item => {
      const obj = item.toObject();
      if (obj.image && obj.image.startsWith('/uploads/')) {
        obj.image = `${protocol}://${host}${obj.image}`;
      }
      return obj;
    });

    res.json({ items: itemsWithFullImage, total, page, limit });
  } catch (e) {
    console.error('listProducts', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createProduct(req, res) {
  try {
    const data = req.body || {};

    if (!data.name || !data.price) return res.status(400).json({ error: 'Missing name or price' });

    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    } else if (!data.image) {
      const q = encodeURIComponent((data.category || data.name || 'product').split(' ')[0]);
      data.image = `https://source.unsplash.com/featured/?${q}`;
    }

    const p = new Product(data);
    await p.save();

    if (p.image.startsWith('/uploads/')) {
      const host = req.get('host');
      const protocol = req.protocol;
      p.image = `${protocol}://${host}${p.image}`;
    }

    res.json(p);
  } catch (e) {
    console.error('createProduct', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    const name = body.name || existing.name;
    const price = body.price !== undefined ? Number(body.price) : existing.price;
    if (!name || !price) return res.status(400).json({ error: 'Missing name or price' });
    if (isNaN(price)) return res.status(400).json({ error: 'Price must be a number' });

    const updateData = {
      sku: body.sku || existing.sku,
      name,
      price,
      category: body.category || existing.category,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (!existing.image && (body.category || body.name)) {
      const q = encodeURIComponent((body.category || body.name).split(' ')[0]);
      updateData.image = `https://source.unsplash.com/featured/?${q}`;
    } else if (existing.image) {
      updateData.image = existing.image; 
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (updated.image && updated.image.startsWith('/uploads/')) {
      const host = req.get('host');
      const protocol = req.protocol;
      updated.image = `${protocol}://${host}${updated.image}`;
    }

    res.json(updated);
  } catch (e) {
    console.error('updateProduct', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function deleteProduct(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error('deleteProduct', e);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { determineSort, listProducts, createProduct, updateProduct, deleteProduct, getCategories};