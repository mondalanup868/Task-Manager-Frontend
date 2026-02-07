import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

import Add from "../assets/add.png";
import Pdf from "../assets/pdf.png";
import Task from "../assets/task.png";

import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("taskManager");

  // TASK MANAGER
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [records, setRecords] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // ADD TASK
  const [taskDate, setTaskDate] = useState("");
  const [tasks, setTasks] = useState([{ title: "", description: "" }]);
  const [savingTasks, setSavingTasks] = useState(false);

  // REPORT
  const [reportFrom, setReportFrom] = useState("");
  const [reportTo, setReportTo] = useState("");
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // UTILS
  const getToday = () => new Date().toISOString().split("T")[0];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);

    return `${dd}/${mm}/${yy}`;
  };

  const getThisWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const format = (d) => d.toISOString().split("T")[0];

    return { from: format(monday), to: format(sunday) };
  };

  // FETCH TASKS
  const fetchTasks = async (customFrom, customTo) => {
    const f = customFrom || from;
    const t = customTo || to;

    if (!f || !t) return toast.error("Please select both dates");

    try {
      setLoadingTasks(true);
      const res = await api.get(`/api/tasks/range?from=${f}&to=${t}`);
      setRecords(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks ❌");
    } finally {
      setLoadingTasks(false);
    }
  };

  // SAVE TASKS
  const addNewRow = () => {
    setTasks([...tasks, { title: "", description: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  const removeRow = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const saveTasks = async () => {
    if (!taskDate) return toast.error("Please select a date");
    if (tasks.length === 0) return toast.error("Please add at least 1 task");

    const cleanTasks = tasks.filter((t) => t.title.trim() !== "");

    if (cleanTasks.length === 0)
      return toast.error("Task title cannot be empty");

    try {
      setSavingTasks(true);

      await api.post("/api/tasks/add", { date: taskDate, tasks: cleanTasks });

      toast.success("Tasks saved successfully ✅");

      fetchTasks();
      setTasks([{ title: "", description: "" }]);
      setTaskDate(getToday());
      setActiveTab("taskManager");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save tasks ❌");
    } finally {
      setSavingTasks(false);
    }
  };

  // DOWNLOAD PDF
  const downloadPDF = async () => {
    if (!reportFrom || !reportTo) return toast.error("Select both dates");

    try {
      setDownloadingPDF(true);

      const res = await api.get(
        `/api/report/pdf?from=${reportFrom}&to=${reportTo}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${reportFrom}_to_${reportTo}.pdf`);
      document.body.appendChild(link);
      link.click();

      toast.success("PDF downloaded ✅");
    } catch (error) {
      toast.error(error.response?.data?.message || "PDF generation failed ❌");
    } finally {
      setDownloadingPDF(false);
    }
  };

  // ON LOAD
  useEffect(() => {
    const week = getThisWeekRange();

    setFrom(week.from);
    setTo(week.to);
    fetchTasks(week.from, week.to);

    setTaskDate(getToday());

    setReportFrom(week.from);
    setReportTo(week.to);

    setActiveTab("taskManager");

    // eslint-disable-next-line
  }, []);

  // SUMMARY
  const totalDays = records?.length || 0;

  const totalTasks = useMemo(() => {
    return records.reduce((sum, r) => sum + (r.tasks?.length || 0), 0);
  }, [records]);

  const tabVariants = {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -12, scale: 0.98 },
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen text-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#05070f]" />
        <div className="absolute -top-40 -left-40 w-130 bg-blue-600/20 blur-[140px] rounded-full" />
        <div className="absolute top-40 -right-40 w-130 bg-purple-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-130 bg-cyan-500/10 blur-[160px] rounded-full" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-3 sm:px-6 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {/* Task Manager */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("taskManager")}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 border transition relative overflow-hidden
                ${
                  activeTab === "taskManager"
                    ? "bg-white/5 border-blue-500/70 shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                    : "bg-white/3 border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-cyan-500/10 opacity-70" />
                <div className="relative flex items-center gap-4">
                  <img src={Task} alt="" className="w-12 sm:w-14 drop-shadow" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      View Tasks
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      Weekly & custom range
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Add Task */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("addTask")}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 border transition relative overflow-hidden
                ${
                  activeTab === "addTask"
                    ? "bg-white/5 border-cyan-400/70 shadow-[0_0_30px_rgba(34,211,238,0.22)]"
                    : "bg-white/3 border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-70" />
                <div className="relative flex items-center gap-4">
                  <img src={Add} alt="" className="w-12 sm:w-14 drop-shadow" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      Add Task
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      Daily work logging
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Reports */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("reports")}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 border transition relative overflow-hidden
                ${
                  activeTab === "reports"
                    ? "bg-white/5 border-purple-400/70 shadow-[0_0_30px_rgba(168,85,247,0.22)]"
                    : "bg-white/3 border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-transparent to-pink-500/10 opacity-70" />
                <div className="relative flex items-center gap-4">
                  <img src={Pdf} alt="" className="w-12 sm:w-14 drop-shadow" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      View Reports
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      Download PDF
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {/* TASK MANAGER */}
              {activeTab === "taskManager" && (
                <motion.div
                  key="taskManager"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl p-4 sm:p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-blue-400 tracking-tight">
                      View Tasks
                    </h3>

                    <div className="text-xs text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-full sm:w-auto text-center">
                      Total Days:{" "}
                      <span className="text-white font-semibold">
                        {totalDays}
                      </span>{" "}
                      • Total Tasks:{" "}
                      <span className="text-white font-semibold">
                        {totalTasks}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-6" />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Filters */}
                    <div className="lg:col-span-1 bg-black/30 border border-white/10 rounded-2xl p-5">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-2">
                            From
                          </label>
                          <input
                            type="date"
                            className="bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white w-full outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-2">
                            To
                          </label>
                          <input
                            type="date"
                            className="bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white w-full outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                          />
                        </div>

                        <button
                          onClick={() => fetchTasks()}
                          disabled={loadingTasks}
                          className="w-full px-5 py-3 rounded-xl font-semibold text-white
                          transition-all duration-300
                          bg-gradient-to-r from-blue-600/80 to-cyan-500/80
                          border border-white/10
                          shadow-lg shadow-blue-500/20
                          hover:from-blue-600 hover:to-cyan-500
                          active:scale-95
                          disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingTasks ? "Loading..." : "Fetch By Date Range"}
                        </button>

                        <button
                          onClick={() => {
                            const week = getThisWeekRange();
                            setFrom(week.from);
                            setTo(week.to);
                            fetchTasks(week.from, week.to);
                          }}
                          className="w-full px-5 py-3 rounded-xl font-semibold transition-all duration-300
                          bg-gradient-to-r from-indigo-600/40 to-purple-600/40
                          border border-white/15 text-white
                          shadow-md shadow-indigo-500/10
                          hover:from-indigo-600 hover:to-purple-700
                          hover:border-white/30
                          active:scale-95"
                        >
                          View This Week
                        </button>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2">
                      {records.length === 0 ? (
                        <div className="border border-white/10 bg-black/30 p-8 rounded-2xl text-center">
                          <p className="text-gray-400">
                            No tasks found for this range.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {records.map((r, idx) => (
                            <motion.div
                              key={r._id}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, delay: idx * 0.05 }}
                              className="border border-white/10 bg-black/30 p-5 sm:p-6 rounded-2xl"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <h4 className="font-extrabold text-lg text-yellow-300">
                                  📅 {formatDate(r.date)}
                                </h4>

                                <div className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-xl w-fit">
                                  Tasks:{" "}
                                  <span className="text-white font-semibold">
                                    {r.tasks?.length || 0}
                                  </span>
                                </div>
                              </div>

                              <ul className="space-y-3">
                                {r.tasks.map((t, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: i * 0.04,
                                    }}
                                    className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition"
                                  >
                                    <p className="font-semibold text-white">
                                      {t.title}
                                    </p>

                                    {t.description && (
                                      <p className="text-gray-400 text-sm mt-1 break-words">
                                        {t.description}
                                      </p>
                                    )}
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ADD TASK */}
              {activeTab === "addTask" && (
                <motion.div
                  key="addTask"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl p-4 sm:p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-cyan-300 tracking-tight">
                      Add Your Today's Tasks
                    </h3>

                    <div className="w-full sm:w-auto">
                      <label className="block text-xs text-gray-400 mb-1">
                        Task Date
                      </label>
                      <input
                        type="date"
                        className="bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white w-full sm:w-60 outline-none focus:ring-2 focus:ring-cyan-500/50"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-6" />

                  <div className="space-y-4">
                    {tasks.map((task, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-black/30 border border-white/10 rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm font-semibold text-gray-300">
                            Task #{index + 1}
                          </div>

                          {tasks.length > 1 && (
                            <button
                              onClick={() => removeRow(index)}
                              className="px-3 py-1 rounded-lg text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition text-xs font-semibold"
                            >
                              ❌ Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-1">
                            <label className="block text-xs text-gray-400 mb-2">
                              Task Title{" "}
                              <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Write task title"
                              className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white w-full outline-none focus:ring-2 focus:ring-blue-500/50"
                              value={task.title}
                              onChange={(e) =>
                                handleChange(index, "title", e.target.value)
                              }
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs text-gray-400 mb-2">
                              Description (optional)
                            </label>
                            <input
                              type="text"
                              placeholder="Write task description"
                              className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white w-full outline-none focus:ring-2 focus:ring-purple-500/50"
                              value={task.description}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                      onClick={addNewRow}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition
                      bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                      ➕ Add Another Task
                    </button>

                    <button
                      onClick={saveTasks}
                      disabled={savingTasks}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition
                      bg-linear-to-r from-cyan-500 to-blue-600 hover:opacity-90
                      disabled:opacity-60 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
                    >
                      {savingTasks ? "Saving..." : "Save Task"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* REPORTS */}
              {activeTab === "reports" && (
                <motion.div
                  key="reports"
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl p-4 sm:p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                >
                  <h3 className="text-xl sm:text-2xl font-extrabold text-purple-300 tracking-tight mb-6">
                    Select date and Generate Report
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2 bg-black/30 border border-white/10 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">
                        Select Date Range
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 mb-2 block">
                            From
                          </label>
                          <input
                            type="date"
                            className="bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white w-full outline-none focus:ring-2 focus:ring-purple-500/50"
                            value={reportFrom}
                            onChange={(e) => setReportFrom(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 mb-2 block">
                            To
                          </label>
                          <input
                            type="date"
                            className="bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white w-full outline-none focus:ring-2 focus:ring-purple-500/50"
                            value={reportTo}
                            onChange={(e) => setReportTo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                      <button
                        onClick={downloadPDF}
                        disabled={downloadingPDF}
                        className="w-full px-6 py-3 rounded-xl font-semibold transition
                        bg-linear-to-r from-green-500 to-emerald-600 hover:opacity-90
                        disabled:opacity-60 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                      >
                        {downloadingPDF ? "Generating..." : "Download Report"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
