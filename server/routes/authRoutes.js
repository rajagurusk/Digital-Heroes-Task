import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/admin-login
router.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign(
    { role: "admin", username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({ message: "Login successful", token });
});

// POST /api/auth/member-login
router.post("/member-login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const members = [
    { username: process.env.MEMBER1_USERNAME, password: process.env.MEMBER1_PASSWORD, name: "Member 1" },
    { username: process.env.MEMBER2_USERNAME, password: process.env.MEMBER2_PASSWORD, name: "Member 2" },
    { username: process.env.MEMBER3_USERNAME, password: process.env.MEMBER3_PASSWORD, name: "Member 3" },
  ];

  const member = members.find(
    (m) => m.username === username && m.password === password
  );

  if (!member) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign(
    { role: "member", name: member.name, username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({ message: "Login successful", token, name: member.name });
});

export default router;