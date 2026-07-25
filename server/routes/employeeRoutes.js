import express from "express";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

const router = express.Router();

// POST /api/employees -> admin creates a new employee
router.post("/", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Employee.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        username: employee.username,
      },
    });
  } catch (error) {
    console.error("Error creating employee:", error.message);
    res.status(500).json({ message: "Server error while creating employee" });
  }
});

// GET /api/employees -> list all employees (for assign dropdown)
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({ message: "Server error while fetching employees" });
  }
});

export default router;