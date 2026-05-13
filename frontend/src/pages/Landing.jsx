import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Wallet,
  PieChart,
  Bell,
  Sparkles,
  Star,
  Users,
  BarChart3,
  CreditCard,
  Globe,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Play,
  Quote,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

import piggy from "../assets/images/lands.png";
import logo from "../assets/images/logo.png";

export default function Landing() {
  const navigate = useNavigate();

  // ============================
  // CURSOR GLOW
  // ============================
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e) => {
    setMouse({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // ============================
  // FEATURES
  // ============================
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Analytics",
      desc: "Visualize your income, expenses, and savings with beautiful charts.",
      color: "from-indigo-500 to-sky-500",
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Expense Tracking",
      desc: "Track every transaction and understand where your money goes.",
      color: "from-violet-500 to-indigo-500",
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Budget Planning",
      desc: "Create monthly budgets and stay financially disciplined.",
      color: "from-sky-500 to-cyan-500",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Alerts",
      desc: "Receive reminders and warnings before exceeding your budget.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      desc: "Your financial data stays protected with secure authentication.",
      color: "from-cyan-500 to-sky-500",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Savings Goals",
      desc: "Set savings goals and monitor your financial progress.",
      color: "from-violet-500 to-fuchsia-500",
    },
  ];

  // ============================
  // ABOUT CARDS
  // ============================
  const aboutCards = [
    {
      icon: <Users />,
      title: "User Friendly",
      desc: "Designed for everyone with a modern and intuitive interface.",
    },
    {
      icon: <BarChart3 />,
      title: "Real-Time Reports",
      desc: "Get instant financial insights with interactive analytics.",
    },
    {
      icon: <CreditCard />,
      title: "Track Transactions",
      desc: "Monitor all your expenses and income in one place.",
    },
    {
      icon: <Globe />,
      title: "Access Anywhere",
      desc: "Manage your finances anytime on desktop or mobile.",
    },
  ];

  // ============================
  // TESTIMONIALS
  // ============================
  const testimonials = [
    {
      name: "Nimal Perera",
      role: "Freelancer",
      review:
        "Finora completely changed the way I manage my monthly expenses and savings.",
    },
    {
      name: "Sarah Fernando",
      role: "University Student",
      review:
        "The budgeting system helped me save money consistently for the first time.",
    },
    {
      name: "Kasun Jayasinghe",
      role: "Startup Founder",
      review:
        "Beautiful UI, powerful analytics, and incredibly easy to use.",
    },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#f6f8ff] overflow-hidden relative"
    >
      {/* ============================ */}
      {/* CURSOR GLOW */}
      {/* ============================ */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              700px at ${mouse.x}px ${mouse.y}px,
              rgba(99,102,241,0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* BACKGROUND LIGHTS */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-indigo-300/30 rounded-full blur-3xl" />

      <div className="absolute top-[30%] right-[-100px] w-[350px] h-[350px] bg-sky-300/30 rounded-full blur-3xl" />

      <div className="absolute bottom-[-120px] left-[35%] w-[350px] h-[350px] bg-violet-300/20 rounded-full blur-3xl" />

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/30 bg-white/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Finora"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Finora
              </h1>

              <p className="text-xs text-gray-500">
                Smart Finance Management
              </p>
            </div>
          </div>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>

            <a href="#about" className="hover:text-indigo-600 transition">
              About
            </a>

            <a href="#testimonials" className="hover:text-indigo-600 transition">
              Reviews
            </a>

            <a href="#contact" className="hover:text-indigo-600 transition">
              Contact
            </a>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-2xl font-medium text-gray-700 hover:bg-white/60 transition-all"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold shadow-[0_10px_40px_rgba(99,102,241,0.35)] hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ========================= */}
      {/* HERO SECTION */}
      {/* ========================= */}
      <section className="relative pt-40 pb-32 px-6 lg:px-10 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg">
                <Sparkles size={16} className="text-indigo-500" />

                <span className="text-sm font-medium text-gray-700">
                  Modern Personal Finance Platform
                </span>
              </div>

              {/* HEADING */}
              <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900 mt-8">
                Take Full Control of Your{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                  Finances
                </span>
              </h1>

              {/* DESC */}
              <p className="text-lg text-gray-600 leading-relaxed mt-8 max-w-xl">
                Manage expenses, budgets, savings goals, and financial reports
                with a beautiful modern experience.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-5 mt-10">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 text-white text-lg font-semibold flex items-center justify-center gap-3 shadow-[0_20px_60px_rgba(99,102,241,0.35)]"
                >
                  Start Free Today
                  <ArrowRight />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="px-8 py-4 rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl text-lg font-medium text-gray-700 hover:bg-white/80 transition-all flex items-center justify-center gap-3"
                >
                  <Play size={18} />
                  Watch Demo
                </motion.button>
              </div>

              {/* STATS */}
              <div className="flex flex-wrap gap-10 mt-14">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">50K+</h3>

                  <p className="text-gray-500 mt-1">Active Users</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Rs. 200K+
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Managed Transactions
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-gray-900">4.9★</h3>

                  <p className="text-gray-500 mt-1">User Rating</p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1,
              }}
              className="relative flex justify-center"
            >
              {/* GLOW */}
              <div className="absolute w-[680px] h-[680px] bg-indigo-400/30 rounded-full blur-3xl" />

              <div className="absolute bottom-0 right-10 w-[260px] h-[260px] bg-sky-300/30 rounded-full blur-3xl" />

              {/* IMAGE */}
              <motion.img
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 1.5, 0, -1.5, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                }}
                src={piggy}
                alt="Finance"
                className="relative z-10 w-full max-w-[960px] object-contain drop-shadow-[0_50px_120px_rgba(99,102,241,0.35)]"
              />

              {/* FLOATING CARD 1 */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute top-8 left-0 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl p-5 shadow-2xl z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 flex items-center justify-center text-white">
                    <TrendingUp />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Monthly Savings
                    </p>

                    <h3 className="font-bold text-xl text-gray-900">
                      +18%
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING CARD 2 */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute bottom-10 right-0 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl p-5 shadow-2xl z-20"
              >
                <p className="text-sm text-gray-500">
                  Budget Progress
                </p>

                <div className="w-44 h-3 rounded-full bg-gray-200 mt-3 overflow-hidden">
                  <div className="w-[72%] h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  72% completed
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

{/* DASHBOARD SHOWCASE */}
<section className="relative z-10 py-28 px-6 lg:px-10">

  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT */}
    <div>

      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 border border-white/40 backdrop-blur-xl">

        <BarChart3 size={16} className="text-indigo-500" />

        <span className="text-sm font-medium text-gray-700">
          Powerful Insights
        </span>

      </div>

      <h2 className="text-5xl font-black text-gray-900 mt-8 leading-tight">
        Visualize Your Financial Growth
      </h2>

      <p className="text-lg text-gray-600 mt-8 leading-relaxed">
        Understand your spending habits, savings progress,
        and budget performance with interactive analytics.
      </p>

      <div className="space-y-5 mt-10">

        {[
          "Track income & expenses",
          "Smart monthly budgeting",
          "Real-time analytics",
          "Savings goal monitoring",
        ].map((item, i) => (

          <div
            key={i}
            className="flex items-center gap-4"
          >

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white flex items-center justify-center">
              <CheckCircle size={18} />
            </div>

            <p className="text-gray-700 font-medium">
              {item}
            </p>

          </div>

        ))}

      </div>

    </div>

    {/* RIGHT */}
    <div className="relative">

      <div className="absolute inset-0 bg-indigo-300/20 blur-3xl rounded-full" />

      <div className="relative rounded-[40px] border border-white/40 bg-white/70 backdrop-blur-2xl p-8 shadow-[0_20px_100px_rgba(99,102,241,0.12)]">

        {/* TOP CARD */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-sky-500 p-6 text-white">

          <p className="text-sm opacity-80">
            Total Savings
          </p>

          <h3 className="text-4xl font-black mt-2">
            Rs. 245,000
          </h3>

          <p className="mt-2 text-sm opacity-80">
            +18% this month
          </p>

        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-2 gap-5 mt-6">

          <div className="rounded-3xl bg-[#f6f8ff] p-5">
            <p className="text-gray-500 text-sm">
              Expenses
            </p>

            <h4 className="text-2xl font-bold mt-2">
              Rs. 48K
            </h4>
          </div>

          <div className="rounded-3xl bg-[#f6f8ff] p-5">
            <p className="text-gray-500 text-sm">
              Income
            </p>

            <h4 className="text-2xl font-bold mt-2">
              Rs. 120K
            </h4>
          </div>

        </div>

        {/* PROGRESS */}
        <div className="mt-6 rounded-3xl bg-[#f6f8ff] p-6">

          <div className="flex justify-between">

            <p className="font-medium text-gray-700">
              Budget Progress
            </p>

            <p className="text-indigo-600 font-bold">
              72%
            </p>

          </div>

          <div className="mt-4 h-4 rounded-full bg-gray-200 overflow-hidden">

            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" />

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 py-24 px-6 lg:px-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/40">
              <Star size={16} className="text-indigo-500" />

              <span className="text-sm font-medium text-gray-700">
                Powerful Features
              </span>
            </div>

            <h2 className="text-5xl font-bold text-gray-900 mt-6">
              Everything You Need
            </h2>

            <p className="text-lg text-gray-500 mt-5 max-w-2xl mx-auto">
              A complete financial management system designed to simplify your
              daily money management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -8,
                }}
                className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-2xl p-8 shadow-[0_20px_80px_rgba(99,102,241,0.08)]"
              >
                <div
                  className={`absolute top-[-80px] right-[-80px] w-44 h-44 rounded-full blur-3xl bg-gradient-to-r ${feature.color} opacity-20`}
                />

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white flex items-center justify-center shadow-lg relative z-10`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mt-8 relative z-10">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mt-4 leading-relaxed relative z-10">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative z-10 py-24 px-6 lg:px-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/40">
                <Users size={16} className="text-indigo-500" />

                <span className="text-sm font-medium text-gray-700">
                  About Finora
                </span>
              </div>

              <h2 className="text-5xl font-bold text-gray-900 mt-8 leading-tight">
                Built to Simplify Financial Management
              </h2>

              <p className="text-lg text-gray-600 mt-8 leading-relaxed">
                Finora helps individuals manage budgets, monitor expenses, and
                gain financial clarity through a clean modern interface and
                smart analytics.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                {aboutCards.map((card, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-2xl p-6 shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white flex items-center justify-center">
                      {card.icon}
                    </div>

                    <h3 className="text-xl font-bold mt-5 text-gray-900">
                      {card.title}
                    </h3>

                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex justify-center">
              <div className="absolute w-[400px] h-[400px] bg-indigo-300/30 rounded-full blur-3xl" />

              <div className="rounded-[40px] border border-white/40 bg-white/60 backdrop-blur-2xl p-10 shadow-[0_20px_100px_rgba(99,102,241,0.12)] relative z-10">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-4xl font-black text-indigo-600">
                      98%
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Users improved their savings habits within 3 months.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-4xl font-black text-sky-500">
                      24/7
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Secure access to your financial dashboard anytime.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-4xl font-black text-violet-500">
                      Smart
                    </h3>

                    <p className="text-gray-600 mt-2">
                      AI-powered insights and budgeting recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="relative z-10 py-24 px-6 lg:px-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900">
              What Users Say
            </h2>

            <p className="text-lg text-gray-500 mt-5">
              Thousands already trust Finora for smarter money management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-2xl p-8 shadow-[0_20px_80px_rgba(99,102,241,0.08)]"
              >
                <Quote className="text-indigo-500" />

                <p className="text-gray-600 leading-relaxed mt-6">
                  {item.review}
                </p>

                <div className="mt-8">
                  <h3 className="font-bold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-10 pb-28">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[40px] bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 p-12 lg:p-20 text-white shadow-[0_30px_120px_rgba(99,102,241,0.35)]">
          <div className="absolute top-[-120px] right-[-100px] w-[320px] h-[320px] bg-white/10 rounded-full blur-3xl" />

          <div className="absolute bottom-[-120px] left-[-80px] w-[300px] h-[300px] bg-sky-300/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <h2 className="text-5xl lg:text-6xl font-black leading-tight">
              Ready to Transform Your Financial Life?
            </h2>

            <p className="text-xl text-white/80 mt-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users already managing their finances smarter
              with Finora.
            </p>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() => navigate("/register")}
              className="mt-12 px-10 py-5 rounded-3xl bg-white text-indigo-600 text-xl font-bold shadow-2xl"
            >
              Create Free Account
            </motion.button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="relative z-10 border-t border-white/30 bg-white/50 backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Finora"
                  className="w-12 h-12"
                />

                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                    Finora
                  </h1>

                  <p className="text-xs text-gray-500">
                    Smart Finance Management
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mt-6 leading-relaxed">
                Modern financial management platform for budgeting, expense
                tracking, and savings growth.
              </p>
            </div>

            {/* PRODUCT */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-5">
                Product
              </h3>

              <div className="space-y-3 text-gray-600">
                <p className="hover:text-indigo-600 cursor-pointer transition">
                  Features
                </p>

                <p className="hover:text-indigo-600 cursor-pointer transition">
                  Analytics
                </p>

                <p className="hover:text-indigo-600 cursor-pointer transition">
                  Budgets
                </p>

                <p className="hover:text-indigo-600 cursor-pointer transition">
                  Reports
                </p>
              </div>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-5">
                Company
              </h3>

              <div className="space-y-3 text-gray-600">
                <p className="hover:text-indigo-600 cursor-pointer transition">
                  About
                </p>

                <p className="hover:text-indigo-600 cursor-pointer transition">
                  Careers
                </p>

                <p className="hover:text-indigo-600 cursor-pointer transition">
                  Privacy
                </p>

                <p className="hover:text-indigo-600 cursor-pointer transition">
                  Terms
                </p>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-5">
                Contact
              </h3>

              <div className="space-y-4 text-gray-600">
                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  support@finora.com
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} />
                  +94 77 123 4567
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  Colombo, Sri Lanka
                </div>
              </div>

              {/* SOCIALS */}
              <div className="flex items-center gap-4 mt-6">
                <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition">
                  <Twitter size={18} />
                </div>

                <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition">
                  <Linkedin size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-white/30 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2026 Finora. All rights reserved.</p>

            <p className="mt-3 md:mt-0">
              Designed with 💜 for smarter finance management
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}