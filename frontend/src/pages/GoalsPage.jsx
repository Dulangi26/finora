import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Plus,
  X,
  Edit,
  Trash2,
  Trophy,
  CheckCircle2,
  CalendarDays,
  Target,
  Wallet,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTopbar from "../components/DashboardTopbar";
import { useToast } from "../components/ToastProvider";

import goalImage from "../assets/images/goals.png";

// =========================
// FORMAT LKR
// =========================
const formatLKR = (v) =>
  `Rs. ${Number(v || 0).toLocaleString("en-LK")}`;

// =========================
// PAGE
// =========================
export default function GoalsPage() {

  const { addToast } = useToast();

  // =========================
  // STATES
  // =========================
  const [goals, setGoals] = useState([]);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(null);

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  // IMPORTANT:
  // current_amount removed from create form
  // because it auto comes from savings allocation
  const [form, setForm] = useState({
    title: "",
    target_amount: "",
    start_date: "",
    target_date: "",
  });

  // =========================
  // CURSOR GLOW
  // =========================
  const handleMouseMove = (e) => {

    setMouse({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // =========================
  // FETCH GOALS
  // =========================
  const fetchGoals = async () => {

    try {

      const res = await API.get("/goals");

      console.log("GOALS:", res.data);

      setGoals(res.data.goals || []);

    } catch (err) {

      console.log(err);

      addToast({
        type: "error",
        message: "Failed to load goals",
      });
    }
  };

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    fetchGoals();
  }, []);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {

    const totalTarget = goals.reduce(
      (acc, goal) =>
        acc + Number(goal.target_amount || 0),
      0
    );

    const totalSaved = goals.reduce(
      (acc, goal) =>
        acc + Number(goal.current_amount || 0),
      0
    );

    return {
      totalTarget,
      totalSaved,
      progress:
        totalTarget > 0
          ? (totalSaved / totalTarget) * 100
          : 0,
    };

  }, [goals]);

  // =========================
  // OPEN CREATE MODAL
  // =========================
  const openCreateModal = () => {

    setEditing(null);

    setForm({
      title: "",
      target_amount: "",
      start_date: "",
      target_date: "",
    });

    setOpen(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const openEditModal = (goal) => {

    setEditing(goal);

    setForm({
      title: goal.title || "",
      target_amount:
        goal.target_amount || "",
      start_date:
        goal.start_date?.split("T")[0] || "",
      target_date:
        goal.target_date?.split("T")[0] || "",
    });

    setOpen(true);
  };

  // =========================
  // SAVE GOAL
  // =========================
  const handleSave = async () => {

    if (
      !form.title ||
      !form.target_amount
    ) {

      addToast({
        type: "error",
        message:
          "Please fill required fields",
      });

      return;
    }

    try {

      const payload = {
        title: form.title,
        target_amount: Number(
          form.target_amount
        ),
        start_date:
          form.start_date || null,
        target_date:
          form.target_date || null,
      };

      if (editing) {

        await API.put(
          `/goals/${editing.id}`,
          payload
        );

        addToast({
          type: "success",
          message: "Goal updated successfully",
        });

      } else {

        await API.post(
          "/goals",
          payload
        );

        addToast({
          type: "success",
          message: "Goal created successfully",
        });
      }

      setOpen(false);

      setEditing(null);

      fetchGoals();

    } catch (err) {

      console.log(err);

      addToast({
        type: "error",
        message: "Failed to save goal",
      });
    }
  };

  // =========================
  // DELETE GOAL
  // =========================
  const handleDelete = async (id) => {

    try {

      await API.delete(`/goals/${id}`);

      setGoals((prev) =>
        prev.filter((g) => g.id !== id)
      );

      addToast({
        type: "success",
        message: "Goal deleted successfully",
      });

    } catch (err) {

      console.log(err);

      addToast({
        type: "error",
        message: "Delete failed",
      });
    }
  };

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

      {/* CURSOR GLOW */}
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

      {/* BLOBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-sky-200/30 rounded-full blur-3xl" />

      {/* SIDEBAR */}
      <DashboardSidebar active="goals" />

      {/* MAIN */}
      <main className="flex-1 lg:ml-[320px] z-10">

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

          {/* TOPBAR */}
          <DashboardTopbar
            title="Goals 🎯"
            subtitle="Track your financial dreams & milestones"
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
              rounded-[36px]
              overflow-hidden
              border border-white/40
              bg-white/60
              backdrop-blur-2xl
              shadow-[0_10px_60px_rgba(0,0,0,0.06)]
            "
          >

            <div className="grid lg:grid-cols-2 items-center">

              {/* LEFT */}
              <div className="p-8 lg:p-12">

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  px-4 py-2
                  rounded-full
                  bg-indigo-100
                  text-indigo-600
                  text-sm
                  font-medium
                ">

                  <Trophy size={16} />

                  Financial Goal Planner

                </div>

                <h2 className="
                  text-4xl
                  font-bold
                  text-gray-900
                  mt-6
                  leading-tight
                ">

                  Achieve Your Future Dreams 🚀

                </h2>

                <p className="
                  text-gray-500
                  mt-4
                  text-lg
                  leading-relaxed
                ">

                  Create savings goals,
                  monitor your progress,
                  and stay motivated.

                </p>

                <button
                  onClick={openCreateModal}
                  className="
                    mt-8
                    flex items-center gap-2
                    px-6 py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    to-sky-500
                    text-white
                    shadow-lg
                    hover:scale-[1.02]
                    transition
                  "
                >

                  <Plus size={18} />

                  Create Goal

                </button>

              </div>

              {/* IMAGE */}
              <div className="
                relative
                h-full
                flex
                items-center
                justify-center
                p-6
              ">

                <img
                  src={goalImage}
                  alt="Goals"
                  className="
                    w-full
                    max-w-[500px]
                    object-contain
                    drop-shadow-2xl
                  "
                />

              </div>

            </div>

          </motion.div>

          {/* STATS */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
            mt-8
          ">

            <StatCard
              title="Total Goals"
              value={goals.length}
              icon={<Target size={22} />}
            />

            <StatCard
              title="Total Saved"
              value={formatLKR(
                stats.totalSaved
              )}
              icon={<Wallet size={22} />}
            />

            <StatCard
              title="Overall Progress"
              value={`${stats.progress.toFixed(
                1
              )}%`}
              icon={<Trophy size={22} />}
            />

          </div>

          {/* EMPTY */}
          {goals.length === 0 && (

            <div className="
              mt-8
              rounded-[32px]
              border border-white/40
              bg-white/60
              backdrop-blur-2xl
              shadow-[0_10px_50px_rgba(0,0,0,0.06)]
              p-16
              text-center
            ">

              <Target
                size={52}
                className="
                  mx-auto
                  text-indigo-500
                "
              />

              <h3 className="
                text-2xl
                font-bold
                mt-5
                text-gray-900
              ">

                No Goals Yet

              </h3>

              <p className="
                text-gray-500
                mt-3
              ">

                Create your first financial goal.

              </p>

            </div>
          )}

          {/* GOALS */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
            mt-8
          ">

            {goals.map((g) => {

              // IMPORTANT FIX
              const current =
                Number(g.current_amount || 0);

              const target =
                Number(g.target_amount || 0);

              const percent =
                target > 0
                  ? (current / target) * 100
                  : 0;

              return (

                <motion.div
                  key={g.id}
                  whileHover={{
                    y: -3,
                  }}
                  className="
                    rounded-[28px]
                    border border-white/40
                    bg-white/60
                    backdrop-blur-2xl
                    shadow-[0_10px_50px_rgba(0,0,0,0.06)]
                    p-6
                  "
                >

                  {/* HEADER */}
                  <div className="
                    flex
                    justify-between
                    items-start
                  ">

                    <div>

                      <h3 className="
                        text-xl
                        font-bold
                        text-gray-900
                      ">
                        {g.title}
                      </h3>

                      <p className="
                        text-sm
                        text-gray-500
                        mt-1
                      ">

                        {formatLKR(current)} saved of{" "}
                        {formatLKR(target)}

                      </p>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          openEditModal(g)
                        }
                        className="
                          w-10 h-10
                          rounded-xl
                          bg-indigo-50
                          text-indigo-600
                          flex items-center justify-center
                        "
                      >

                        <Edit size={16} />

                      </button>

                      <button
                        onClick={() =>
                          handleDelete(g.id)
                        }
                        className="
                          w-10 h-10
                          rounded-xl
                          bg-rose-50
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

                    <div className="
                      flex
                      justify-between
                      text-sm
                      mb-2
                    ">

                      <span className="text-gray-500">
                        Progress
                      </span>

                      <span className="
                        font-semibold
                        text-indigo-600
                      ">

                        {percent.toFixed(0)}%

                      </span>

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
                          width: `${Math.min(
                            percent,
                            100
                          )}%`,
                        }}
                        transition={{
                          duration: 0.7,
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

                  {/* DATES */}
                  {(g.start_date ||
                    g.target_date) && (

                    <div className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                    ">

                      <CalendarDays size={16} />

                      {g.start_date?.split("T")[0]}
                      {" "}→{" "}
                      {g.target_date?.split("T")[0]}

                    </div>
                  )}

                  {/* COMPLETE */}
                  {percent >= 100 && (

                    <div className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      text-green-500
                      font-medium
                    ">

                      <CheckCircle2 size={18} />

                      Goal Completed 🎉

                    </div>
                  )}

                </motion.div>
              );
            })}

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
                w-full
                max-w-lg
                rounded-[32px]
                border border-white/40
                bg-white/90
                backdrop-blur-2xl
                shadow-[0_10px_80px_rgba(0,0,0,0.15)]
                p-7
              "
            >

              {/* HEADER */}
              <div className="
                flex
                justify-between
                items-center
                mb-6
              ">

                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                    text-gray-900
                  ">

                    {editing
                      ? "Edit Goal"
                      : "Create Goal"}

                  </h2>

                  <p className="
                    text-gray-500
                    text-sm
                    mt-1
                  ">

                    Savings are automatically allocated from transactions

                  </p>

                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    setEditing(null);
                  }}
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
              <div className="space-y-5">

                {/* TITLE */}
                <div>

                  <label className="
                    text-sm
                    font-semibold
                    text-gray-700
                    block
                    mb-2
                  ">
                    Goal Title
                  </label>

                  <input
                    type="text"
                    placeholder="Ex: Buy a Car"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      px-4 py-3
                      outline-none
                      focus:ring-2
                      focus:ring-indigo-400
                    "
                  />

                </div>

                {/* TARGET */}
                <div>

                  <label className="
                    text-sm
                    font-semibold
                    text-gray-700
                    block
                    mb-2
                  ">
                    Target Amount
                  </label>

                  <input
                    type="number"
                    placeholder="500000"
                    value={form.target_amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        target_amount:
                          e.target.value,
                      })
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      px-4 py-3
                      outline-none
                      focus:ring-2
                      focus:ring-indigo-400
                    "
                  />

                </div>

                {/* DATES */}
                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                ">

                  <div>

                    <label className="
                      text-sm
                      font-semibold
                      text-gray-700
                      block
                      mb-2
                    ">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={form.start_date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          start_date:
                            e.target.value,
                        })
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        px-4 py-3
                        outline-none
                        focus:ring-2
                        focus:ring-indigo-400
                      "
                    />

                  </div>

                  <div>

                    <label className="
                      text-sm
                      font-semibold
                      text-gray-700
                      block
                      mb-2
                    ">
                      Target Date
                    </label>

                    <input
                      type="date"
                      value={form.target_date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          target_date:
                            e.target.value,
                        })
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        px-4 py-3
                        outline-none
                        focus:ring-2
                        focus:ring-indigo-400
                      "
                    />

                  </div>

                </div>

                {/* BUTTON */}
                <button
                  onClick={handleSave}
                  className="
                    w-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-sky-500
                    text-white
                    py-3
                    rounded-2xl
                    shadow-lg
                    font-semibold
                    hover:opacity-90
                    transition
                  "
                >

                  {editing
                    ? "Update Goal"
                    : "Save Goal"}

                </button>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
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

      <div className="
        flex
        items-center
        justify-between
      ">

        <p className="
          text-sm
          text-gray-500
        ">
          {title}
        </p>

        <div className="
          text-indigo-500
        ">
          {icon}
        </div>

      </div>

      <h3 className="
        text-3xl
        font-bold
        text-gray-900
        mt-4
      ">
        {value}
      </h3>

    </motion.div>
  );
}