import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  TrendingUp,
  Plus,
  ScanLine,
} from "lucide-react";

import heroImage from "../assets/images/hero1.png";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";

import { useToast } from "../components/ToastProvider";

// =========================
// FORMATTER
// =========================
const formatLKR = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

// =========================
// PAGE
// =========================
export default function Dashboard() {
  const navigate = useNavigate();

  const { addToast } = useToast();

  // =========================
  // STATES
  // =========================
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // ANALYTICS FILTERS
  // =========================
  const currentYear =
    new Date().getFullYear();

  const currentMonth =
    new Date().getMonth() + 1;

  const [analyticsYear, setAnalyticsYear] =
    useState(currentYear);

  const [expenseYear, setExpenseYear] =
    useState(currentYear);

  const [expenseMonth, setExpenseMonth] =
    useState(currentMonth);

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
  // LIVE CLOCK
  // =========================
  const [now, setNow] = useState(
    new Date()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =========================
  // FETCH DASHBOARD
  // =========================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res =
          await API.get("/dashboard");

        setDashboard(res.data);
      } catch (error) {
        console.log(error);

        addToast({
          type: "error",
          message:
            "Failed to load dashboard",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =========================
  // SUMMARY
  // =========================
  const summary = {
    income:
      Number(
        dashboard?.summary?.income || 0
      ),

    expense:
      Number(
        dashboard?.summary?.expense || 0
      ),

    balance:
      Number(
        dashboard?.summary?.balance || 0
      ),

    savings:
      Number(
        dashboard?.summary?.savings || 0
      ),
  };

  // =========================
  // TRANSACTIONS
  // =========================
const transactions =
  Array.isArray(
    dashboard?.allTransactions
  )
    ? dashboard.allTransactions
    : Array.isArray(
        dashboard?.transactions
      )
    ? dashboard.transactions
    : [];

  // =========================
  // GOALS
  // =========================
  const goals =
    Array.isArray(
      dashboard?.goals
    )
      ? dashboard.goals
      : [];

  // =========================
  // MONTHLY ANALYTICS
  // =========================
  const monthly = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result = months.map(
      (month) => ({
        m: month,
        income: 0,
        expense: 0,
      })
    );

    transactions.forEach((t) => {
      const date = new Date(t.date);

      const year =
        date.getFullYear();

      if (
        year !==
        Number(analyticsYear)
      )
        return;

      const monthIndex =
        date.getMonth();

      if (t.type === "income") {
        result[monthIndex].income +=
          Number(t.amount);
      }

      if (t.type === "expense") {
        result[monthIndex].expense +=
          Number(t.amount);
      }
    });

    return result;
  }, [
    transactions,
    analyticsYear,
  ]);

  // =========================
  // EXPENSE BREAKDOWN
  // =========================
  const expenseData = useMemo(() => {
    const grouped = {};

    transactions.forEach((t) => {
      if (t.type !== "expense")
        return;

      const date = new Date(t.date);

      const year =
        date.getFullYear();

      const month =
        date.getMonth() + 1;

      if (
        year !==
        Number(expenseYear)
      )
        return;

      if (
        month !==
        Number(expenseMonth)
      )
        return;

      const category =
        t.category_name ||
        "Other";

      if (!grouped[category]) {
        grouped[category] = 0;
      }

      grouped[category] +=
        Number(t.amount);
    });

    return Object.keys(grouped).map(
      (key) => ({
        name: key,
        value: grouped[key],
      })
    );
  }, [
    transactions,
    expenseYear,
    expenseMonth,
  ]);

  // =========================
  // YEARS
  // =========================
  const availableYears =
    useMemo(() => {
      const years =
        transactions.map((t) =>
          new Date(
            t.date
          ).getFullYear()
        );

      return [
        ...new Set(years),
      ].sort((a, b) => b - a);
    }, [transactions]);

  // =========================
  // COLORS
  // =========================
  const COLORS = [
    "#6366f1",
    "#06b6d4",
    "#8b5cf6",
    "#22c55e",
    "#f97316",
    "#ec4899",
    "#14b8a6",
  ];

  // =========================
  // GREETING
  // =========================
  const greeting = useMemo(() => {
    const h = now.getHours();

    if (h < 12)
      return "Good Morning";

    if (h < 18)
      return "Good Afternoon";

    return "Good Evening";
  }, [now]);

  // =========================
  // QUICK ACTION
  // =========================
  const handleQuickAction = (
    title,
    route
  ) => {
    addToast({
      type: "success",
      message: `${title} opened`,
    });

    navigate(route);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8ff]">
        <div className="text-xl font-semibold text-indigo-600">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="
        min-h-screen
        bg-[#f6f8ff]
        relative
        overflow-hidden
        flex
      "
    >
      {/* CURSOR */}
      <div
        className="
          pointer-events-none
          fixed inset-0 z-0
        "
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

      {/* SIDEBAR */}
      <DashboardSidebar active="dashboard" />

      {/* MAIN */}
      <main className="flex-1 lg:ml-[320px] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          {/* TOPBAR */}
          <DashboardTopbar
            title={`${greeting} 👋`}
            subtitle={`${now.toLocaleDateString(
              "en-GB"
            )} • Financial overview`}
          />

          {/* HERO */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-8
              relative
              overflow-hidden
              rounded-[36px]
              bg-gradient-to-br
              from-indigo-500
              via-violet-500
              to-sky-500
              p-8
              text-white
            "
          >
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* LEFT */}
              <div>
                <h2 className="text-5xl font-bold">
                  {formatLKR(
                    summary.balance
                  )}
                </h2>

                <p className="mt-2 text-white/80">
                  Current Balance
                </p>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <GlassStat
                    title="Income"
                    value={formatLKR(
                      summary.income
                    )}
                    icon={
                      <ArrowUpRight />
                    }
                  />

                  <GlassStat
                    title="Expenses"
                    value={formatLKR(
                      summary.expense
                    )}
                    icon={
                      <ArrowDownRight />
                    }
                  />

                  <GlassStat
                    title="Savings"
                    value={formatLKR(
                      summary.savings
                    )}
                    icon={<Wallet />}
                  />

                  <GlassStat
                    title="Growth"
                    value={
                      summary.income > 0
                        ? `${(
                            (summary.savings /
                              summary.income) *
                            100
                          ).toFixed(1)}%`
                        : "0%"
                    }
                    icon={
                      <TrendingUp />
                    }
                  />
                </div>
              </div>

              {/* IMAGE */}
              <div className="hidden lg:flex justify-center">
                <img
                  src={heroImage}
                  alt="Hero"
                  className="w-[600px]"
                />
              </div>
            </div>
          </motion.div>

          {/* QUICK ACTIONS */}
          <div className="flex gap-5 mt-8 flex-wrap">
            <QuickAction
              title="Add Categories"
              icon={<Plus />}
              onClick={() =>
                handleQuickAction(
                  "Categories",
                  "/categories"
                )
              }
            />

            <QuickAction
              title="Budget"
              icon={<Target />}
              onClick={() =>
                handleQuickAction(
                  "Budget",
                  "/budget"
                )
              }
            />

            <QuickAction
              title="Reports"
              icon={<ScanLine />}
              onClick={() =>
                handleQuickAction(
                  "Reports",
                  "/reports"
                )
              }
            />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
{/* AREA CHART */}
<div className="xl:col-span-2 bg-white/60 backdrop-blur-2xl p-6 rounded-[32px] shadow-sm">

  <div className="flex items-center justify-between mb-5">

    <div>
      <h3 className="text-xl font-semibold">
        Income Analytics
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Monthly income vs expenses
      </p>
    </div>

  </div>

  {monthly.length === 0 ? (

    <div className="h-[260px] flex items-center justify-center text-gray-500">
      Add transactions to view analytics
    </div>

  ) : (

    <div className="h-[320px] -ml-4">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={monthly}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >

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
                stopOpacity={0.35}
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
                stopColor="#f43f5e"
                stopOpacity={0.2}
              />

              <stop
                offset="95%"
                stopColor="#f43f5e"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.15}
          />

          <XAxis
            dataKey="m"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <YAxis
            tickFormatter={(v) =>
              `${v / 1000}k`
            }
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <Tooltip
            formatter={(value) =>
              formatLKR(value)
            }
            contentStyle={{
              borderRadius: "18px",
              border: "none",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.08)",
            }}
          />

          <Legend />

          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#6366f1"
            fill="url(#incomeGradient)"
            strokeWidth={3}
          />

          <Area
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#f43f5e"
            fill="url(#expenseGradient)"
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  )}

</div>

            {/* PIE CHART */}
            <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-[32px] shadow-sm">
              <div className="flex flex-col gap-3 mb-4">
                <h3 className="text-xl font-semibold">
                  Expenses Breakdown
                </h3>

                <div className="flex gap-3">
                  <select
                    value={expenseMonth}
                    onChange={(e) =>
                      setExpenseMonth(
                        e.target.value
                      )
                    }
                    className="
                      flex-1
                      px-4 py-2
                      rounded-2xl
                      border
                      bg-white/70
                    "
                  >
                    <option value="1">
                      January
                    </option>

                    <option value="2">
                      February
                    </option>

                    <option value="3">
                      March
                    </option>

                    <option value="4">
                      April
                    </option>

                    <option value="5">
                      May
                    </option>

                    <option value="6">
                      June
                    </option>

                    <option value="7">
                      July
                    </option>

                    <option value="8">
                      August
                    </option>

                    <option value="9">
                      September
                    </option>

                    <option value="10">
                      October
                    </option>

                    <option value="11">
                      November
                    </option>

                    <option value="12">
                      December
                    </option>
                  </select>

                  <select
                    value={expenseYear}
                    onChange={(e) =>
                      setExpenseYear(
                        e.target.value
                      )
                    }
                    className="
                      flex-1
                      px-4 py-2
                      rounded-2xl
                      border
                      bg-white/70
                    "
                  >
                    {availableYears.map(
                      (year) => (
                        <option
                          key={year}
                          value={year}
                        >
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {expenseData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-gray-500">
                  No expense data yet
                </div>
              ) : (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height={260}
                  >
                    <PieChart>
                      <Pie
                        data={expenseData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                      >
                        {expenseData.map(
                          (_, i) => (
                            <Cell
                              key={i}
                              fill={
                                COLORS[
                                  i %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        formatter={(value) =>
                          formatLKR(value)
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* LEGENDS */}
                  <div className="mt-4 space-y-3">
                    {expenseData.map(
                      (item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  COLORS[
                                    i %
                                      COLORS.length
                                  ],
                              }}
                            />

                            <span className="text-sm text-gray-700">
                              {item.name}
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-gray-900">
                            {formatLKR(
                              item.value
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

 {/* RECENT TRANSACTIONS */}
<div className="
  mt-8
  rounded-[32px]
  bg-white/60
  backdrop-blur-2xl
  p-6
  shadow-sm
">

  <div className="flex items-center justify-between mb-5">

    <h3 className="
      text-2xl
      font-bold
      text-gray-900
    ">
      Recent Transactions
    </h3>

    <button
      onClick={() =>
        navigate("/transactions")
      }
      className="
        text-sm
        font-medium
        text-indigo-600
        hover:text-indigo-700
      "
    >
      View All
    </button>

  </div>

  <div className="space-y-4">

    {transactions.length === 0 && (
      <p className="text-gray-500">
        No transactions yet
      </p>
    )}

    {transactions
      .slice(0, 4)
      .map((t) => (

        <div
          key={t.id}
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            pb-4
            last:border-none
            last:pb-0
          "
        >

          <div>

            <h4 className="
              font-semibold
              text-gray-900
            ">
              {t.title}
            </h4>

            <div className="
              flex items-center gap-3
              mt-1
              text-sm
              text-gray-500
            ">

              <span>
                {t.category_name ||
                  "Uncategorized"}
              </span>

              <span>
                •
              </span>

              <span>
                {new Date(
                  t.date
                ).toLocaleDateString(
                  "en-GB"
                )}
              </span>

            </div>

          </div>

          <div
            className={`
              font-bold
              text-lg
              ${
                t.type === "income"
                  ? "text-green-500"
                  : "text-rose-500"
              }
            `}
          >

            {t.type === "income"
              ? "+"
              : "-"}

            {formatLKR(
              t.amount
            )}

          </div>

        </div>
      ))}

  </div>

</div>

          {/* GOALS */}
          <div className="
            mt-8
            rounded-[32px]
            bg-white/60
            backdrop-blur-2xl
            p-6
            shadow-sm
          ">
            <h3 className="
              text-2xl
              font-bold
              text-gray-900
              mb-6
            ">
              Goals Progress
            </h3>

            <div className="space-y-5">
              {goals.length === 0 && (
                <p className="text-gray-500">
                  No goals created
                </p>
              )}

              {goals.map((goal) => (
                <div key={goal.id}>
                  <div className="
                    flex
                    justify-between
                    mb-2
                  ">
                    <div>
                      <p className="
                        font-semibold
                        text-gray-900
                      ">
                        {goal.title}
                      </p>

                      <p className="
                        text-sm
                        text-gray-500
                      ">
                        {formatLKR(
                          goal.current_amount
                        )}{" "}
                        of{" "}
                        {formatLKR(
                          goal.target_amount
                        )}
                      </p>
                    </div>

                    <div className="
                      text-sm
                      font-semibold
                      text-indigo-600
                    ">
                      {Number(
                        goal.progress || 0
                      ).toFixed(0)}
                      %
                    </div>
                  </div>

                  <div className="
                    h-3
                    rounded-full
                    bg-gray-200
                    overflow-hidden
                  ">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${goal.progress}%`,
                      }}
                      className="
                        h-full
                        bg-gradient-to-r
                        from-indigo-500
                        to-sky-500
                      "
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// =========================
// GLASS STAT
// =========================
function GlassStat({
  icon,
  title,
  value,
}) {
  return (
    <div className="
      bg-white/20
      p-4
      rounded-2xl
      backdrop-blur-xl
    ">
      <div className="
        flex
        justify-between
      ">
        <span className="text-sm">
          {title}
        </span>

        {icon}
      </div>

      <h3 className="
        font-bold
        mt-3
        text-xl
      ">
        {value}
      </h3>
    </div>
  );
}

// =========================
// QUICK ACTION
// =========================
function QuickAction({
  icon,
  title,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        px-5 py-4
        bg-white/70
        backdrop-blur-xl
        rounded-2xl
        flex items-center gap-3
        shadow-sm
        hover:scale-[1.02]
        transition
      "
    >
      {icon}

      <span className="font-medium">
        {title}
      </span>
    </button>
  );
}