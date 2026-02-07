import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../assets/Profile.png";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center relative">
      <h1 className="text-lg font-bold">Employee Task Manager</h1>

      {user && (
        <div className="flex gap-4 items-center relative" ref={profileRef}>
          <div className="hidden sm:block font-medium">
            Welcome : <span className="text-cyan-400">{user.name}</span>
          </div>

          {/* ✅ Profile Image */}
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="w-11 h-11 rounded-full overflow-hidden border cursor-pointer border-white/20 hover:scale-105 transition-all duration-300"
          >
            <img
              src={Profile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* ✅ Dropdown */}
          {openProfile && (
            <div
              className="absolute top-16 right-0 w-80 max-w-[90vw]
              bg-gray-800 border border-white/10 rounded-2xl shadow-xl
              p-4 z-50 animate-fadeIn"
            >
              {/* Top section */}
              <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                <img src={Profile} alt="" className="w-14" />

                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold">{user.name}</p>

                  {/* ✅ Email overflow fixed */}
                  <p className="text-gray-300 text-sm break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* ✅ User Details */}
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <span className="font-bold text-blue-400">Name:</span>{" "}
                  <span className="text-white font-medium">{user.name}</span>
                </p>

                <p className="flex gap-2">
                  <span className="font-bold text-blue-400 whitespace-nowrap">
                    Email:
                  </span>

                  {/* ✅ Email overflow fixed here also */}
                  <span className="text-white font-medium break-all">
                    {user.email}
                  </span>
                </p>

                <p>
                  <span className="font-bold text-blue-400">Employee ID:</span>{" "}
                  <span className="text-white font-medium">{user.empid}</span>
                </p>

                <p>
                  <span className="font-bold text-blue-400">Team:</span>{" "}
                  <span className="text-white font-medium">{user.team}</span>
                </p>
              </div>

              {/* ✅ Logout Button */}
              <button
                onClick={logout}
                className="w-full mt-4 px-4 py-2 rounded-xl font-semibold
                bg-gradient-to-r from-red-500 to-pink-600
                cursor-pointer
                hover:scale-105 transition-all duration-300
                shadow-lg shadow-red-500/20"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
