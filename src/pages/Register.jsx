import { useEffect, useState } from "react";
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

  const [showPassword, setShowPassword] = useState(false);

  // 🔥 Resend timer
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  // ✅ Timer countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Reset OTP if email changes
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setTimer(0);
  }, [email]);

  // ✅ SEND OTP
  const sendOtp = async () => {
    if (!email) return toast.error("Enter email first ❌");

    try {
      setOtpLoading(true);

      const res = await api.post("/api/auth/send-otp", { email });

      toast.success(res.data.message || "OTP sent ✅");
      setOtpSent(true);
      setTimer(60); // 🔥 60 sec wait for resend
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP ❌");
    } finally {
      setOtpLoading(false);
    }
  };

  // ✅ VERIFY OTP + REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpSent) return toast.error("Please send OTP first ❌");
    if (!otp || otp.length !== 6) return toast.error("Enter valid 6-digit OTP ❌");

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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 px-4 overflow-hidden">
      {/* 🔥 Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-600/20 blur-[120px] rounded-full"></div>
      </div>

      <form
        onSubmit={handleRegister}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl
        border border-white/10 rounded-3xl p-8
        shadow-[0_0_40px_rgba(34,197,94,0.18)]"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Employee Registration
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Verify your email with OTP to create your account
        </p>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 px-4 py-3 rounded-xl
          bg-black/40 border border-white/10 text-white
          outline-none transition-all duration-300
          focus:border-green-400/60 focus:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-3 rounded-xl
          bg-black/40 border border-white/10 text-white
          outline-none transition-all duration-300
          focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Send OTP */}
        <button
          type="button"
          onClick={sendOtp}
          disabled={otpLoading || timer > 0}
          className="w-full mb-4 py-3 rounded-xl font-semibold text-white
          transition-all duration-300
          bg-gradient-to-r from-blue-600 to-cyan-500
          hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {otpLoading
            ? "Sending OTP..."
            : otpSent
            ? timer > 0
              ? `Resend OTP in ${timer}s`
              : "Resend OTP"
            : "Send OTP"}
        </button>

        {/* OTP input */}
        {otpSent && (
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="w-full mb-3 px-4 py-3 rounded-xl
            bg-black/40 border border-white/10 text-white
            outline-none transition-all duration-300
            focus:border-purple-400/60 focus:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
          />
        )}

        {/* Employee ID */}
        <input
          type="text"
          placeholder="Employee ID"
          className="w-full mb-3 px-4 py-3 rounded-xl
          bg-black/40 border border-white/10 text-white
          outline-none transition-all duration-300
          focus:border-pink-400/60 focus:shadow-[0_0_20px_rgba(236,72,153,0.25)]"
          value={empid}
          onChange={(e) => setEmpid(e.target.value)}
          required
        />

        {/* Team */}
        <select
          className="w-full mb-3 px-4 py-3 rounded-xl
          bg-black border border-white/10 text-white
          outline-none transition-all duration-300
          focus:border-blue-400/60 focus:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="Development Team">Development Team</option>
          <option value="IT Team">IT Team</option>
          <option value="Operations Team">Operations Team</option>
        </select>

        {/* Password + Show/Hide */}
        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl
            bg-black/40 border border-white/10 text-white
            outline-none transition-all duration-300
            focus:border-yellow-400/60 focus:shadow-[0_0_20px_rgba(250,204,21,0.20)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300
            hover:text-white transition"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Register */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white
          transition-all duration-300
          bg-gradient-to-r from-green-600 to-cyan-500
          hover:scale-105 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Creating..." : "Verify OTP & Register"}
        </button>

        <p className="text-sm mt-5 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
