import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [empid, setEmpid] = useState("");
  const [team, setTeam] = useState("Development Team");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ SEND OTP
  const sendOtp = async () => {
    if (!email) return toast.error("Enter email first ❌");

    try {
      setOtpLoading(true);
      const res = await api.post("/api/auth/send-otp", { email });
      toast.success(res.data.message);
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP ❌");
    } finally {
      setOtpLoading(false);
    }
  };

  // ✅ VERIFY OTP + REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpSent) return toast.error("Please verify email with OTP first ❌");
    if (!otp) return toast.error("Enter OTP ❌");

    setLoading(true);

    try {
      const res = await api.post("/api/auth/verify-otp-register", {
        name,
        email,
        empid,
        team,
        password,
        otp,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Registered successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl
        border border-white/10 rounded-3xl p-8
        shadow-[0_0_30px_rgba(34,197,94,0.20)]"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Employee Registration
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Send OTP */}
        <button
          type="button"
          onClick={sendOtp}
          disabled={otpLoading}
          className="w-full mb-4 py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-blue-600 to-cyan-500
          hover:scale-105 transition-all duration-300
          disabled:opacity-50"
        >
          {otpLoading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* OTP input */}
        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        <input
          type="text"
          placeholder="Employee ID"
          className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
          value={empid}
          onChange={(e) => setEmpid(e.target.value)}
          required
        />

        <select
          className="w-full mb-3 px-4 py-3 rounded-xl bg-black border border-white/10 text-white"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="Development Team">Development Team</option>
          <option value="IT Team">IT Team</option>
          <option value="Operations Team">Operations Team</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Register */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-green-600 to-cyan-500
          hover:scale-105 transition-all duration-300
          disabled:opacity-50"
        >
          {loading ? "Creating..." : "Verify OTP & Register"}
        </button>

        <p className="text-sm mt-5 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
