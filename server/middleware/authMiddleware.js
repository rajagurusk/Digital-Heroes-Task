import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Lead from "../models/Lead.js"; // adjust path to your Lead model

const router = express.Router();

// ✅ Public route: submit a new lead
router.post("/api/leads", async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ message: "Lead submitted successfully", lead });
  } catch (error) {
    res.status(400).json({ message: "Error saving lead", error: error.message });
  }
});

// 🔒 Protected route: get all leads (requires token)
router.get("/api/leads", protect, async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json({ data: leads });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error: error.message });
  }
});

// 🔒 Admin-only route: delete a lead
router.delete("/api/leads/:id", protect, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead", error: error.message });
  }
});

export default router;
