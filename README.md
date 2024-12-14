# Robot Fleet Monitoring Dashboard

This project provides a real-time monitoring dashboard to visualize the status and telemetry data of multiple robots. It uses Flask for the backend and React for the frontend

## Tools Used

- **Flask**
- **React**
- **Docker**
- **Docker Compose**

## Features

- Visualize status and telemetry data from multiple robots.
- Enable real-time updates using WebSockets
- Flask handles robot data requests and serves the telemetry information.
- Display a map view using library Leaflet.js
- **Dockerized application**: Easily deployable using Docker and Docker Compose.

## Setup Instructions

### Prerequisites

- **Docker** and **Docker Compose** installed on your system.
  
### Clone the repository
```bash
git clone https://github.com/youngroma/Robot-Fleet-Monitoring-Dashboard.git
cd Robot-Fleet-Monitoring-Dashboard
```

## Build and Run the Application
### Build the Docker containers: From the root of the project directory, run:
```bash
docker-compose up --build
```

## Access the application:

### The frontend will be available at http://localhost:3000.
### The backend (Flask API) will be available at http://localhost:5000.

