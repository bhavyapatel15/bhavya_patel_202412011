const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'devsecret';
function sign(payload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
function verify(token) {
  return jwt.verify(token, secret);
}
function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Unauthorized' });
  const token = h.replace('Bearer ', '');
  try {
    req.user = verify(token);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
module.exports = { sign, verify, authMiddleware, requireRole };
