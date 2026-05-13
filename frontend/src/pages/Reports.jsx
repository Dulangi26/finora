import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
} from "recharts";

import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  Download,
  BarChart3,
  Target,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";

import { useToast } from "../components/ToastProvider";

// =========================
// FORMAT LKR
// =========================
const formatLKR = (value) =>
  `Rs. ${value.toLocaleString("en-LK")}`;

// =========================
// MAIN PAGE
// =========================
export default function ReportsPage() {

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
  // FILTERS
  // =========================
  const [month, setMonth] = useState("October");

  const [year, setYear] = useState("2026");

  // =========================
  // MOCK DATA
  // =========================
  const summary = {
    income: 185000,
    expenses: 112500,
    savings: 72500,
    growth: 12,
  };

  const monthlyData = [
    { month: "Jun", income: 120000, expenses: 85000 },
    { month: "Jul", income: 150000, expenses: 92000 },
    { month: "Aug", income: 160000, expenses: 100000 },
    { month: "Sep", income: 170000, expenses: 108000 },
    { month: "Oct", income: 185000, expenses: 112500 },
  ];

  const expenseData = [
    { name: "Food", value: 25000 },
    { name: "Rent", value: 40000 },
    { name: "Transport", value: 18000 },
    { name: "Bills", value: 12000 },
    { name: "Entertainment", value: 8000 },
  ];

  const COLORS = [
    "#6366f1",
    "#06b6d4",
    "#8b5cf6",
    "#22c55e",
    "#f97316",
  ];

  // =========================
  // INSIGHTS
  // =========================
  const insights = useMemo(() => {

    return [
      {
        icon: "📈",
        title: "Income Growth",
        text: "Your income increased by 12% compared to last month.",
      },

      {
        icon: "💰",
        title: "Highest Expense",
        text: "Rent remains your highest spending category this month.",
      },

      {
        icon: "🎯",
        title: "Budget Performance",
        text: "3 out of 4 budgets remained within their limits.",
      },
    ];

  }, []);

  // =========================
  // EXPORT REPORT
  // =========================
  const exportReport = () => {

    addToast({
      type: "success",
      message: "Report exported successfully",
    });
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
              rgba(99,102,241,0.12),
              transparent 80%
            )
          `,
        }}
      />

      {/* BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-indigo-300/20 rounded-full blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-sky-300/20 rounded-full blur-3xl" />

      {/* SIDEBAR */}
      <DashboardSidebar active="reports" />

      {/* MAIN */}
      <main className="flex-1 ml-72 p-6 z-10">

        <div className="max-w-7xl mx-auto">

          {/* TOPBAR */}
          <DashboardTopbar
            title="Reports"
            subtitle="Track your financial performance and spending insights"
          />

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

            <SummaryCard
              title="Total Income"
              value={formatLKR(summary.income)}
              icon={<ArrowUpRight size={20} />}
              color="green"
            />

            <SummaryCard
              title="Total Expenses"
              value={formatLKR(summary.expenses)}
              icon={<ArrowDownRight size={20} />}
              color="red"
            />

            <SummaryCard
              title="Savings"
              value={formatLKR(summary.savings)}
              icon={<Wallet size={20} />}
              color="indigo"
            />

            <SummaryCard
              title="Growth"
              value={`${summary.growth}%`}
              icon={<TrendingUp size={20} />}
              color="blue"
            />

          </div>

          {/* FILTER BAR */}
          <div className="mt-8 rounded-[30px] border border-white/40 bg-white/60 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] p-5">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              {/* LEFT */}
              <div className="flex flex-col md:flex-row gap-3">

                <div className="flex items-center gap-3 bg-white/70 border border-white/40 rounded-2xl px-4 py-3">

                  <Calendar
                    size={18}
                    className="text-gray-500"
                  />

                  <select
                    value={month}
                    onChange={(e) =>
                      setMonth(e.target.value)
                    }
                    className="bg-transparent outline-none"
                  >

                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>

                  </select>

                </div>

                <div className="bg-white/70 border border-white/40 rounded-2xl px-4 py-3">

                  <select
                    value={year}
                    onChange={(e) =>
                      setYear(e.target.value)
                    }
                    className="bg-transparent outline-none"
                  >

                    <option>2024</option>
                    <option>2025</option>
                    <option>2026</option>

                  </select>

                </div>

              </div>

              {/* EXPORT */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={exportReport}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white px-5 py-3 rounded-2xl shadow-lg"
              >

                <Download size={18} />

                Export Report

              </motion.button>

            </div>

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

            {/* AREA CHART */}
            <div className="xl:col-span-2 rounded-[32px] border border-white/40 bg-white/60 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] p-6">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    Income vs Expenses
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Monthly financial performance
                  </p>

                </div>

                <div className="flex items-center gap-4 text-sm">

                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-indigo-500" />

                    <span className="text-gray-500">
                      Income
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-sky-400" />

                    <span className="text-gray-500">
                      Expenses
                    </span>

                  </div>

                </div>

              </div>

              <ResponsiveContainer width="100%" height={320}>

                <AreaChart data={monthlyData}>

                  <defs>

                    <linearGradient
                      id="incomeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0}
                      />

                    </linearGradient>

                    <linearGradient
                      id="expenseGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#06b6d4"
                        stopOpacity={0.2}
                      />

                      <stop
                        offset="95%"
                        stopColor="#06b6d4"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#6366f1"
                    fill="url(#incomeGradient)"
                    strokeWidth={3}
                  />

                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#06b6d4"
                    fill="url(#expenseGradient)"
                    strokeWidth={3}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

            {/* PIE CHART */}
            <div className="rounded-[32px] border border-white/40 bg-white/60 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] p-6">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">

                  <BarChart3 size={22} />

                </div>

                <div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    Expense Breakdown
                  </h3>

                  <p className="text-sm text-gray-500">
                    Category distribution
                  </p>

                </div>

              </div>

              <ResponsiveContainer width="100%" height={280}>

                <PieChart>

                  <Pie
                    data={expenseData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                  >

                    {expenseData.map((_, i) => (

                      <Cell
                        key={i}
                        fill={COLORS[i]}
                      />

                    ))}

                  </Pie>

                </PieChart>

              </ResponsiveContainer>

              {/* LEGEND */}
              <div className="space-y-3 mt-4">

                {expenseData.map((item, i) => (

                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >

                    <div className="flex items-center gap-2">

                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: COLORS[i],
                        }}
                      />

                      <span className="text-sm text-gray-700">
                        {item.name}
                      </span>

                    </div>

                    <span className="text-sm font-medium text-gray-900">
                      {formatLKR(item.value)}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* INSIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

            {insights.map((item, index) => (

              <InsightCard
                key={index}
                icon={item.icon}
                title={item.title}
                text={item.text}
              />

            ))}

            {/* GOAL CARD */}
            <motion.div
              whileHover={{
                y: -4,
              }}
              className="rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-500 to-sky-500 text-white p-6 shadow-[0_10px_50px_rgba(99,102,241,0.25)]"
            >

              <div className="flex items-center gap-3">

                <Target />

                <h3 className="font-semibold text-lg">
                  Savings Goal
                </h3>

              </div>

              <div className="mt-6">

                <div className="flex justify-between text-sm mb-2">

                  <span>Progress</span>

                  <span>35%</span>

                </div>

                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }}
                    transition={{ duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />

                </div>

                <p className="text-sm text-white/80 mt-3">
                  Rs. 175,000 / Rs. 500,000
                </p>

              </div>

            </motion.div>

          </div>

        </div>

      </main>

    </div>
  );
}

// =========================
// SUMMARY CARD
// =========================
function SummaryCard({
  title,
  value,
  icon,
  color,
}) {

  const styles = {
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
    },

    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-500",
    },

    indigo: {
      bg: "bg-indigo-50",
      icon: "bg-indigo-100 text-indigo-600",
    },

    blue: {
      bg: "bg-sky-50",
      icon: "bg-sky-100 text-sky-600",
    },
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className={`
        rounded-[30px]
        border border-white/40
        ${styles[color].bg}
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.05)]
        p-6
      `}
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-3">
            {value}
          </h3>

        </div>

        <div
          className={`
            w-12 h-12 rounded-2xl flex items-center justify-center
            ${styles[color].icon}
          `}
        >

          {icon}

        </div>

      </div>

    </motion.div>
  );
}

// =========================
// INSIGHT CARD
// =========================
function InsightCard({
  icon,
  title,
  text,
}) {

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="rounded-[32px] border border-white/40 bg-white/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] p-6"
    >

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mt-4 text-gray-900">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        {text}
      </p>

    </motion.div>
  );
}