"use client"
import { useState, useEffect } from "react";
import axios from "axios"
import {marked} from "marked"

export default function Aura() {
    const [response, setResponse] = useState("");

    const todoList = localStorage.getItem("tasksToday").concat(localStorage.getItem("tasksUpcoming"));

    useEffect(() => {
        const getStudyPlan = async () => {
          try {
            const response = await axios.get("/api/aura", {
                params: {
                    prompt: `List a study plan with these given tasks: ${todoList}`
                }
            });
            console.log("Got response: ", response.data);
            setResponse(response.data);
          } catch (error) {
            console.error("Error getting response: ", error);
          }
        };
        getStudyPlan();
    }, []);

    return (
        <div>
            {response}
        </div>
    )
}