import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      localStorage.setItem("adminToken", res.data.token);
      setMessage("✅ Login successful!");
      window.location.href = "/admin";
    } catch (err) {
      setMessage("❌ Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 bg-white shadow-lg rounded-xl"
      >
        <h2 className="mb-4 text-2xl font-bold text-green-600">Admin Login</h2>

        {message && (
          <div className="p-3 mb-4 text-green-700 border border-green-200 rounded-lg bg-green-50">
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
