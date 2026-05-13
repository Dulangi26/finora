import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Target,
  ArrowUpRight,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";

import { useToast } from "../components/ToastProvider";

import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../api/budgetApi";

import { getCategories } from "../api/categoryApi";

// =========================
// FORMAT
// =========================
const formatLKR = (v) =>
  `Rs. ${Number(v || 0).toLocaleString("en-LK")}`;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// =========================
// MAIN
// =========================
export default function BudgetPage() {

  const { addToast } = useToast();

  // =========================
  // CURSOR
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
  // DATA
  // =========================
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FILTERS
  // =========================
  const currentMonth =
    new Date().getMonth() + 1;

  const currentYear =
    new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  // =========================
  // MODAL
  // =========================
  const [open, setOpen] = useState(false);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] = useState({
    category_id: "",
    amount: "",
    period: "monthly",
    month: currentMonth,
    year: currentYear,
  });

  // =========================
  // LOAD BUDGETS
  // =========================
  const loadBudgets = async () => {

    try {

      setLoading(true);

      const res = await getBudgets();

      setBudgets(res.budgets || []);

    } catch (error) {

      console.log(error);

      addToast({
        type: "error",
        message:
          "Failed to load budgets",
      });

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOAD CATEGORIES
  // =========================
  const loadCategories = async () => {

    try {

      const res =
        await getCategories();

      setCategories(
        res.categories || []
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    loadBudgets();

    loadCategories();

  }, []);

  // =========================
  // FILTERED BUDGETS
  // =========================
  const filteredBudgets =
    useMemo(() => {

      return budgets.filter((b) => {

        if (
          Number(b.year) !==
          Number(selectedYear)
        ) {
          return false;
        }

        if (
          b.period === "monthly"
        ) {
          return (
            Number(b.month) ===
            Number(selectedMonth)
          );
        }

        return true;
      });

    }, [
      budgets,
      selectedMonth,
      selectedYear,
    ]);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {

    const totalLimit =
      filteredBudgets.reduce(
        (a, b) =>
          a +
          Number(b.amount || 0),
        0
      );

    const totalSpent =
      filteredBudgets.reduce(
        (a, b) =>
          a +
          Number(b.spent || 0),
        0
      );

    const remaining =
      totalLimit - totalSpent;

    const overBudget =
      filteredBudgets.filter(
        (b) =>
          Number(b.spent) >=
          Number(b.amount)
      ).length;

    return {
      totalLimit,
      totalSpent,
      remaining,
      overBudget,
    };

  }, [filteredBudgets]);

  // =========================
  // HELPERS
  // =========================
  const getProgress = (
    spent,
    limit
  ) =>
    Math.min(
      (spent / limit) * 100,
      100
    );

  const getBarColor = (
    spent,
    limit
  ) => {

    const percent =
      (spent / limit) * 100;

    if (percent < 70) {
      return "from-indigo-400 to-sky-400";
    }

    if (percent < 100) {
      return "from-amber-400 to-orange-400";
    }

    return "from-rose-400 to-red-400";
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {

    if (
      !form.category_id ||
      !form.amount
    ) {

      addToast({
        type: "error",
        message:
          "Please complete all fields",
      });

      return;
    }

    try {

      const payload = {
        ...form,
        amount: Number(
          form.amount
        ),
      };

      if (editing) {

        await updateBudget(
          editing.id,
          payload
        );

        addToast({
          type: "success",
          message:
            "Budget updated successfully",
        });

      } else {

        await createBudget(
          payload
        );

        addToast({
          type: "success",
          message:
            "Budget created successfully",
        });
      }

      setOpen(false);

      setEditing(null);

      setForm({
        category_id: "",
        amount: "",
        period: "monthly",
        month: currentMonth,
        year: currentYear,
      });

      loadBudgets();

    } catch (error) {

      console.log(error);

      addToast({
        type: "error",
        message: "Save failed",
      });
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (
    id
  ) => {

    try {

      await deleteBudget(id);

      addToast({
        type: "success",
        message:
          "Budget deleted",
      });

      loadBudgets();

    } catch (error) {

      console.log(error);

      addToast({
        type: "error",
        message:
          "Delete failed",
      });
    }
  };

  return (
    <div
      onMouseMove={
        handleMouseMove
      }
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
              rgba(99,102,241,0.10),
              transparent 80%
            )
          `,
        }}
      />

      <DashboardSidebar active="budgets" />

      <main className="flex-1 lg:ml-80 z-10">

        <div className="max-w-7xl mx-auto p-6 lg:p-8">

          <DashboardTopbar
            title="Budgets 💸"
            subtitle="Track your spending limits and progress"
          />

          {/* FILTERS */}
          <div className="flex gap-4 mt-8 flex-wrap">

            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                px-4 py-3
                rounded-2xl
                bg-white/70
                border border-white/40
              "
            >

              {MONTHS.map(
                (month, index) => (

                  <option
                    key={month}
                    value={index + 1}
                  >
                    {month}
                  </option>

                )
              )}

            </select>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                px-4 py-3
                rounded-2xl
                bg-white/70
                border border-white/40
              "
            >

              {[2024, 2025, 2026, 2027].map(
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

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

            <SummaryCard
              title="Total Budget"
              value={formatLKR(
                stats.totalLimit
              )}
              icon={
                <Target size={20} />
              }
            />

            <SummaryCard
              title="Total Spent"
              value={formatLKR(
                stats.totalSpent
              )}
              icon={
                <Wallet size={20} />
              }
            />

            <SummaryCard
              title="Remaining"
              value={formatLKR(
                stats.remaining
              )}
              icon={
                <TrendingUp size={20} />
              }
            />

            <SummaryCard
              title="Over Budget"
              value={
                stats.overBudget
              }
              icon={
                <AlertTriangle size={20} />
              }
            />

          </div>

          {/* HEADER */}
          <div className="mt-10 flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Budget Categories
              </h2>

              <p className="text-gray-500 mt-1">
                Monitor your category spending
              </p>

            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => {

                setEditing(null);

                setForm({
                  category_id: "",
                  amount: "",
                  period:
                    "monthly",
                  month:
                    selectedMonth,
                  year:
                    selectedYear,
                });

                setOpen(true);
              }}
              className="
                flex items-center gap-2
                bg-gradient-to-r
                from-indigo-500
                to-sky-500
                text-white
                px-5 py-3
                rounded-2xl
                shadow-lg
              "
            >

              <Plus size={18} />

              Add Budget

            </motion.button>

          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {loading ? (

              <p>Loading...</p>

            ) : filteredBudgets.length === 0 ? (

              <p>No budgets found</p>

            ) : (

              filteredBudgets.map((b) => {

                const percent =
                  getProgress(
                    Number(b.spent),
                    Number(b.amount)
                  );

                return (

                  <motion.div
                    key={b.id}
                    whileHover={{
                      y: -4,
                    }}
                    className="
                      rounded-[32px]
                      border border-white/40
                      bg-white/60
                      backdrop-blur-2xl
                      shadow-[0_10px_50px_rgba(0,0,0,0.06)]
                      p-6
                    "
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <div className="
                          inline-flex items-center gap-2
                          px-4 py-2
                          rounded-full
                          bg-indigo-50
                          text-indigo-600
                          text-sm font-medium
                        ">

                          <ArrowUpRight size={14} />

                          {b.category_name}

                        </div>

                        <h3 className="text-3xl font-bold text-gray-900 mt-5">

                          {formatLKR(
                            b.spent
                          )}

                        </h3>

                        <p className="text-gray-500 mt-1">

                          of{" "}
                          {formatLKR(
                            b.amount
                          )}

                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() => {

                            setEditing(b);

                            setForm({
                              category_id:
                                b.category_id,

                              amount:
                                b.amount,

                              period:
                                b.period,

                              month:
                                b.month,

                              year:
                                b.year,
                            });

                            setOpen(true);
                          }}
                          className="
                            w-10 h-10
                            rounded-xl
                            bg-indigo-100
                            text-indigo-600
                            flex items-center justify-center
                          "
                        >

                          <Edit size={16} />

                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              b.id
                            )
                          }
                          className="
                            w-10 h-10
                            rounded-xl
                            bg-rose-100
                            text-rose-500
                            flex items-center justify-center
                          "
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    </div>

                    {/* PROGRESS */}
                    <div className="mt-6">

                      <div className="flex justify-between text-sm text-gray-500 mb-2">

                        <span>
                          Used{" "}
                          {percent.toFixed(
                            0
                          )}
                          %
                        </span>

                        <span>

                          Remaining{" "}
                          {formatLKR(
                            b.remaining
                          )}

                        </span>

                      </div>

                      <div className="w-full h-3 bg-gray-200/70 rounded-full overflow-hidden">

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${percent}%`,
                          }}
                          transition={{
                            duration: 1,
                          }}
                          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(
                            b.spent,
                            b.amount
                          )}`}
                        />

                      </div>

                    </div>

                  </motion.div>
                );
              })
            )}

          </div>

        </div>

      </main>

      {/* MODAL */}
      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed inset-0
              bg-black/40
              backdrop-blur-sm
              flex items-center justify-center
              z-50 p-4
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="
                w-full max-w-md
                rounded-[32px]
                border border-white/40
                bg-white/70
                backdrop-blur-2xl
                shadow-[0_10px_80px_rgba(0,0,0,0.15)]
                p-6
              "
            >

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">

                    {editing
                      ? "Edit Budget"
                      : "Create Budget"}

                  </h2>

                  <p className="text-gray-500 text-sm mt-1">

                    Manage your category budgets

                  </p>

                </div>

                <button
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-gray-100
                    flex items-center justify-center
                  "
                >

                  <X size={18} />

                </button>

              </div>

              {/* FORM */}
              <div className="space-y-4">

                <select
                  value={
                    form.category_id
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category_id:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-white/70
                    border border-white/40
                    rounded-2xl
                    px-4 py-3
                    outline-none
                  "
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (c) => (
                      <option
                        key={c.id}
                        value={c.id}
                      >
                        {c.name}
                      </option>
                    )
                  )}

                </select>

                <input
                  type="number"
                  placeholder="Budget Amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-white/70
                    border border-white/40
                    rounded-2xl
                    px-4 py-3
                    outline-none
                  "
                />

                {/* PERIOD */}
                <select
                  value={form.period}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      period:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-white/70
                    border border-white/40
                    rounded-2xl
                    px-4 py-3
                    outline-none
                  "
                >

                  <option value="monthly">
                    Monthly
                  </option>

                  <option value="yearly">
                    Yearly
                  </option>

                </select>

                {/* MONTH */}
                {form.period ===
                  "monthly" && (

                  <select
                    value={form.month}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        month:
                          Number(
                            e.target
                              .value
                          ),
                      })
                    }
                    className="
                      w-full
                      bg-white/70
                      border border-white/40
                      rounded-2xl
                      px-4 py-3
                      outline-none
                    "
                  >

                    {MONTHS.map(
                      (
                        month,
                        index
                      ) => (
                        <option
                          key={month}
                          value={
                            index + 1
                          }
                        >
                          {month}
                        </option>
                      )
                    )}

                  </select>

                )}

                {/* YEAR */}
                <input
                  type="number"
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      year:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    bg-white/70
                    border border-white/40
                    rounded-2xl
                    px-4 py-3
                    outline-none
                  "
                />

                <motion.button
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={
                    handleSave
                  }
                  className="
                    w-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-sky-500
                    text-white
                    py-3
                    rounded-2xl
                    shadow-lg
                    font-medium
                  "
                >

                  {editing
                    ? "Update Budget"
                    : "Save Budget"}

                </motion.button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

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
}) {

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
        rounded-[30px]
        border border-white/40
        bg-white/60
        backdrop-blur-2xl
        shadow-[0_10px_50px_rgba(0,0,0,0.06)]
        p-6
      "
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

        <div className="
          w-12 h-12 rounded-2xl
          bg-indigo-100 text-indigo-600
          flex items-center justify-center
        ">

          {icon}

        </div>

      </div>

    </motion.div>
  );
}