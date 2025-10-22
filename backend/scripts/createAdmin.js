const prisma = require('../config/prismaClient');
const bcrypt = require('bcryptjs');

async function run() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: node scripts/createAdmin.js email password name');
    process.exit(1);
  }
  const [email, password, ...nameParts] = args;
  const name = nameParts.join(' ');
  const hash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists:', existing.email);
    process.exit(1);
  }
  const u = await prisma.user.create({ data: { email, name, passwordHash: hash, role: 'admin' } });
  console.log('Created admin:', u.email, 'id:', u.id);
  process.exit(0);
}

run().catch(e=>{ console.error(e); process.exit(1); });