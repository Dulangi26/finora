import { useMemo, useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Plus,
  X,
  Edit,
  Trash2,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  Layers3,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";

import { useToast } from "../components/ToastProvider";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

// =========================
// MAIN PAGE
// =========================
export default function CategoriesPage() {

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
  // DATA
  // =========================
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // UI STATE
  // =========================
  const [tab, setTab] = useState("all");

  const [openModal, setOpenModal] = useState(false);

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "expense",
  });

  // =========================
  // LOAD CATEGORIES
  // =========================
  const loadCategories = async () => {

    try {

      setLoading(true);

      const res = await getCategories();

      setCategories(res.categories || []);

    } catch (error) {

      console.log(error);

      addToast({
        type: "error",
        message: "Failed to load categories",
      });

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // =========================
  // FILTERED
  // =========================
  const filtered = useMemo(() => {

    if (tab === "all") return categories;

    return categories.filter(
      (c) => c.type === tab
    );

  }, [categories, tab]);

  // =========================
  // STATS
  // =========================
  const incomeCount = categories.filter(
    (c) => c.type === "income"
  ).length;

  const expenseCount = categories.filter(
    (c) => c.type === "expense"
  ).length;

  // =========================
  // SAVE CATEGORY
  // =========================
  const saveCategory = async () => {

    if (!form.name.trim()) {

      addToast({
        type: "error",
        message: "Category name is required",
      });

      return;
    }

    const exists = categories.some(
      (c) =>
        c.name.toLowerCase() ===
          form.name.toLowerCase() &&
        c.id !== editing?.id
    );

    if (exists) {

      addToast({
        type: "error",
        message: "Category already exists",
      });

      return;
    }

    try {

      addToast({
        type: "loading",
        message: editing
          ? "Updating category..."
          : "Creating category...",
        sound: false,
      });

      if (editing) {

        await updateCategory(editing.id, {
          name: form.name,
          type: form.type,
          color:
            form.type === "income"
              ? "#10b981"
              : "#ef4444",
        });

        addToast({
          type: "success",
          message: "Category updated successfully",
        });

      } else {

        await createCategory({
          name: form.name,
          type: form.type,
          color:
            form.type === "income"
              ? "#10b981"
              : "#ef4444",
        });

        addToast({
          type: "success",
          message: "Category created successfully",
        });
      }

      await loadCategories();

      setForm({
        name: "",
        type: "expense",
      });

      setEditing(null);

      setOpenModal(false);

    } catch (error) {

      console.log(error);

      addToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "Something went wrong",
      });
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const remove = async (id) => {

    try {

      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((c) => c.id !== id)
      );

      addToast({
        type: "success",
        message: "Category deleted successfully",
      });

    } catch (error) {

      console.log(error);

      addToast({
        type: "error",
        message: "Failed to delete category",
      });
    }
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
      <DashboardSidebar active="categories" />

      {/* MAIN */}
      <main className="flex-1 ml-0 lg:ml-[320px] z-10">

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

          {/* TOPBAR */}
          <DashboardTopbar
            title="Categories 💼"
            subtitle="Manage and organize your transaction categories"
          />

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 max-w-5xl">

            <StatCard
              title="Total Categories"
              value={categories.length}
              icon={<Layers3 size={20} />}
            />

            <StatCard
              title="Income Categories"
              value={incomeCount}
              icon={<ArrowUpRight size={20} />}
            />

            <StatCard
              title="Expense Categories"
              value={expenseCount}
              icon={<ArrowDownRight size={20} />}
            />

          </div>

          {/* FILTER + ACTION */}
          <div
            className="
              mt-8
              max-w-5xl
              rounded-[30px]
              border border-white/40
              bg-white/60
              backdrop-blur-2xl
              shadow-[0_10px_50px_rgba(0,0,0,0.06)]
              p-5
            "
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              {/* TABS */}
              <div className="flex flex-wrap gap-3">

                <Tab
                  label="All"
                  active={tab === "all"}
                  onClick={() => setTab("all")}
                />

                <Tab
                  label="Income"
                  active={tab === "income"}
                  onClick={() => setTab("income")}
                />

                <Tab
                  label="Expense"
                  active={tab === "expense"}
                  onClick={() => setTab("expense")}
                />

              </div>

              {/* BUTTON */}
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
                    name: "",
                    type: "expense",
                  });

                  setOpenModal(true);
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

                Add Category

              </motion.button>

            </div>

          </div>

          {/* EMPTY */}
          {!loading && filtered.length === 0 && (

            <div
              className="
                mt-8
                max-w-5xl
                rounded-[30px]
                border border-white/40
                bg-white/60
                backdrop-blur-2xl
                shadow-[0_10px_50px_rgba(0,0,0,0.06)]
                p-14
                text-center
                text-gray-500
              "
            >

              No categories found

            </div>
          )}

          {/* CATEGORY GRID */}
          <div className="mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5">

            {filtered.map((c) => (

              <motion.div
                key={c.id}
                whileHover={{
                  y: -3,
                }}
                className="
                  rounded-[28px]
                  border border-white/40
                  bg-white/60
                  backdrop-blur-2xl
                  shadow-[0_10px_50px_rgba(0,0,0,0.06)]
                  p-5
                "
              >

                <div className="flex items-start justify-between">

                  {/* LEFT */}
                  <div className="flex items-center gap-4">

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        c.type === "income"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-500"
                      }`}
                    >

                      <Tag size={20} />

                    </div>

                    <div>

                      <h3 className="font-semibold text-lg text-gray-800">
                        {c.name}
                      </h3>

                      <p className="text-sm text-gray-500 capitalize mt-1">
                        {c.type} category
                      </p>

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => {

                        setEditing(c);

                        setForm({
                          name: c.name,
                          type: c.type,
                        });

                        setOpenModal(true);
                      }}
                      className="
                        w-10 h-10
                        rounded-xl
                        bg-indigo-50
                        text-indigo-600
                        flex items-center justify-center
                        hover:scale-105
                        transition
                      "
                    >

                      <Edit size={16} />

                    </button>

                    <button
                      onClick={() => remove(c.id)}
                      className="
                        w-10 h-10
                        rounded-xl
                        bg-rose-50
                        text-rose-500
                        flex items-center justify-center
                        hover:scale-105
                        transition
                      "
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </main>

      {/* MODAL */}
      <AnimatePresence>

        {openModal && (

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
              z-50
              p-4
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="
                w-full max-w-lg
                rounded-[30px]
                border border-white/40
                bg-white/70
                backdrop-blur-2xl
                shadow-[0_10px_80px_rgba(0,0,0,0.15)]
                p-6
              "
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    {editing
                      ? "Edit Category"
                      : "Add Category"}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Organize your transactions
                  </p>

                </div>

                <button
                  onClick={() => setOpenModal(false)}
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

                <input
                  type="text"
                  placeholder="Category Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
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

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
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

                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>

                </select>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={saveCategory}
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
                    ? "Update Category"
                    : "Save Category"}

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
// TAB
// =========================
function Tab({
  label,
  active,
  onClick,
}) {

  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2.5
        rounded-2xl
        text-sm font-medium
        transition
        ${
          active
            ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg"
            : "bg-white/70 border border-white/40 text-gray-600 hover:bg-white"
        }
      `}
    >

      {label}

    </button>
  );
}

// =========================
// STAT CARD
// =========================
function StatCard({
  title,
  value,
  icon,
}) {

  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        rounded-[28px]
        border border-white/40
        bg-white/60
        backdrop-blur-2xl
        shadow-[0_10px_50px_rgba(0,0,0,0.06)]
        p-5
      "
    >

      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <div className="text-indigo-500">
          {icon}
        </div>

      </div>

      <h3 className="text-3xl font-bold text-gray-900 mt-4">
        {value}
      </h3>

    </motion.div>
  );
}