import json
import random
import time
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from threading import Thread
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Loading fake robot data from JSON
def load_robots():
    with open("fake_robot_data.json", "r") as file:
        raw_data = json.load(file)
    for robot in raw_data:
        robot['last_updated'] = int(datetime.strptime(robot['Last Updated'], "%Y-%m-%d %H:%M:%S").timestamp())
        robot['robot_id'] = robot.pop('Robot ID')
        robot['online'] = robot.pop('Online/Offline')
        robot['battery'] = robot.pop('Battery Percentage')
        robot['cpu'] = robot.pop('CPU Usage')
        robot['ram'] = robot.pop('RAM Consumption')
        robot['location'] = robot.pop('Location Coordinates')
    return raw_data

robots = load_robots()

# Simulating real updates
def update_robots():
    online = random.choice([True, False])
    while True:
        for robot in robots:
            if robot['online']:
                robot['battery'] = max(0, robot['battery'] - random.randint(0, 2))

                robot['cpu'] = random.randint(10, 100)
                robot['ram'] = random.randint(1000, 8000)
                #
                # robot['location'] = [
                #     round(robot['location'][0] + random.uniform(-0.01, 0.01), 6),
                #     round(robot['location'][1] + random.uniform(-0.01, 0.01), 6)
                # ]

                robot['last_updated'] = int(time.time())

                # Sending updates via WebSocket
                socketio.emit('update', robot)

        time.sleep(5)  # Wait 5 seconds before next refresh cycle


# API to get all robots
@app.route("/robots", methods=["GET"])
def get_robots():
    formatted_robots = [
        {
            **robot,
            'last_updated': datetime.utcfromtimestamp(robot['last_updated']).strftime('%Y-%m-%d %H:%M:%S')
        }
        for robot in robots
    ]
    return jsonify(formatted_robots)

# REST API for updating the status of the robot
@app.route("/robots/<robot_id>/status", methods=["POST"])
def update_robot_status(robot_id):
    data = request.json
    for robot in robots:
        if robot['robot_id'] == robot_id:
            robot['online'] = data.get('online', robot['online'])
            return jsonify(success=True, robot=robot)
    return jsonify(success=False, error="Robot not found"), 404

# Launch thread for robot updates
thread = Thread(target=update_robots)
thread.daemon = True
thread.start()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
