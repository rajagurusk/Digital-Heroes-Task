import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { toast } from "react-toastify";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong.");
        return;
      }

      toast.success("Employee added successfully!");

      setFormData({ name: "", email: "", username: "", password: "" });
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to server.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 mx-auto mt-10">

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Add Employee</h2>
        <p className="text-gray-500 mt-2">Create a login for a team member.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>

        <div className="relative">
          <FaUser className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="relative">
          <FaUserTag className="absolute left-4 top-4 text-gray-400" />
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
          Add Employee
        </button>

      </form>

    </div>
  );
}

export default AddEmployee;
