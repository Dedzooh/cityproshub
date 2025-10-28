import { useState } from "react";
import axios from "axios";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/providers", formData);
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
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
            className="p-2 border rounded-lg"
          />

          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Business Name"
            required
            className="p-2 border rounded-lg"
          />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category (e.g. Plumber)"
            required
            className="p-2 border rounded-lg"
          />

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City (e.g. Nairobi)"
            required
            className="p-2 border rounded-lg"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short Description"
            rows="3"
            required
            className="p-2 border rounded-lg"
          ></textarea>

          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp Number (e.g. 2547XXXXXXXX)"
            required
            className="p-2 border rounded-lg"
          />

          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="p-2 border rounded-lg"
          />

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

export default AddListing;
