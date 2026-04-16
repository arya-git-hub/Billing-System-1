const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Invoice = require("./models/Invoice");
const Customer = require("./models/Customer");

const app = express();

// ✅ CORS — allow your Vercel frontend
app.use(cors({
  origin: [
    "https://billing-system-indol-six.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Backend Running ✅", db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

// Save Invoice
app.post("/save-invoice", async (req, res) => {
  try {
    const { customer, items, totals } = req.body;
    if (!customer || !items || !totals) return res.status(400).json({ error: "Missing required fields" });
    const newInvoice = new Invoice({ customer, items, totals });
    await newInvoice.save();
    res.status(201).json({ message: "Invoice saved successfully ✅", invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ error: "Failed to save invoice: " + err.message });
  }
});

// Get all invoices
app.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoices: " + err.message });
  }
});

// Save Customer
app.post("/save-customer", async (req, res) => {
  try {
    const { name, address, gst, phone } = req.body;
    if (!name) return res.status(400).json({ error: "Customer name is required" });
    const newCustomer = new Customer({ name, address, gst, phone });
    await newCustomer.save();
    res.status(201).json({ message: "Customer saved successfully ✅", customer: newCustomer });
  } catch (err) {
    res.status(500).json({ error: "Failed to save customer: " + err.message });
  }
});

// Get all customers
app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ date: -1 });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers: " + err.message });
  }
});

// Delete invoice
app.delete("/invoices/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Invoice deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});

// Delete customer
app.delete("/customers/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Customer deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

module.exports = app;
