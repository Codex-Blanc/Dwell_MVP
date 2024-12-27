const mongoose = require('mongoose');

const TifFileSchema = new mongoose.Schema({
  hash: { type: String, unique: true },
  filePath: String,
});

module.exports = mongoose.model('TifFile', TifFileSchema);