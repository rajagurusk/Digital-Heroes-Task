import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCommentDots,
} from "react-icons/fa";

import { toast } from "react-toastify";

function LeadForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.company ||
      !formData.phone ||
      !formData.email ||
      !formData.message
    ) {
      toast.error("Please fill all the fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.warning("Phone number must contain exactly 10 digits.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong.");
        return;
      }

      toast.success("Lead submitted successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to server.");
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">

      <div className="text-center mb-4">

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Get in Touch
        </h2>

        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          Submit your enquiry and our team will contact you shortly.
        </p>

      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="relative">
            <FaUser className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => {
                if (/^[A-Za-z ]*$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              className="w-full h-11 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <FaUser className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => {
                if (/^[A-Za-z ]*$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              className="w-full h-11 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="relative">
            <FaBuilding className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="w-full h-11 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <FaPhone className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => {
                if (/^\d{0,10}$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              className="w-full h-11 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Company Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-11 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="relative">
          <FaCommentDots className="absolute left-4 top-3.5 text-gray-400" />
          <textarea
            rows="2"
            name="message"
            placeholder="Tell us about your requirement..."
            value={formData.message}
            onChange={handleChange}
            className="w-full pl-12 pt-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold transition"
        >
          Submit Lead
        </button>

        <p className="text-center text-xs text-gray-500">
          By submitting this form you agree to our Privacy Policy.
        </p>

      </form>

    </div>
  );
}

export default LeadForm;