import { motion } from "framer-motion";

import {
  Bell,
  RefreshCw,
} from "lucide-react";

import { useToast } from "../components/ToastProvider";

export default function DashboardTopbar({
  title,
  subtitle,
}) {

  const { addToast } = useToast();

  return (
    <div
      className="
        sticky top-0
        z-40
        flex justify-between items-center
        mb-8
        px-6 py-4
        rounded-[28px]
        border border-white/40
        bg-white/60
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.05)]
      "
    >

      {/* LEFT */}
      <div>

        <motion.h1
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-4xl font-bold text-gray-900"
        >

          {title}

        </motion.h1>

        <p className="text-gray-500 mt-1">
          {subtitle}
        </p>

      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3">

        {/* REFRESH */}
        <button
          onClick={() =>
            addToast({
              type: "success",
              message: "Refreshed successfully",
            })
          }
          className="
            w-11 h-11
            rounded-2xl
            bg-white/70
            backdrop-blur-xl
            border border-white/40
            flex items-center justify-center
            hover:scale-105
            transition
          "
        >

          <RefreshCw size={18} />

        </button>

        {/* NOTIFICATIONS */}
        <button
          onClick={() =>
            addToast({
              type: "info",
              message: "No notifications",
            })
          }
          className="
            w-11 h-11
            rounded-2xl
            bg-white/70
            backdrop-blur-xl
            border border-white/40
            flex items-center justify-center
            relative
            hover:scale-105
            transition
          "
        >

          <Bell size={18} />

          <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2" />

        </button>

      </div>

    </div>
  );
}