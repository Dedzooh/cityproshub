import { useEffect, useState } from "react";
import axios from "axios";
import API from "../utils/api.js";

function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  // ✅ Fetch Providers
  const fetchProviders = async () => {
    try {
      const res = await axios.get(`${API}/api/providers`);
      setProviders(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify Admin before load
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return (window.location.href = "/login");

      try {
        const res = await axios.post(`${API}/api/auth/verify`, { token });
        if (res.data.valid) fetchProviders();
        else window.location.href = "/login";
      } catch (err) {
        console.error("❌ Auth verification failed:", err);
        window.location.href = "/login";
      }
    };
    verifyAdmin();
  }, []);

  // ✅ Toggle verified
  const toggleVerified = async (id) => {
    try {
      const res = await axios.put(`${API}/api/admin/verify/${id}`);
      setMessage(res.data.message);
      fetchProviders();
    } catch (err) {
      console.error("❌ Verify error:", err);
      setMessage("Error updating verification status.");
    }
  };

  // ✅ Handle M-Pesa Feature Payment
  const handleFeaturePayment = async (provider) => {
    const phone = prompt("Enter customer M-Pesa number (2547XXXXXXXX):");
    if (!phone) return;

    try {
      const res = await axios.post(`${API}/api/mpesa/stkpush`, {
        phone,
        amount: 50, // Feature fee (KES)
        providerId: provider._id,
      });
      alert(res.data.message || "Payment request sent to phone.");
    } catch (err) {
      console.error("❌ M-Pesa request failed:", err);
      alert("Payment request failed.");
    }
  };

  // ✅ Toggle featured
  const toggleFeatured = async (id) => {
    try {
      const res = await axios.put(`${API}/api/admin/feature/${id}`);
      setMessage(res.data.message);
      fetchProviders();
    } catch (err) {
      console.error("❌ Feature toggle failed:", err);
      setMessage("Error updating featured status.");
    }
  };

  // 🖼️ Render
  return (
    <div className="min-h-screen p-8 bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-transparent bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text">
          Admin Dashboard 🧑‍💼
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-white transition-all rounded-lg shadow-md bg-linear-to-r from-red-500 to-red-600 hover:scale-105"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className="p-3 mb-5 text-sm font-semibold text-blue-800 border border-blue-200 shadow-sm rounded-xl bg-blue-100/60">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh] text-lg text-blue-600">
          Loading providers...
        </div>
      ) : (
        <div className="p-4 overflow-x-auto bg-white border border-blue-100 shadow-lg rounded-2xl">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="tracking-wide text-left text-blue-700 uppercase bg-linear-to-r from-blue-100 via-indigo-100 to-purple-100">
                <th className="p-3 border border-blue-200">Business</th>
                <th className="p-3 border border-blue-200">City</th>
                <th className="p-3 border border-blue-200">Category</th>
                <th className="p-3 border border-blue-200">WhatsApp</th>
                <th className="p-3 text-center border border-blue-200">Verified</th>
                <th className="p-3 text-center border border-blue-200">Featured</th>
                <th className="p-3 border border-blue-200">Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((p) => (
                <tr
                  key={p._id}
                  className="transition-colors hover:bg-blue-50"
                >
                  <td className="p-3 font-medium border border-blue-100 text-slate-800">
                    {p.businessName}
                  </td>
                  <td className="p-3 border border-blue-100">{p.city}</td>
                  <td className="p-3 border border-blue-100">{p.category}</td>
                  <td className="p-3 border border-blue-100">{p.whatsapp}</td>

                  <td className="p-3 text-center border border-blue-100">
                    {p.verified ? (
                      <span className="font-semibold text-green-600">✅</span>
                    ) : (
                      <span className="text-gray-400">❌</span>
                    )}
                  </td>

                  <td className="p-3 text-center border border-blue-100">
                    {p.featured ? (
                      <span className="font-semibold text-purple-500">⭐</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="p-3 border border-blue-100">
                    <div className="flex flex-wrap gap-2">
                      {/* Verify / Unverify */}
                      <button
                        onClick={() => toggleVerified(p._id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm text-white transition-all ${
                          p.verified
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {p.verified ? "Unverify" : "Verify"}
                      </button>

                      {/* Payment */}
                      <button
                        onClick={() => handleFeaturePayment(p)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg shadow-sm hover:scale-105 transition-all"
                      >
                        💰 Pay to Feature
                      </button>

                      {/* Feature / Unfeature */}
                      <button
                        onClick={() => toggleFeatured(p._id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm text-white transition-all ${
                          p.featured
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                      >
                        {p.featured ? "Unfeature" : "Feature"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Providers */}
          {providers.length === 0 && (
            <p className="py-6 text-center text-slate-500">
              No providers found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;