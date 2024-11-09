"use client"
import {Calendar} from "react-calendar";
import {useState, useEffect} from 'react';
//import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/courses');
        console.log("Fetched courses:", response.data);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
  }, []);
  //handling changes to calendar
  const[value, onChange] = useState(new Date());

  return (
    <div>
      <div className = "flex gap-x-4 h-screen max-w-full bg-white border border-[#a0a096] font-sans  flex-row" >
        <div className = "w-1/2 p-4 bg-blue-100 w-80">
          <Calendar className = "bg-blue-300 text-gray-800 font-sans rounded-lg align-center text-center p-2" 
          nextLabel={<span className="custom-nav-arrow p-3">&gt;</span>}
          prevLabel={<span className="custom-nav-arrow p-3">&lt;</span>}
          onChange={onChange} value = {value}
          selectRange = {true}
          tileClassName ={({date, view}) => view == 'month' ? "hover:bg-gray-200" : ""} 
          />
        </div>
        <div className="text-black">
          {courses.map((course, index) => {
            return (
              <p key={index}>{course}</p>
            )
          })}
        </div>
      </div> 
    </div>
  );
}
