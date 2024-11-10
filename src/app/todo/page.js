"use client";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function Todo() {
  // Load tasks from localStorage during initial state setup
  const [tasksToday, setTasksToday] = useState(() => {
    return JSON.parse(localStorage.getItem("tasksToday")) || [];
  });
  const [tasksUpcoming, setTasksUpcoming] = useState(() => {
    return JSON.parse(localStorage.getItem("tasksUpcoming")) || [];
  });
  const [showInput, setShowInput] = useState(false);
  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);

  // Save tasks to localStorage whenever tasksToday or tasksUpcoming changes
  useEffect(() => {
    localStorage.setItem("tasksToday", JSON.stringify(tasksToday));
    localStorage.setItem("tasksUpcoming", JSON.stringify(tasksUpcoming));
  }, [tasksToday, tasksUpcoming]);

  // Function to parse and add the task based on due date
  const addTask = () => {
    const taskText = newTask.trim();
    const dueRegex = /due\s*(today|tomorrow|\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})\s*at\s*(\d{1,2}:\d{2}(am|pm)?)/i;
    const match = taskText.match(dueRegex);

    if (match) {
      const taskName = taskText.replace(dueRegex, "").trim();
      const dateString = match[1].toLowerCase();
      const timeString = match[2];

      let dueDate;
      if (dateString === "today") {
        dueDate = dayjs();
      } else if (dateString === "tomorrow") {
        dueDate = dayjs().add(1, "day");
      } else {
        dueDate = dayjs(dateString, ["MM/DD/YYYY", "YYYY-MM-DD"]);
      }

      if (!dueDate.isValid()) {
        alert("Please enter a valid date.");
        return;
      }

      const taskWithDueDate = `${taskName} - Due ${dueDate.format("MMM D, YYYY")} at ${timeString}`;

      const today = dayjs().startOf("day");
      const tomorrow = dayjs().add(1, "day").startOf("day");

      if (dueDate.isSame(today, "day")) {
        setTasksToday([...tasksToday, taskWithDueDate]);
      } else if (dueDate.isSame(tomorrow, "day")) {
        setTasksUpcoming([...tasksUpcoming, taskWithDueDate]);
      } else {
        alert("Due date should be today or tomorrow for this demo.");
      }
    } else {
      alert("Please enter the task in the format: 'Task description due [today/tomorrow/YYYY-MM-DD/MM-DD-YYYY] at [HH:MMam/pm]'");
    }

    setNewTask("");
    setShowInput(false);
  };

  // Effect to handle clicks outside of the input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    if (showInput) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInput]);

  // Function to delete tasks from a list based on index
  const deleteTask = (index, listType) => {
    if (listType === "today") {
      const updatedTasks = tasksToday.filter((_, i) => i !== index);
      setTasksToday(updatedTasks);
    } else {
      const updatedTasks = tasksUpcoming.filter((_, i) => i !== index);
      setTasksUpcoming(updatedTasks);
    }
  };

  return (
    <div className="flex gap-x-4 h-screen max-w-full flex-row p-4 relative">
      <button
        onClick={() => setShowInput(true)}
        className="absolute top-3 right-12 text-lg bg-blue-200 p-2.5 rounded-full border-2 border-gray-500"
      >
        + add task
      </button>

      {/* TODAY rectangle */}
      <div className="flex-1 bg-blue-100 p-6 pb-20 rounded-lg shadow-lg">
        <h1 className="text-xl font-extrabold text-center mb-4 underline">TODAY</h1>
        <ul>
          {tasksToday.map((task, index) => (
            <li key={index} className="flex justify-between items-center text-lg text-gray-700 mb-2">
              {task}
              <button
                onClick={() => deleteTask(index, "today")}
                className="text-red-500 text-xl ml-4"
                aria-label="Delete task"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* UPCOMING rectangle */}
      <div className="flex-1 bg-blue-100 p-6 pb- rounded-lg shadow-lg">
        <h1 className="text-xl font-extrabold text-center mb-4 underline">UPCOMING</h1>
        <ul>
          {tasksUpcoming.map((task, index) => (
            <li key={index} className="flex justify-between items-center text-lg text-gray-700 mb-2">
              {task}
              <button
                onClick={() => deleteTask(index, "upcoming")}
                className="text-red-500 text-xl ml-4"
                aria-label="Delete task"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Centered Input with Translucent Background */}
      {showInput ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <input
            ref={inputRef}
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Enter task... e.g., 'Task due today at 08:30am'"
            className="w-3/4 lg:w-1/2 p-4 text-2xl text-center bg-[rgba(255, 255, 255, 0.8)] border-2 border-blue-400 rounded-lg outline-none placeholder-gray-500"
          />
        </div>
      ) : null}
    </div>
  );
}
