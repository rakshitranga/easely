"use client";
import { Calendar } from "react-calendar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllAssignments, setShowAllAssignments] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        console.log("Fetched courses:", response.data);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/api/assignments");
        console.log("Fetched assignments:", response.data);

        const assignmentsWithDueDate = response.data
          .filter((assignment) => assignment.due_at)
          .map((assignment) => ({
            dueDate: assignment.due_at,
            url: assignment.url,
            name: assignment.name,
            courseId: assignment.course_id,
          }));

        setAssignments(assignmentsWithDueDate);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, []);

  // Function to check if an assignment is due on the selected date
  const isAssignmentDueOnSelectedDate = (dueDate) => {
    const assignmentDate = new Date(dueDate);
    return (
      assignmentDate.getFullYear() === selectedDate.getFullYear() &&
      assignmentDate.getMonth() === selectedDate.getMonth() &&
      assignmentDate.getDate() === selectedDate.getDate()
    );
  };

  // Filter assignments based on whether 'Show All' is active or the selected date
  const assignmentsToDisplay = showAllAssignments
    ? assignments
    : assignments.filter((assignment) => isAssignmentDueOnSelectedDate(assignment.dueDate));

  return (
    <div>
      <div className="flex gap-x-4 h-screen max-
       bg-white border border-[#a0a096] font-sans flex-row">
        <div className="w-1/2 p-4 bg-blue-100 w-80">
          <Calendar
            className="bg-blue-100 text-gray-800 font-sans rounded-lg align-center text-center p-2"
            nextLabel={<span className="custom-nav-arrow p-3">&gt;</span>}
            prevLabel={<span className="custom-nav-arrow p-3">&lt;</span>}
            onChange={(date) => {
              setSelectedDate(date);
              setShowAllAssignments(false); // Reset to show only selected date assignments
            }}
            selectRange={false}
            tileClassName={({ date, view }) =>
              view === "month" ? "hover:bg-blue-200" : ""
            }
          />
          <button
            onClick={() => setShowAllAssignments(!showAllAssignments)}
            className="mt-4 p-2 bg-blue-400 text-white rounded"
          >
            {showAllAssignments ? "Show Assignments Due on Selected Date" : "Show All Assignments"}
          </button>
        </div>
            <div className="text-black">
              <h2 className="p-3 pb-2 text-2xl font-semibold tracking-wide border-b-2 border-blue-100">
                Courses
              </h2>
              {courses.map((course, index) => (
                <div className="p-3 bg-blue-100 rounded-full m-2" key={index}>
                  {course}
                </div>
              ))}
            </div>
            <div className="text-black">
              <h2 className="p-3 pb-2 text-2xl font-semibold tracking-wide border-b-2 border-blue-100">
                Assignments
              </h2>
              {assignmentsToDisplay.length > 0 ? (
                assignmentsToDisplay.map((assignment, index) => (
                  <div key={index} className="assignment m-2 p-3 bg-green-100 rounded-full">
                    <a href={assignment.url} target="_blank" rel="noopener noreferrer">
                      <h3>{assignment.name}</h3>
                    </a>
                    <p>Due Date: {new Date(assignment.dueDate).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className = "p-3" >No assignments {showAllAssignments ? "" : "due on this date"}.</p>
              )}
        </div>
      </div>
       {/* Positioned "Powered by Canvas" at the bottom-right */}
       <div className="absolute bottom-4 right-4 text-sm text-gray-600">
        Powered by Canvas
      </div>
    </div>
  );
}
