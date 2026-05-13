import { useState } from "react";

import { motion } from "framer-motion";

import {
  User,
  Mail,
  Bell,
  Lock,
  DollarSign,
  ChevronRight,
  Trash2,
  Shield,
  Smartphone,
  Moon,
  Settings2,
  BadgeCheck,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";

import { useToast } from "../components/ToastProvider";

// =========================
// MAIN PAGE
// =========================
export default function SettingsPage() {

  const { addToast } = useToast();

  // =========================
  // CURSOR GLOW
  // =========================
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

  // =========================
  // SETTINGS STATE
  // =========================
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailAlerts: true,
    currency: "LKR",
  });

  // =========================
  // TOGGLE
  // =========================
  const toggle = (key, label) => {

    const newValue = !settings[key];

    setSettings((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    addToast({
      type: "success",
      message: `${label} ${
        newValue ? "enabled" : "disabled"
      }`,
    });
  };

  // =========================
  // CHANGE CURRENCY
  // =========================
  const changeCurrency = (currency) => {

    setSettings((prev) => ({
      ...prev,
      currency,
    }));

    addToast({
      type: "success",
      message: `Currency changed to ${currency}`,
    });
  };

  // =========================
  // DELETE ACCOUNT
  // =========================
  const deleteAccount = () => {

    addToast({
      type: "loading",
      message: "Deleting account...",
      sound: false,
    });

    setTimeout(() => {

      addToast({
        type: "error",
        message: "Account deletion cancelled",

        action: {
          label: "Undo",

          onClick: () => {

            addToast({
              type: "success",
              message: "Account restored",
            });
          },
        },
      });

    }, 1500);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#f6f8ff] relative overflow-hidden flex"
    >

      {/* CURSOR GLOW */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              600px at ${mouse.x}px ${mouse.y}px,
              rgba(99,102,241,0.10),
              transparent 80%
            )
          `,
        }}
      />

      {/* BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-sky-200/30 rounded-full blur-3xl" />

      {/* SIDEBAR */}
      <DashboardSidebar active="settings" />

      {/* MAIN */}
      <main className="flex-1 ml-0 lg:ml-[320px] z-10">

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

          {/* TOPBAR */}
          <DashboardTopbar
            title="Settings"
            subtitle="Manage your account preferences and security"
          />

          {/* PROFILE CARD */}
          <motion.div
            whileHover={{
              y: -3,
            }}
            className="
              mt-8
              max-w-5xl
              rounded-[32px]
              border border-white/40
              bg-white/60
              backdrop-blur-2xl
              shadow-[0_10px_50px_rgba(0,0,0,0.06)]
              p-6
            "
          >

            <div className="flex flex-col md:flex-row md:items-center gap-5">

              {/* AVATAR */}
              <div
                className="
                  w-16 h-16
                  rounded-3xl
                  bg-gradient-to-br
                  from-indigo-500
                  to-sky-500
                  text-white
                  flex items-center justify-center
                  shadow-lg
                "
              >

                <User size={28} />

              </div>

              {/* USER INFO */}
              <div className="flex-1">

                <div className="flex items-center gap-2">

                  <h2 className="text-2xl font-bold text-gray-900">
                    User Name
                  </h2>

                  <BadgeCheck
                    size={18}
                    className="text-indigo-500"
                  />

                </div>

                <p className="text-gray-500 mt-1">
                  user@email.com
                </p>

              </div>

              {/* BUTTON */}
              <button
                onClick={() =>
                  addToast({
                    type: "info",
                    message:
                      "Profile customization coming soon",
                  })
                }
                className="
                  flex items-center gap-2
                  px-5 py-3
                  rounded-2xl
                  bg-white/70
                  border border-white/40
                  hover:bg-white
                  transition
                "
              >

                <Settings2 size={18} />

                Edit Profile

              </button>

            </div>

          </motion.div>

          {/* SETTINGS GRID */}
          <div className="mt-8 max-w-5xl grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* ACCOUNT */}
            <Section title="Account">

              <Row
                icon={<Mail size={18} />}
                label="Email"
                value="user@email.com"
              />

              <Row
                icon={<Lock size={18} />}
                label="Change Password"
                action
                onClick={() =>
                  addToast({
                    type: "info",
                    message:
                      "Password update feature coming soon",
                  })
                }
              />

            </Section>

            {/* PREFERENCES */}
            <Section title="Preferences">

              <ToggleRow
                icon={<Moon size={18} />}
                label="Dark Mode"
                value={settings.darkMode}
                onChange={() =>
                  toggle("darkMode", "Dark mode")
                }
              />

              <ToggleRow
                icon={<Bell size={18} />}
                label="Notifications"
                value={settings.notifications}
                onChange={() =>
                  toggle("notifications", "Notifications")
                }
              />

              <ToggleRow
                icon={<Mail size={18} />}
                label="Email Alerts"
                value={settings.emailAlerts}
                onChange={() =>
                  toggle("emailAlerts", "Email alerts")
                }
              />

              {/* CURRENCY */}
              <div className="flex items-center justify-between p-5">

                <div className="flex items-center gap-3 text-gray-700">

                  <div className="text-indigo-500">
                    <DollarSign size={18} />
                  </div>

                  <span className="font-medium">
                    Currency
                  </span>

                </div>

                <select
                  value={settings.currency}
                  onChange={(e) =>
                    changeCurrency(e.target.value)
                  }
                  className="
                    bg-white/70
                    border border-white/40
                    px-4 py-2
                    rounded-xl
                    outline-none
                  "
                >

                  <option value="LKR">
                    LKR
                  </option>

                  <option value="USD">
                    USD
                  </option>

                  <option value="EUR">
                    EUR
                  </option>

                  <option value="GBP">
                    GBP
                  </option>

                </select>

              </div>

            </Section>

            {/* SECURITY */}
            <Section title="Security">

              <Row
                icon={<Shield size={18} />}
                label="Two-Factor Authentication"
                action
                onClick={() =>
                  addToast({
                    type: "success",
                    message: "2FA setup started",
                  })
                }
              />

              <Row
                icon={<Smartphone size={18} />}
                label="Login Devices"
                action
                onClick={() =>
                  addToast({
                    type: "info",
                    message:
                      "Showing connected devices",
                  })
                }
              />

            </Section>

            {/* DANGER ZONE */}
            <motion.div
              whileHover={{
                y: -3,
              }}
              className="
                rounded-[32px]
                border border-rose-200/60
                bg-white/60
                backdrop-blur-2xl
                shadow-[0_10px_50px_rgba(0,0,0,0.06)]
                p-6
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    bg-rose-100
                    text-rose-500
                    flex items-center justify-center
                  "
                >

                  <Trash2 size={20} />

                </div>

                <div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    Danger Zone
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Permanently remove your account
                    and data
                  </p>

                </div>

              </div>

              <button
                onClick={deleteAccount}
                className="
                  mt-6
                  flex items-center gap-2
                  bg-rose-500
                  hover:bg-rose-600
                  text-white
                  px-5 py-3
                  rounded-2xl
                  transition
                "
              >

                <Trash2 size={16} />

                Delete Account

              </button>

            </motion.div>

          </div>

        </div>

      </main>

    </div>
  );
}

// =========================
// SECTION
// =========================
function Section({
  title,
  children,
}) {

  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        rounded-[32px]
        border border-white/40
        bg-white/60
        backdrop-blur-2xl
        shadow-[0_10px_50px_rgba(0,0,0,0.06)]
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div className="px-6 pt-6 pb-4">

        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>

      </div>

      {/* CONTENT */}
      <div className="divide-y divide-white/40">
        {children}
      </div>

    </motion.div>
  );
}

// =========================
// ROW
// =========================
function Row({
  icon,
  label,
  value,
  action,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className="
        w-full
        flex items-center justify-between
        px-6 py-5
        hover:bg-white/40
        transition
      "
    >

      <div className="flex items-center gap-4">

        <div className="text-indigo-500">
          {icon}
        </div>

        <span className="font-medium text-gray-700">
          {label}
        </span>

      </div>

      <div className="flex items-center gap-2 text-gray-500">

        {value && (
          <span className="text-sm">
            {value}
          </span>
        )}

        {action && (
          <ChevronRight size={16} />
        )}

      </div>

    </button>
  );
}

// =========================
// TOGGLE ROW
// =========================
function ToggleRow({
  icon,
  label,
  value,
  onChange,
}) {

  return (
    <div
      className="
        flex items-center justify-between
        px-6 py-5
      "
    >

      <div className="flex items-center gap-4">

        <div className="text-indigo-500">
          {icon}
        </div>

        <span className="font-medium text-gray-700">
          {label}
        </span>

      </div>

      <button
        onClick={onChange}
        className={`
          w-12 h-6
          flex items-center
          rounded-full
          p-1
          transition
          ${
            value
              ? "bg-indigo-500"
              : "bg-gray-300"
          }
        `}
      >

        <div
          className={`
            w-4 h-4
            bg-white
            rounded-full
            transition
            ${
              value
                ? "translate-x-6"
                : ""
            }
          `}
        />

      </button>

    </div>
  );
}