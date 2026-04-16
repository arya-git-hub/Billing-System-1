const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  customer: {
    name: String,
    address: String,
  },
  items: [
    {
      desc: String,
      hsn: String,
      rate: Number,
      qty: Number,
      total: Number,
    }
  ],
  totals: {
    total: Number,
    sgst: Number,
    cgst: Number,
    grand: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);
