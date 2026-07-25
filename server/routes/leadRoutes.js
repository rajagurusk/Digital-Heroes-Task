import express from "express";
import Lead from "../models/Lead.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/leads -> public (anyone can submit)
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, company, phone, email, message } = req.body;
    if (!firstName || !lastName || !company || !phone || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const lead = await Lead.create({ firstName, lastName, company, phone, email, message });
    res.status(201).json({ message: "Lead created successfully", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error while saving lead" });
  }
});

// GET /api/leads -> ADMIN ONLY now, with pagination + filtering
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, assignedTo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      leads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching leads" });
  }
});

// GET /api/leads/my-leads -> MEMBER ONLY
router.get("/my-leads", protect, async (req, res) => {
  try {
    if (req.user.role !== "member") {
      return res.status(403).json({ message: "Access denied." });
    }
    const leads = await Lead.find({ assignedTo: req.user.name }).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching leads" });
  }
});

// PATCH /api/leads/:id/assign -> ADMIN ONLY
router.patch("/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
        $push: { activity: { action: `Assigned to ${assignedTo}`, by: req.user.username, at: new Date() } },
      },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found." });
    res.status(200).json({ message: "Lead assigned successfully", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error while assigning lead" });
  }
});

// PATCH /api/leads/:id/status -> ADMIN or MEMBER (assigned member can update their own)
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["New", "Contacted", "Qualified", "Converted", "Lost"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { activity: { action: `Status changed to ${status}`, by: req.user.username, at: new Date() } },
      },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found." });
    res.status(200).json({ message: "Status updated", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating status" });
  }
});

// POST /api/leads/:id/notes -> ADMIN or MEMBER
router.post("/:id/notes", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Note text is required." });

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: { text, by: req.user.username, at: new Date() },
          activity: { action: `Note added by ${req.user.username}`, by: req.user.username, at: new Date() },
        },
      },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found." });
    res.status(201).json({ message: "Note added", lead });
  } catch (error) {
    res.status(500).json({ message: "Server error while adding note" });
  }
});

export default router;