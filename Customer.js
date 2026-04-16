const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  gst: String,
  phone: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
