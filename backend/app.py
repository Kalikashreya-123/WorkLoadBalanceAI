from flask import Flask, jsonify
from flask_cors import CORS

from database import get_database_connection
from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp
from routes.task_routes import task_bp
from routes.workload_routes import workload_bp
from routes.recognition_routes import recognition_bp
from routes.recommendation_routes import recommendation_bp
from routes.assignment_routes import assignment_bp
from routes.admin_routes import admin_bp

# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)

CORS(app)

app.json.sort_keys = False
app.register_blueprint(auth_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(task_bp)
app.register_blueprint(workload_bp)
app.register_blueprint(recognition_bp)
app.register_blueprint(recommendation_bp)
app.register_blueprint(assignment_bp)
app.register_blueprint(admin_bp)

# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():

    return jsonify({

        "message":
            "WorkBalance AI Backend is Running!"

    })


# ============================================================
# TEST DATABASE CONNECTION
# ============================================================

@app.route("/test-db")
def test_database():

    connection = get_database_connection()

    try:

        if connection.is_connected():

            return jsonify({

                "message":
                    "Database Connected Successfully!"

            })


        return jsonify({

            "message":
                "Database Connection Failed"

        })

    finally:

        connection.close()

# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":

    app.run(debug=True)