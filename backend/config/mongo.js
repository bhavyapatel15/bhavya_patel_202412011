const mongoose = require('mongoose');
async function connect(uri) {
  if (!uri) return;
  await mongoose.connect(uri);
}
module.exports = { connect, mongoose };
