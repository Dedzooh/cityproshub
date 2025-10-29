// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./page/AdminDashboard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"; // <- added

// --- Home Page Component ---
function Home() {
  const [providers, setProviders] = useState([]);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const fetchProviders = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${API_BASE}/api/providers?${query}`); // <- uses API_BASE
      setProviders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders({ category, city });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 text-center bg-green-50">
        <h2 className="mb-4 text-4xl font-bold text-gray-800">
          Find Trusted Professionals Near You
        </h2>
        <p className="mb-6 text-gray-600">
          Discover skilled service providers across Kenya — connect instantly on
          WhatsApp.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-wrap justify-center gap-3"
        >
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. plumber)"
            className="w-64 px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Nairobi)"
            className="w-40 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Search
          </button>
        </form>
      </section>

      {/* Providers Section */}
      <section className="max-w-6xl px-4 py-10 mx-auto">
        <h3 className="mb-6 text-2xl font-semibold text-gray-800">
          {providers.length > 0 ? "Available Providers" : "No Providers Found"}
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
{providers
  .sort((a, b) => (b.featured === true) - (a.featured === true))
  .map((p) => (
            <div
              key={p._id}
              className="p-5 transition bg-white border shadow rounded-xl hover:shadow-lg"
            >
              <img
                src={
                  p.imageUrl ||
                  "https://via.placeholder.com/400x200?text=CityProsHub"
                }
                
                alt={p.businessName}
                className="object-cover w-full h-40 mb-3 rounded-lg"
              />
              {p.featured && (
  <div className="px-2 py-1 mb-2 text-xs font-semibold text-white bg-yellow-400 rounded-full w-fit">
    ⭐ Featured
  </div>
)}

              <h4 className="flex items-center gap-1 text-lg font-semibold text-green-700">
                {p.businessName}
                {p.verified && (
                  <span className="text-sm text-blue-500" title="Verified Provider">
                    ✅
                  </span>
                )}
              </h4>

              <p className="mb-1 text-sm text-gray-600">
                {p.city} • {p.category}
              </p>
              <p className="mb-3 text-sm text-gray-700">{p.description}</p>
              <a
                href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(
                  `Hi ${p.businessName}, I found you on CityProsHub and would like to know more about your ${p.category} services in ${p.city}.`
                )}`}
                target="_blank"
                className="inline-block px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Chat on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// --- Add Listing Page Component ---
function AddListing() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    category: "",
    city: "",
    description: "",
    whatsapp: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/providers`, formData); // <- uses API_BASE
      setMessage("✅ Provider added successfully!");
      setFormData({
        name: "",
        businessName: "",
        category: "",
        city: "",
        description: "",
        whatsapp: "",
        imageUrl: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding provider. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl"
      >
        <h2 className="mb-4 text-2xl font-bold text-green-600">
          Add Your Listing
        </h2>

        {message && (
          <div className="p-3 mb-4 text-green-700 border border-green-200 rounded-lg bg-green-50">
            {message}
          </div>
        )}

        <div className="grid gap-3">
          {["name", "businessName", "category", "city", "whatsapp", "imageUrl"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required={field !== "imageUrl"}
              className="p-2 border rounded-lg"
            />
          ))}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short Description"
            rows="3"
            required
            className="p-2 border rounded-lg"
          ></textarea>

          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Submit Listing
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Root App Wrapper ---
function App() {
  return (
    <Router>
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="flex items-center justify-between max-w-6xl p-4 mx-auto">
          <Link to="/" className="text-2xl font-bold text-green-600">
            CityProsHub 🇰🇪
          </Link>
          <Link
            to="/add"
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Add Listing
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddListing />} />
  <Route path="/admin" element={<AdminDashboard />} /> {/* ✅ New */}
      </Routes>

      {/* Footer */}
      <footer className="py-6 mt-10 text-center text-gray-300 bg-gray-800">
        <p>© {new Date().getFullYear()} CityProsHub Kenya. All Rights Reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
