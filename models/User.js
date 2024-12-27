const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  houseNumber: String,
  floor: String,
  age: Number,
  email: { type: String, unique: true },
  tifHash: String,
});

module.exports = mongoose.model('User', UserSchema, 'users'); // Explicit collection name: 'users'
