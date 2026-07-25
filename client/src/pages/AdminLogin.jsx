import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

    if (!formData.username || !formData.password) {
      toast.error("Please enter username and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials.");
        return;
      }

      // Save token for later authenticated requests
      localStorage.setItem("adminToken", data.token);

      toast.success("Login successful!");

      navigate("/admin-dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to server.");
    }
  };

  return (
<div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 mx-4 sm:mx-auto mt-10 sm:mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
        <p className="text-gray-500 mt-2">
          Login to manage leads and members.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>

        <div className="relative">
          <FaUser className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full h-12 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-4 top-4 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-12 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-semibold transition"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default AdminLogin;