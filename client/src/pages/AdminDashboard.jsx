import { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedLead, setExpandedLead] = useState(null);
  const [noteText, setNoteText] = useState("");
  const members = ["Member 1", "Member 2", "Member 3"];
  const statuses = ["New", "Contacted", "Qualified", "Converted", "Lost"];
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first.");
      navigate("/admin-login");
      return;
    }
    fetchLeads();
  }, [page, statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch leads.");
        return;
      }

      setLeads(data.leads);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (leadId, memberName) => {
    if (!memberName) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assignedTo: memberName }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed to assign lead.");
      toast.success(`Task assigned to ${memberName}!`);
      fetchLeads();
    } catch (error) {
      toast.error("Could not connect to server.");
    }
  };

  const handleStatusChange = async (leadId, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed to update status.");
      toast.success(`Status updated to ${status}`);
      fetchLeads();
    } catch (error) {
      toast.error("Could not connect to server.");
    }
  };

  const toggleExpand = (leadId) => {
    setExpandedLead(expandedLead === leadId ? null : leadId);
    setNoteText("");
  };

  const handleAddNote = async (leadId) => {
    if (!noteText.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: noteText }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed to add note.");
      toast.success("Note added!");
      setNoteText("");
      fetchLeads();
    } catch (error) {
      toast.error("Could not connect to server.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 sm:mt-10 px-3 sm:px-6">
      <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Admin Dashboard - Leads
      </h2>

      <div className="mb-4 flex gap-3 items-center">
        <label className="text-sm text-gray-600">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-2 py-1"
        >
          <option value="">All</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading leads...</p>
      ) : leads.length === 0 ? (
        <p className="text-gray-500">No leads found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assign To</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <Fragment key={lead._id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{lead.firstName} {lead.lastName}</td>
                      <td className="px-4 py-3">{lead.company}</td>
                      <td className="px-4 py-3">{lead.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className="border rounded-lg px-2 py-1"
                        >
                          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.assignedTo || ""}
                          onChange={(e) => handleAssign(lead._id, e.target.value)}
                          className="border rounded-lg px-2 py-1"
                        >
                          <option value="">Unassigned</option>
                          {members.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleExpand(lead._id)}
                          className="text-blue-600 underline text-sm"
                        >
                          {expandedLead === lead._id ? "Hide" : "Notes/Activity"}
                        </button>
                      </td>
                    </tr>

                    {expandedLead === lead._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="px-4 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div>
                              <h4 className="font-semibold mb-2">Notes</h4>
                              {lead.notes?.length ? (
                                <ul className="space-y-1 text-sm mb-2">
                                  {lead.notes.map((n, i) => (
                                    <li key={i} className="border-b pb-1">
                                      {n.text} <span className="text-gray-400">— {n.by}, {new Date(n.at).toLocaleString()}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400 text-sm mb-2">No notes yet.</p>
                              )}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  placeholder="Add a note..."
                                  className="border rounded px-2 py-1 text-sm flex-1"
                                />
                                <button
                                  onClick={() => handleAddNote(lead._id)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Add
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Activity Trail</h4>
                              {lead.activity?.length ? (
                                <ul className="space-y-1 text-sm">
                                  {lead.activity.map((a, i) => (
                                    <li key={i} className="text-gray-600">
                                      {a.action} — {a.by}, {new Date(a.at).toLocaleString()}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400 text-sm">No activity yet.</p>
                              )}
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
            <span className="px-2 py-1">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;