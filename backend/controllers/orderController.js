const prisma = require('../config/prismaClient');
async function checkout(req, res) {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
  const total = items.reduce((s, it) => s + (it.price * it.quantity), 0);
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: { create: items.map(i=>({ productId: i.productId.toString(), quantity: i.quantity, priceAtPurchase: i.price })) }
    },
    include: { items: true }
  });
  res.json(order);
}
module.exports = { checkout };
