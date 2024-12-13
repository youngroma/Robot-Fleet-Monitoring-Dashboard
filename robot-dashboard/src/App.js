import React, { useState, useEffect } from "react";
import RobotMap from "./RobotMap";
import "./App.css";
import { io } from "socket.io-client";

// Connection to the server via Socket.IO
const socket = io("http://127.0.0.1:5000");

const App = () => {
  const [robots, setRobots] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);

  useEffect(() => {
    // Loading of the initial data via REST API
    fetch("http://127.0.0.1:5000/robots")
      .then((response) => response.json())
      .then((data) => setRobots(data))
      .catch((error) => console.error("Error loading robots:", error));

    // Configure WebSocket to receive updates
    socket.on("update", (updatedRobot) => {
      setRobots((prevRobots) =>
        prevRobots.map((robot) =>
          robot.robot_id === updatedRobot.robot_id ? updatedRobot : robot
        )
      );
    });

    // Clean up connection when component unmount
    return () => {
      socket.off("update"); // Remove event handler to avoid memory leaks
    };
  }, []); // useEffect only starts when component is mounted

  // Filter robots by the selected filter
  const filteredRobots = robots.filter((robot) => {
    if (filter === "all") return true;
    if (filter === "online") return robot.online;
    if (filter === "low_battery") return robot.battery < 20;
    if (filter === "offline") return robot.online === false;
    return true;
  });

  const toggleDashboard = () => {
    setIsDashboardVisible((prev) => !prev);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Robot Fleet Dashboard</h1>
        <button onClick={toggleDashboard}>
          {isDashboardVisible ? "Hide Dashboard" : "Show Dashboard"}
        </button>
        <div className="filter">
          <label>Filter Robots:</label>
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="all">All</option>
            <option value="online">Online</option>
            <option value="low_battery">Low Battery</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </header>

      <main>
        {isDashboardVisible && (
          <div className="robot-list">
            <h2>Robot Details</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Battery</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredRobots.map((robot) => (
                  <tr key={robot.robot_id}>
                    <td>{robot.robot_id}</td>
                    <td>{robot.online ? "Online" : "Offline"}</td>
                    <td
                      style={{
                        color: robot.battery < 20 ? "red" : "black",
                      }}
                    >
                      {robot.battery}%
                    </td>
                    <td>{robot.location.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="map-container">
          <h2>Map</h2>
          <RobotMap robots={filteredRobots} />
        </div>
      </main>
    </div>
  );
};

export default App;
