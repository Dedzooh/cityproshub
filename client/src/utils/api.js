// client/src/utils/api.js

// Use an environment variable (Vercel / Render will inject this automatically)
const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API;
