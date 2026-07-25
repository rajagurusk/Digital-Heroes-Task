import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MemberDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const memberName = localStorage.getItem("memberName");

  useEffect(() => {
    const token = localStorage.getItem("memberToken");

    if (!token) {
      toast.error("Please login first.");
      navigate("/member-login");
      return;
    }

    fetchMyLeads(token);
  }, []);

  const fetchMyLeads = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/my-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch leads.");
        return;
      }

      setLeads(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 sm:mt-10 px-3 sm:px-6">

      <h2 className="text-lg sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Welcome, {memberName} — Your Assigned Leads
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading leads...</p>
      ) : leads.length === 0 ? (
        <p className="text-gray-500">No leads assigned to you yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full text-left">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{lead.firstName}</td>
                  <td className="px-4 py-3">{lead.lastName}</td>
                  <td className="px-4 py-3">{lead.company}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.message}</td>
                  <td className="px-4 py-3">{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default MemberDashboard;