import { useEffect, useState } from "react";
import axios from "axios";
import API from "../utils/api.js";

function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch all providers
  const fetchProviders = async () => {
    try {
      const res = await axios.get(`${API}/api/providers`);
      setProviders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // ✅ Toggle verified
  const toggleVerified = async (id) => {
    try {
      const res = await axios.put(`${API}/api/admin/verify/${id}`);
      setMessage(res.data.message);
      fetchProviders();
    } catch (err) {
      console.error(err);
      setMessage("Error updating verification");
    }
  };

  // ✅ Toggle featured
  const toggleFeatured = async (id) => {
    try {
      const res = await axios.put(`${API}/api/admin/feature/${id}`);
      setMessage(res.data.message);
      fetchProviders();
    } catch (err) {
      console.error(err);
      setMessage("Error updating featured status");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="mb-4 text-3xl font-bold text-green-600">
        Admin Dashboard 🧑‍💼
      </h1>

      {message && (
        <div className="p-3 mb-4 text-green-700 border border-green-200 rounded-lg bg-green-50">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading providers...</p>
      ) : (
        <div className="p-4 overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left bg-green-100">
                <th className="p-2 border">Business</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">WhatsApp</th>
                <th className="p-2 border">Verified</th>
                <th className="p-2 border">Featured</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-2 font-medium text-gray-800 border">
                    {p.businessName}
                  </td>
                  <td className="p-2 border">{p.city}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">{p.whatsapp}</td>

                  <td className="p-2 text-center border">
                    {p.verified ? (
                      <span className="font-semibold text-green-600">✅</span>
                    ) : (
                      <span className="text-gray-400">❌</span>
                    )}
                  </td>

                  <td className="p-2 text-center border">
                    {p.featured ? (
                      <span className="font-semibold text-yellow-500">⭐</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleVerified(p._id)}
                        className={`px-3 py-1 rounded-lg text-white ${
                          p.verified
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {p.verified ? "Unverify" : "Verify"}
                      </button>

                      <button
                        onClick={() => toggleFeatured(p._id)}
                        className={`px-3 py-1 rounded-lg text-white ${
                          p.featured
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-gray-500 hover:bg-gray-600"
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
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
