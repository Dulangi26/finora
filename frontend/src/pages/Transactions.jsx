import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import { useToast } from "../components/ToastProvider";

import API from "../api/api";

// =========================
// FORMAT
// =========================
const formatLKR = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK")}`;

// =========================
// MONTHS
// =========================
const months = [
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

export default function TransactionsPage() {
  const { addToast } = useToast();

  const [transactions, setTransactions] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [goals, setGoals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FILTERS
  // =========================
  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("latest");

  // NEW
  const currentYear =
    new Date().getFullYear();

  const currentMonth =
    new Date().getMonth();

  const [selectedYear, setSelectedYear] =
    useState(String(currentYear));

  const [selectedMonth, setSelectedMonth] =
    useState(String(currentMonth));

  // =========================
  // MODAL
  // =========================
  const [openModal, setOpenModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category_id: "",
    goal_id: "",
    type: "expense",
    date: "",
    note: "",
  });

  // =========================
  // FETCH TRANSACTIONS
  // =========================
  const fetchTransactions = async () => {
    try {
      const res =
        await API.get("/transactions");

      setTransactions(
        res.data.transactions || []
      );
    } catch (err) {
      addToast({
        type: "error",
        message:
          "Failed to load transactions",
      });
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      const res =
        await API.get("/categories");

      setCategories(
        res.data.categories || []
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH GOALS
  // =========================
  const fetchGoals = async () => {
    try {
      const res =
        await API.get("/goals");

      setGoals(
        res.data.goals || []
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchTransactions(),
        fetchCategories(),
        fetchGoals(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // AVAILABLE YEARS
  // =========================
  const availableYears =
    useMemo(() => {
      const years =
        transactions.map((t) =>
          new Date(t.date).getFullYear()
        );

      return [...new Set(years)].sort(
        (a, b) => b - a
      );
    }, [transactions]);

  // =========================
  // FILTER + SORT
  // =========================
  const filtered = useMemo(() => {
    let data = [...transactions];

    data = data.filter((t) => {
      const matchSearch =
        t.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        t.category_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchType =
        typeFilter === "all"
          ? true
          : t.type === typeFilter;

      const matchCategory =
        categoryFilter === "all"
          ? true
          : String(t.category_id) ===
            categoryFilter;

      // =========================
      // YEAR FILTER
      // =========================
      const transactionDate =
        new Date(t.date);

      const transactionYear =
        transactionDate.getFullYear();

      const transactionMonth =
        transactionDate.getMonth();

      const matchYear =
        selectedYear === "all"
          ? true
          : transactionYear ===
            Number(selectedYear);

      // =========================
      // MONTH FILTER
      // =========================
      const matchMonth =
        selectedMonth === "all"
          ? true
          : transactionMonth ===
            Number(selectedMonth);

      return (
        matchSearch &&
        matchType &&
        matchCategory &&
        matchYear &&
        matchMonth
      );
    });

    // =========================
    // SORTING
    // =========================
    switch (sortBy) {
      case "latest":
        data.sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );
        break;

      case "oldest":
        data.sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );
        break;

      case "highest":
        data.sort(
          (a, b) =>
            Number(b.amount) -
            Number(a.amount)
        );
        break;

      case "lowest":
        data.sort(
          (a, b) =>
            Number(a.amount) -
            Number(b.amount)
        );
        break;

      default:
        break;
    }

    return data;
  }, [
    transactions,
    search,
    typeFilter,
    categoryFilter,
    sortBy,
    selectedYear,
    selectedMonth,
  ]);

  // =========================
  // SUMMARY
  // =========================
  const income = filtered
    .filter(
      (t) => t.type === "income"
    )
    .reduce(
      (a, b) =>
        a + Number(b.amount),
      0
    );

  const expenses = filtered
    .filter(
      (t) => t.type === "expense"
    )
    .reduce(
      (a, b) =>
        a + Number(b.amount),
      0
    );

  const balance =
    income - expenses;

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    if (
      !form.title ||
      !form.amount ||
      !form.date
    ) {
      addToast({
        type: "error",
        message:
          "Fill required fields",
      });

      return;
    }

    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount),

        category_id:
          form.category_id || null,

        goal_id:
          form.goal_id || null,

        type: form.type,

        date: form.date,

        note: form.note,
      };

      if (editing) {
        await API.put(
          `/transactions/${editing.id}`,
          payload
        );

        addToast({
          type: "success",
          message:
            "Transaction updated",
        });
      } else {
        await API.post(
          "/transactions",
          payload
        );

        addToast({
          type: "success",
          message:
            "Transaction added",
        });
      }

      setOpenModal(false);

      setEditing(null);

      setForm({
        title: "",
        amount: "",
        category_id: "",
        goal_id: "",
        type: "expense",
        date: "",
        note: "",
      });

      fetchTransactions();
    } catch (err) {
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
      await API.delete(
        `/transactions/${id}`
      );

      addToast({
        type: "success",
        message:
          "Transaction deleted",
      });

      fetchTransactions();
    } catch (err) {
      addToast({
        type: "error",
        message:
          "Delete failed",
      });
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8ff]">
        <div className="text-xl font-semibold text-indigo-600">
          Loading Transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8ff]">
      <DashboardSidebar active="transactions" />

      <main className="lg:ml-80">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <DashboardTopbar
            title="Transactions 💰"
            subtitle="Manage your income and expenses"
          />

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <SummaryCard
              title="Income"
              value={formatLKR(income)}
              icon={<ArrowUpRight />}
            />

            <SummaryCard
              title="Expenses"
              value={formatLKR(expenses)}
              icon={<ArrowDownRight />}
            />

            <SummaryCard
              title="Balance"
              value={formatLKR(balance)}
              icon={<Wallet />}
            />

          </div>

          {/* FILTER BAR */}
          <div className="mt-8 flex flex-wrap gap-3 justify-between items-center">

            {/* SEARCH */}
            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="
                  pl-11 pr-4 py-3
                  rounded-2xl
                  border
                  bg-white/70
                  w-[300px]
                  outline-none
                "
              />

            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3">

              {/* TYPE */}
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
                className="px-4 py-3 rounded-2xl border bg-white/70"
              >

                <option value="all">
                  All Types
                </option>

                <option value="income">
                  Income
                </option>

                <option value="expense">
                  Expense
                </option>

              </select>

              {/* CATEGORY */}
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
                className="px-4 py-3 rounded-2xl border bg-white/70"
              >

                <option value="all">
                  All Categories
                </option>

                {categories.map((c) => (

                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </option>

                ))}

              </select>

              {/* YEAR */}
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value
                  )
                }
                className="px-4 py-3 rounded-2xl border bg-white/70"
              >

                <option value="all">
                  All Years
                </option>

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

              {/* MONTH */}
              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
                className="px-4 py-3 rounded-2xl border bg-white/70"
              >

                <option value="all">
                  All Months
                </option>

                {months.map(
                  (month, index) => (

                    <option
                      key={month}
                      value={index}
                    >
                      {month}
                    </option>

                  )
                )}

              </select>

              {/* SORT */}
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="px-4 py-3 rounded-2xl border bg-white/70"
              >

                <option value="latest">
                  Latest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="highest">
                  Highest Amount
                </option>

                <option value="lowest">
                  Lowest Amount
                </option>

              </select>

              {/* ADD */}
              <button
                onClick={() => {

                  setEditing(null);

                  setForm({
                    title: "",
                    amount: "",
                    category_id: "",
                    goal_id: "",
                    type: "expense",
                    date: "",
                    note: "",
                  });

                  setOpenModal(true);
                }}
                className="
                  px-5 py-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-500
                  to-sky-500
                  text-white
                "
              >

                <Plus size={18} />

              </button>

            </div>

          </div>

          {/* TRANSACTIONS */}
          <div className="space-y-4 mt-8">

            {filtered.length === 0 && (

              <div className="
                p-10
                rounded-[28px]
                bg-white/70
                border
                text-center
                text-gray-500
              ">

                No transactions found

              </div>

            )}

            {filtered.map((t) => (

              <div
                key={t.id}
                className="
                  p-5
                  rounded-[28px]
                  bg-white/70
                  border
                "
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="font-bold text-lg">
                      {t.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">

                      <span>
                        {t.category_name ||
                          "General"}
                      </span>

                      <span>
                        {t.date?.split("T")[0]}
                      </span>

                      {t.goal_title && (

                        <span className="
                          flex items-center gap-1
                          text-indigo-600
                        ">

                          <Target size={14} />

                          {t.goal_title}

                        </span>

                      )}

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <h3
                      className={`font-bold text-xl ${
                        t.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >

                      {t.type === "income"
                        ? "+"
                        : "-"}

                      {formatLKR(
                        t.amount
                      )}

                    </h3>

                    <button
                      onClick={() => {

                        setEditing(t);

                        setForm({
                          title: t.title,
                          amount: t.amount,

                          category_id:
                            t.category_id ||
                            "",

                          goal_id:
                            t.goal_id ||
                            "",

                          type: t.type,

                          date:
                            t.date?.split(
                              "T"
                            )[0],

                          note:
                            t.note || "",
                        });

                        setOpenModal(true);
                      }}
                    >

                      <Edit size={18} />

                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          t.id
                        )
                      }
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

      {/* MODAL */}
      <AnimatePresence>

        {openModal && (

          <TransactionModal
            editing={editing}
            form={form}
            setForm={setForm}
            setOpenModal={
              setOpenModal
            }
            handleSave={handleSave}
            categories={categories}
            goals={goals}
          />

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
    <div className="p-6 rounded-[28px] bg-white/70 border">

      <div className="flex justify-between">

        <p>{title}</p>

        {icon}

      </div>

      <h2 className="text-3xl font-bold mt-4">
        {value}
      </h2>

    </div>
  );
}

// =========================
// MODAL
// =========================
function TransactionModal({
  editing,
  form,
  setForm,
  setOpenModal,
  handleSave,
  categories,
  goals,
}) {

  const selectedCategory =
    categories.find(
      (c) =>
        Number(c.id) ===
        Number(form.category_id)
    );

  const isGoalSavings =
    selectedCategory?.name ===
    "Goal Savings";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0
        bg-black/40
        flex items-center justify-center
        z-50 p-4
      "
    >

      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
        }}
        className="
          w-full max-w-xl
          bg-white
          rounded-[32px]
          p-6
        "
      >

        <div className="flex justify-between mb-6">

          <h2 className="text-2xl font-bold">

            {editing
              ? "Edit Transaction"
              : "Add Transaction"}

          </h2>

          <button
            onClick={() =>
              setOpenModal(false)
            }
          >

            <X />

          </button>

        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-2xl border"
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-2xl border"
          />

          <select
            value={form.category_id}
            onChange={(e) =>
              setForm({
                ...form,
                category_id:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-2xl border"
          >

            <option value="">
              Select Category
            </option>

            {categories.map((c) => (

              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>

            ))}

          </select>

          {isGoalSavings && (

            <select
              value={form.goal_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  goal_id:
                    e.target.value,
                })
              }
              className="w-full p-3 rounded-2xl border"
            >

              <option value="">
                Select Goal
              </option>

              {goals.map((g) => (

                <option
                  key={g.id}
                  value={g.id}
                >
                  {g.title}
                </option>

              ))}

            </select>

          )}

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-2xl border"
          >

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expense
            </option>

          </select>

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-2xl border"
          />

          <textarea
            placeholder="Note"
            value={form.note}
            onChange={(e) =>
              setForm({
                ...form,
                note:
                  e.target.value,
              })
            }
            className="
              w-full p-3
              rounded-2xl border
              min-h-[100px]
            "
          />

          <button
            onClick={handleSave}
            className="
              w-full py-3
              rounded-2xl
              bg-gradient-to-r
              from-indigo-500
              to-sky-500
              text-white
            "
          >

            {editing
              ? "Update Transaction"
              : "Save Transaction"}

          </button>

        </div>

      </motion.div>

    </motion.div>
  );
}