import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Wallet,
  Target,
  TrendingUp,
  Settings,
  BrainCircuit,
  LogOut,
  Tags,
  BarChart3,
  Trophy,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/images/logo.png";

export default function DashboardSidebar({
  active = "dashboard",
}) {

  const navigate = useNavigate();

  // =========================
  // SIDEBAR ITEMS
  // =========================
  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    {
      key: "transactions",
      label: "Transactions",
      path: "/transactions",
      icon: <Wallet size={18} />,
    },

    {
      key: "budgets",
      label: "Budgets",
      path: "/budget",
      icon: <Target size={18} />,
    },

    // =========================
    // NEW GOALS PAGE
    // =========================
    {
      key: "goals",
      label: "Goals",
      path: "/goals",
      icon: <Trophy size={18} />,
    },

    {
      key: "categories",
      label: "Categories",
      path: "/categories",
      icon: <Tags size={18} />,
    },

    {
      key: "reports",
      label: "Reports",
      icon: <BarChart3 size={18} />,
      path: "/reports",
    },

    {
      key: "settings",
      label: "Settings",
      path: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {

    // clear auth here later if needed
    // localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <aside
      className="
        hidden lg:flex flex-col justify-between
        fixed top-0 left-0
        h-screen
        w-72
        p-6
        z-50
        bg-white/60
        backdrop-blur-2xl
        border-r border-white/40
        shadow-[0_10px_50px_rgba(0,0,0,0.08)]
      "
    >

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <img
            src={logo}
            alt="Finora"
            className="w-10 h-10"
          />

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Finora
            </h1>

            <p className="text-xs text-gray-500">
              Smart Finance & Budget Platform
            </p>

          </div>

        </div>

        {/* MENU */}
        <div className="mt-10 space-y-2">

          {items.map((item) => (

            <Link
              key={item.key}
              to={item.path}
            >

              <SidebarItem
                active={active === item.key}
                icon={item.icon}
                label={item.label}
              />

            </Link>

          ))}

        </div>

      </div>

      {/* BOTTOM */}
      <div className="space-y-4">

        {/* INSIGHT CARD */}
        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl p-5 bg-gradient-to-br from-indigo-500 to-sky-500 text-white"
        >

          <BrainCircuit className="mb-2" />

          <h3 className="font-semibold">
            Smart Insight
          </h3>

          <p className="text-sm text-white/80 mt-2">
            Your savings consistency improved this month.
          </p>

        </motion.div>

        {/* LOGOUT */}
        <motion.button
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3
            px-4 py-3 rounded-2xl
            bg-red-500 text-white
            shadow-lg
            hover:bg-red-600
            transition
          "
        >

          <LogOut size={18} />

          <span className="font-medium">
            Logout
          </span>

        </motion.button>

      </div>

    </aside>
  );
}

// =========================
// SIDEBAR ITEM
// =========================
function SidebarItem({
  icon,
  label,
  active,
}) {

  return (
    <motion.div
      whileHover={{
        x: 4,
      }}
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-2xl
        cursor-pointer transition
        ${
          active
            ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg"
            : "hover:bg-white/60 text-gray-700"
        }
      `}
    >

      {icon}

      <span className="font-medium">
        {label}
      </span>

    </motion.div>
  );
}