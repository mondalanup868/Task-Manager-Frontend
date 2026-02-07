import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Login successful ✅");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 px-4 overflow-hidden">
      {/* 🔥 Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl
        border border-white/10 rounded-3xl p-8
        shadow-[0_0_35px_rgba(59,130,246,0.22)]"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Employee Login
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Login to manage your tasks & reports 
        </p>

        {/* Email */}
        <label className="text-gray-300 text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-2 mb-4 px-4 py-3 rounded-xl
          bg-black/40 border border-white/10 text-white
          outline-none transition-all duration-300
          focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="text-gray-300 text-sm font-medium">Password</label>

        <div className="relative mt-2 mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-xl
            bg-black/40 border border-white/10 text-white
            outline-none transition-all duration-300
            focus:border-purple-400/60 focus:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 👁️ Show/Hide */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300
            hover:text-white transition"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white
          transition-all duration-300
          bg-gradient-to-r from-blue-600 to-cyan-500
          hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-5 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
