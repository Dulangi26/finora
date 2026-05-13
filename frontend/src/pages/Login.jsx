import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";

import loginImage from "../assets/images/login.png";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/images/google.png";

export default function Login() {

  const navigate = useNavigate();

  // =========================
  // PASSWORD TOGGLE
  // =========================
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // CURSOR GLOW
  // =========================
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  // =========================
  // FORM STATE (ADDED ONLY)
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // LOGIN HANDLER (ADDED ONLY)
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Invalid email or password");
    }
  };

  const handleMouseMove = (e) => {

    setMouse({
      x: e.clientX,
      y: e.clientY,
    });

  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen flex relative overflow-hidden bg-[#f6f8ff]"
    >

      {/* ========================= */}
      {/* CURSOR GLOW */}
      {/* ========================= */}
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

      {/* FLOATING BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[380px] h-[380px] bg-indigo-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-sky-300/30 rounded-full blur-3xl" />

      {/* ========================= */}
      {/* LEFT IMAGE */}
      {/* ========================= */}
      <motion.div
        initial={{
          opacity: 0,
          x: -80,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 1,
        }}
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
          src={loginImage}
          alt="Login Visual"
          className="max-w-[85%] max-h-[85%] object-contain"
        />

      </motion.div>

      {/* ========================= */}
      {/* RIGHT FORM */}
      {/* ========================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            x: 80,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            w-full
            max-w-sm
            rounded-[32px]
            border border-white/40
            bg-white/60
            backdrop-blur-2xl
            shadow-[0_10px_50px_rgba(0,0,0,0.06)]
            p-8
          "
        >

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">

            <img
              src={logo}
              alt="Finora Logo"
              className="w-11 h-11"
            />

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Finora
              </h1>

              <p className="text-xs text-gray-500">
                Smart Finance Management
              </p>

            </div>

          </div>

          {/* HEADING */}
          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            Welcome Back 👋
          </h2>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Login to continue managing your finances.
          </p>

          {/* FORM (ONLY CHANGE HERE = onSubmit + state binding) */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div className="relative">

              <Mail
                className="absolute left-4 top-3.5 text-indigo-400"
                size={18}
              />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  pl-12
                  pr-4
                  py-3
                  rounded-2xl
                  bg-white/70
                  border border-white/50
                  focus:ring-2
                  focus:ring-indigo-500
                  outline-none
                "
              />

            </div>

            {/* PASSWORD */}
            <div className="relative">

              <Lock
                className="absolute left-4 top-3.5 text-indigo-400"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  pl-12
                  pr-12
                  py-3
                  rounded-2xl
                  bg-white/70
                  border border-white/50
                  focus:ring-2
                  focus:ring-indigo-500
                  outline-none
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                  absolute
                  right-4
                  top-3.5
                  text-gray-400
                "
              >

                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }

              </button>

            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">

              <button
                type="button"
                className="text-xs text-indigo-600"
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              className="
                w-full
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-indigo-500
                via-violet-500
                to-sky-500
                text-white
                font-semibold
              "
            >
              Login
            </motion.button>

            {/* GOOGLE */}
            <button
              type="button"
              className="
                w-full
                py-3
                rounded-2xl
                border
                bg-white/70
                flex items-center justify-center gap-3
              "
            >

              <img
                src={googleIcon}
                className="w-5 h-5"
              />

              Continue with Google

            </button>

            {/* SIGNUP */}
            <p className="text-center text-sm text-gray-600 pt-2">

              Don’t have an account?{" "}

              <span
                onClick={() =>
                  navigate("/register")
                }
                className="text-indigo-600 cursor-pointer font-semibold"
              >
                Sign up
              </span>

            </p>

          </form>

        </motion.div>

      </div>

    </div>
  );
}