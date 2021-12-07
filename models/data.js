const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  someID: String,
  balance: Number,
  items: Array,
  daily: Number,
  weekly: Number,
  lb: Array,
  names: Array,
  prefix: String,
  disable: Array,
  time: Number,
  words: String,
  channelID: String
});

module.exports = mongoose.model("data", messageSchema);