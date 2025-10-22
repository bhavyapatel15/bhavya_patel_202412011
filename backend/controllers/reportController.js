const prisma = require('../config/prismaClient');
const Product = require('../models/productModel');

function formatDate(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

async function sqlReport(req, res) {
  try {
  
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const orders = await prisma.order.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, total: true } });
    const map = {};
    for (const o of orders) {
      const date = formatDate(o.createdAt);
      map[date] = (map[date] || 0) + Number(o.total || 0);
    }

    const dates = Object.keys(map).sort((a,b)=>b.localeCompare(a)).slice(0,7);
    const rows = dates.map(d=>({ date: d, revenue: map[d] }));
    res.json({ dailyRevenue: rows });
  } catch (e) {
    console.error('sqlReport', e);
    res.status(500).json({ error: 'Server error' });
  }
}

async function mongoReport(req, res) {
  try {
    const rows = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $project: { category: '$_id', count: 1, avgPrice: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.json({ categoryStats: rows });
  } catch (e) {
    console.error('mongoReport', e);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { sqlReport, mongoReport };