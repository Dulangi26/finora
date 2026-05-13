import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";

import registerImage from "../assets/images/regi.png";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/images/google.png";

export default function Register() {

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // =========================
  // FORM STATES (ADDED ONLY)
  // =========================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  // =========================
  // REGISTER HANDLER (ADDED ONLY)
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Account created successfully");

      // auto redirect to login
      navigate("/login");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  // =========================
  // CURSOR GLOW
  // =========================
  const handleMouseMove = (e) => {
    setMouse({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen flex relative overflow-hidden bg-[#f6f8ff]"
    >

      {/* CURSOR GLOW */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              600px at ${mouse.x}px ${mouse.y}px,
              rgba(99,102,241,0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* FLOATING BLOBS (UNCHANGED UI) */}
      <div className="absolute top-[-120px] left-[-120px] w-[380px] h-[380px] bg-indigo-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-sky-300/30 rounded-full blur-3xl" />

      {/* LEFT IMAGE (UNCHANGED) */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex w-1/2 h-screen items-center justify-center relative z-10"
      >
        <motion.img
          animate={{
            y: [0, -18, 0],
            rotate: [0, 1.5, 0, -1.5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          src={registerImage}
          className="max-w-[85%] max-h-[85%] object-contain"
        />
      </motion.div>

      {/* RIGHT FORM (UNCHANGED UI + API CONNECTED) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6 relative z-[1]">

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-sm"
        >

          <div className="relative overflow-hidden rounded-[28px] border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_20px_80px_rgba(99,102,241,0.15)] p-6">

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="relative z-10"
            >

              {/* LOGO (UNCHANGED) */}
              <motion.div variants={item} className="flex items-center gap-3 mb-6">
                <img src={logo} className="w-10 h-10" />
                <div>
                  <h1 className="text-2xl font-bold text-indigo-600">
                    Finora
                  </h1>
                  <p className="text-[11px] text-gray-500">
                    Smart Finance Management
                  </p>
                </div>
              </motion.div>

              <motion.h2 variants={item} className="text-2xl font-bold mb-1">
                Create Account 🚀
              </motion.h2>

              <motion.p variants={item} className="text-sm text-gray-500 mb-5">
                Start tracking your finances today.
              </motion.p>

              {/* FORM (ONLY CHANGE = onSubmit + state binding) */}
              <motion.form
                variants={container}
                className="space-y-4"
                onSubmit={handleRegister}
              >

                {/* NAME */}
                <motion.div variants={item} className="relative">
                  <User className="absolute left-4 top-3.5 text-indigo-400" size={17} />

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80"
                  />
                </motion.div>

                {/* EMAIL */}
                <motion.div variants={item} className="relative">
                  <Mail className="absolute left-4 top-3.5 text-indigo-400" size={17} />

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-white/80"
                  />
                </motion.div>

                {/* PASSWORD */}
                <motion.div variants={item} className="relative">
                  <Lock className="absolute left-4 top-3.5 text-indigo-400" size={17} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border bg-white/80"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </motion.div>

                {/* CONFIRM PASSWORD */}
                <motion.div variants={item} className="relative">
                  <Lock className="absolute left-4 top-3.5 text-indigo-400" size={17} />

                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border bg-white/80"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-3.5"
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </motion.div>

                {/* REGISTER BUTTON */}
                <motion.button
                  variants={item}
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 text-white"
                >
                  Create Account
                </motion.button>

                {/* GOOGLE + SIGNUP UI untouched */}
                <motion.button
                  variants={item}
                  type="button"
                  className="w-full py-3 rounded-xl border bg-white/70 flex items-center justify-center gap-3"
                >
                  <img src={googleIcon} className="w-5 h-5" />
                  Continue with Google
                </motion.button>

                <motion.p variants={item} className="text-center text-sm">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-indigo-600 cursor-pointer font-semibold"
                  >
                    Login
                  </span>
                </motion.p>

              </motion.form>

            </motion.div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}