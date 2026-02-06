import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function AddTask() {
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([{ title: "", description: "" }]);
  const [loading, setLoading] = useState(false);

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
    if (!date) return toast.error("Please select a date");
    if (tasks.length === 0) return toast.error("Please add at least 1 task");

    // remove empty tasks automatically
    const cleanTasks = tasks.filter((t) => t.title.trim() !== "");

    if (cleanTasks.length === 0) {
      return toast.error("Task title cannot be empty");
    }

    try {
      setLoading(true);
      await api.post("/api/tasks/add", { date, tasks: cleanTasks });
      toast.success("Tasks saved successfully ✅");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save tasks ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Add Your Daily Tasks</h2>

          {/* Date Picker */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Select Date
            </label>
            <input
              type="date"
              className="bg-gray-950 border border-gray-700 p-2 rounded-lg text-white w-full md:w-62.5"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Task Cards */}
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Title */}
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm text-gray-400 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      placeholder="Eg: Fixed login bug"
                      className="bg-gray-950 border border-gray-700 p-2 rounded-lg text-white w-full"
                      value={task.title}
                      onChange={(e) =>
                        handleChange(index, "title", e.target.value)
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="w-full md:w-2/3">
                    <label className="block text-sm text-gray-400 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Eg: Fixed JWT token issue & improved UI"
                      className="bg-gray-950 border border-gray-700 p-2 rounded-lg text-white w-full"
                      value={task.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Remove Button */}
                {tasks.length > 1 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => removeRow(index)}
                      className="text-red-400 hover:text-red-300 font-semibold text-sm"
                    >
                      ❌ Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              onClick={addNewRow}
              className="bg-gray-800 border border-gray-700 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition"
            >
              + Add More
            </button>

            <button
              onClick={saveTasks}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Tasks"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
