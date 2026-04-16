const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Invoice = require("./Invoice");
const Customer = require("./Customer");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));

app.get("/", (req, res) => {
  res.json({ status: "Backend Running ✅", db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

app.post("/save-invoice", async (req, res) => {
  try {
    const { customer, items, totals } = req.body;
    const newInvoice = new Invoice({ customer, items, totals });
    await newInvoice.save();
    res.status(201).json({ message: "Invoice saved successfully ✅", invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ error: "Failed to save invoice: " + err.message });
  }
});

app.post("/save-customer", async (req, res) => {
  try {
    const { name, address, gst, phone } = req.body;
    const newCustomer = new Customer({ name, address, gst, phone });
    await newCustomer.save();
    res.status(201).json({ message: "Customer saved successfully ✅", customer: newCustomer });
  } catch (err) {
    res.status(500).json({ error: "Failed to save customer: " + err.message });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ date: -1 });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

module.exports = app;
