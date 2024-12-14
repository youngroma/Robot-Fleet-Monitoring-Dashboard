import React, {useState} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";

const createCircleMarker = (color) => {
  return new L.DivIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; border-radius: 50%; width: 25px; height: 25px;"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [1, -34],
  });
};

const RobotMap = ({ robots }) => {
  const [selectedRobot, setSelectedRobot] = useState(null);

  const handleMarkerClick = (robot) => {
    setSelectedRobot(robot);
  };

  const maxBounds = [
    [-90, -180],
    [90, 180],
  ];


 return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={2} // Initial zoom
        minZoom={2}
        maxZoom={18}
        maxBounds={maxBounds}
        style={{ height: 675, width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup>
          {robots.map((robot) => {
            let markerColor = "gray"; // Default is grey (offline)
            if (robot.online) {
              markerColor = robot.battery < 20 ? "red" : "green"; // Green for online and red for low charge
            }

            return (
              <Marker
                key={robot.robot_id}
                position={robot.location}
                icon={createCircleMarker(markerColor)}
                eventHandlers={{
                  click: () => handleMarkerClick(robot), // Clicheader
                }}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <h4>Robot ID: {robot.robot_id}</h4>
                    <p>
                      <strong>Status:</strong> {robot.online ? "Online" : "Offline"}
                    </p>
                    <p>
                      <strong>Battery:</strong> {robot.battery}%
                    </p>
                    <p>
                      <strong>Location:</strong> {robot.location.join(", ")}
                    </p>
                    <p>
                        <strong>CPU Usage:</strong> {robot.cpu} %
                    </p>
                    <p>
                        <strong>RAM Consumption:</strong> {robot.ram} MB
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Table to be displayed on top of the map */}
      {selectedRobot && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000, // To have the table on top of the map
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",

          }}
        >
          <h4>Robot ID: {selectedRobot.robot_id}</h4>
          <p>
            <strong>Status:</strong> {selectedRobot.online ? "Online" : "Offline"}
          </p>
          <p>
            <strong>Battery:</strong> {selectedRobot.battery}%
          </p>
          <p>
            <strong>Location:</strong> {selectedRobot.location.join(", ")}
          </p>
          <p>
            <strong>CPU Usage:</strong> {selectedRobot.cpu} %
          </p>
          <p>
            <strong>RAM Consumption:</strong> {selectedRobot.ram} MB
          </p>
        </div>
      )}
    </div>
  );
};

export default RobotMap;
