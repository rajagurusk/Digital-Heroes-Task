import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
      default: "New",
    },
    assignedTo: {
      type: String,
      enum: ["Member 1", "Member 2", "Member 3", null],
      default: null,
    },
    notes: [
      {
        text: String,
        by: String,
        at: { type: Date, default: Date.now },
      },
    ],
    activity: [
      {
        action: String,
        by: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);