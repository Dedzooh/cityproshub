import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLogin from "./page/AdminLogin";
import AdminDashboard from "./page/AdminDashboard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 🧭 Enhanced Navbar with new blue-purple gradient theme
// 🧭 Enhanced Navbar with logo + flag + gradient
function Navbar() {
  return (
    <header className="fixed z-50 w-full max-w-4xl px-4 py-3 transform -translate-x-1/2 border shadow-xl top-4 left-1/2 sm:px-6 rounded-2xl backdrop-blur-md bg-white/95 border-white/20">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          to="/"
          className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
          aria-label="CityProsHub Home"
        >
          {/* 3D Handshake Logo */}
          <img
            src="/logo.png"
            alt="CityProsHub Logo"
            className="w-8 h-8 rounded-full shadow-md sm:w-10 sm:h-10"
          />
          
          {/* Brand text and flag */}
          <div className="flex items-center space-x-1">
            <span className="text-xl font-black tracking-wide text-transparent sm:text-2xl bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text">
              CityProsHub
            </span>
            <span className="text-xs sm:text-sm animate-pulse">🇰🇪</span>
          </div>
        </Link>

        {/* Navigation buttons */}
        <nav className="flex flex-wrap items-center justify-end w-full gap-2 sm:gap-4 sm:w-auto" role="navigation">
          <Link
            to="/add"
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-center text-white transition-all duration-300 shadow-lg bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 sm:text-sm rounded-xl hover:scale-105 hover:shadow-xl sm:flex-none sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Add New Service Listing"
          >
            + List Service
          </Link>
          <Link
            to="/login"
            className="flex-1 px-4 py-2.5 text-xs font-medium text-center transition-all duration-300 border sm:text-sm text-slate-700 border-slate-300 rounded-xl hover:bg-slate-50 hover:border-blue-300 sm:flex-none sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Admin Login"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}


// 🏡 Enhanced Home Page with blue-purple gradient theme for trust & professionalism
function Home() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [bgIndex, setBgIndex] = useState(0);

  // ✅ Hero images remain the same, but overlay adjusted for new theme
  const heroImages = [
    "https://images.unsplash.com/photo-1594938298603-c8148e5c299c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1621605815971-63b3b3cfd4a2?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1617043786385-3f4928bfa12c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1604881991648-15a2d8b17b3b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d4e?auto=format&fit=crop&w=1600&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const debouncedFetch = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${API_BASE}/api/providers?${query}`, { timeout: 10000 });
      setProviders(res.data);
      setError("");
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError("⚠️ Failed to fetch providers. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedFetch({ category: category.trim(), city: city.trim() });
  };

  const SkeletonCard = () => (
    <div className="overflow-hidden bg-white border shadow-lg rounded-3xl border-slate-200 animate-pulse">
      <div className="h-40 bg-slate-200"></div>
      <div className="p-6 space-y-4">
        <div className="w-3/4 h-6 rounded bg-slate-200"></div>
        <div className="w-1/2 h-4 rounded bg-slate-200"></div>
        <div className="h-20 rounded bg-slate-200"></div>
        <div className="h-10 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with blue-purple overlay */}
      <section
        className="relative flex items-center justify-center min-h-[80vh] sm:min-h-screen text-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImages[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-blue-900/20"></div>
        <div className="relative z-10 max-w-4xl px-4 py-16 border shadow-2xl sm:px-6 sm:py-20 bg-white/80 backdrop-blur-md rounded-3xl border-white/50">
          <h1 className="mb-4 text-4xl font-black leading-tight text-transparent sm:text-6xl md:text-7xl sm:mb-6 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text">
            Trusted Pros Near You
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-base leading-relaxed text-slate-700 sm:text-xl sm:mb-12">
            Kenya's premier hub for verified local experts — from plumbers to builders. Connect in one tap.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col justify-center gap-3 p-4 border shadow-md sm:flex-row sm:gap-4 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-md border-white/60"
            role="search"
          >
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Service (e.g., plumber, electrician)"
              className="flex-1 px-4 py-3 text-base transition-all bg-white sm:px-6 sm:py-4 rounded-2xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
              aria-label="Search by service category"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g., Nairobi, Mombasa)"
              className="w-full px-4 py-3 text-base transition-all bg-white sm:w-48 sm:px-6 sm:py-4 rounded-2xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
              aria-label="Search by city"
            />
            <button
              type="submit"
              className="px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg sm:px-8 sm:py-4 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-2xl hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Search for professionals"
            >
              🔍 Find Pros
            </button>
          </form>
        </div>
      </section>

      {/* Providers Section */}
      <section className="max-w-6xl px-4 py-12 mx-auto sm:px-6 sm:py-24">
        {error && (
          <div className="p-4 mb-6 text-lg text-center text-red-700 border border-red-200 bg-red-50 rounded-2xl">
            {error}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8 auto-rows-fr">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-xl text-slate-500">No Pros Found — Try Refining Your Search!</p>
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full">
              <span className="text-4xl">🔍</span>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mb-12 text-3xl font-black text-center sm:text-4xl text-slate-900 sm:mb-16">
              Top Local Experts
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8 auto-rows-fr">
              {providers.map((p, i) => (
                <article
                  key={p._id}
                  className={`group/card overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border border-slate-200 cursor-pointer ${
                    i % 4 === 1 ? "lg:col-span-2" : ""
                  }`}
                  role="article"
                >
<div className="relative overflow-hidden">
  <img
  src={p.imageUrl || "/fallback.jpg"}
  alt={p.businessName || "CityProsHub Provider"}
  className="object-cover w-full h-40 transition-transform duration-700 sm:h-48 group-hover/card:scale-110"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/fallback.jpg";
  }}
/>


                    <div className="absolute transition-opacity duration-300 opacity-0 top-2 right-2 group-hover/card:opacity-100">
                      <span className="px-2 py-1 text-xs font-semibold text-white rounded-full bg-black/70">Verified</span>
                    </div>
                  </div>
                  <div className="relative z-10 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold transition-colors duration-300 sm:text-2xl text-slate-900 group-hover/card:text-blue-600 line-clamp-1">
                        {p.businessName}
                      </h3>
                      <span className="px-2 py-1 text-xs font-semibold text-blue-700 transition-transform duration-300 bg-blue-100 rounded-full sm:text-sm group-hover/card:scale-110">
                        ★ {p.rating || 4.8}
                      </span>
                    </div>
                    <p className="flex items-center gap-1 mb-3 text-xs sm:text-sm text-slate-500 line-clamp-1">
                      <span className="text-blue-600">📍</span> {p.city} • {p.category}
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base sm:mb-6 line-clamp-2">
                      {p.description}
                    </p>
                    <a
                      href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(
                        `Hi ${p.businessName}, I found you on CityProsHub! Interested in ${p.category} services in ${p.city}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 text-sm font-semibold text-center text-white transition-all duration-300 shadow-md sm:px-6 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-2xl hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Connect with ${p.businessName} on WhatsApp`}
                    >
                      💬 Connect on WhatsApp
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

// 📝 Enhanced Add Listing with blue-purple theme
function AddListing() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    category: "",
    city: "",
    description: "",
    whatsapp: "",
    imageUrl: "",
    imagePreview: null,
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: file, imagePreview: previewUrl });
    }
  };

  const validateForm = () => {
    if (!formData.businessName || !formData.category || !formData.city || !formData.description || !formData.whatsapp) {
      setMessage("❌ Please fill in all required fields.");
      return false;
    }
    if (!formData.whatsapp.startsWith('254') && !formData.whatsapp.startsWith('+254')) {
      setMessage("❌ WhatsApp number must start with 254 or +254.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'imagePreview' && key !== 'imageUrl' || typeof formData[key] !== 'object') {
          submitData.append(key, formData[key]);
        }
      });
      if (formData.imageUrl instanceof File) {
        submitData.append('image', formData.imageUrl);
      }

      await axios.post(`${API_BASE}/api/providers`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage("✅ Listing Added Successfully! It will appear after admin approval.");
      setFormData({
        name: "",
        businessName: "",
        category: "",
        city: "",
        description: "",
        whatsapp: "",
        imageUrl: "",
        imagePreview: null,
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Submission failed. Please try again or contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:py-20 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 border shadow-2xl sm:p-8 backdrop-blur-xl bg-white/90 rounded-3xl border-white/40"
      >
        <h2 className="mb-6 text-2xl font-black text-center text-transparent sm:text-3xl sm:mb-8 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text">
          Add Your Service
        </h2>
        {message && (
          <div
            className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-2xl text-center font-semibold transition-all text-sm sm:text-base ${
              message.includes("✅")
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
        <div className="space-y-3 sm:space-y-4">
          {["name", "businessName", "category", "city", "whatsapp"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={
                field === "name"
                  ? "Your Name"
                  : field === "businessName"
                  ? "Business Name"
                  : field === "category"
                  ? "Category (e.g., Plumbing)"
                  : field === "city"
                  ? "City (e.g., Nairobi)"
                  : "WhatsApp (e.g., 2547XXXXXXXX)"
              }
              required={field !== "name"}
              className="w-full p-3 text-base transition-all bg-white border sm:p-4 rounded-xl border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            />
          ))}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your services in detail (e.g., experience, rates, availability)..."
            rows="4"
            required
            className="w-full p-3 text-base transition-all bg-white border resize-none sm:p-4 rounded-xl border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-3 text-base transition-all bg-white border sm:p-4 rounded-xl border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.imagePreview && (
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="object-cover w-full h-32 border rounded-xl border-slate-300"
            />
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-sm font-bold text-white transition-all shadow-lg sm:py-4 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-xl hover:shadow-xl hover:scale-105 sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {submitting ? "⏳ Submitting..." : "🚀 Submit & Go Live"}
          </button>
        </div>
      </form>
    </div>
  );
}

// 🌍 Enhanced App Wrapper
function App() {
  return (
    <Router>
      <div className="pt-20 sm:pt-24">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddListing />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      <footer className="px-4 py-8 text-xs text-center border-t sm:py-12 sm:text-sm text-slate-600 bg-linear-to-r from-blue-100 via-purple-50 to-blue-100 border-slate-200">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-bold text-blue-700">CityProsHub Kenya</span> | Empowering Local Pros with ❤️ |{" "}
          <Link to="/privacy" className="underline hover:text-blue-600">Privacy</Link> |{" "}
          <Link to="/terms" className="underline hover:text-blue-600">Terms</Link>
        </p>
      </footer>
    </Router>
  );
}

export default App;