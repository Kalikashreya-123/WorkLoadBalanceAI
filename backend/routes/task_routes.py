from flask import Blueprint, jsonify

from database import get_database_connection


task_bp = Blueprint("task", __name__)


# ============================================================
# GET TASKS
# ============================================================

@task_bp.route("/tasks")
def get_tasks():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("""

            SELECT

                task_id,
                project_id,
                task_name,
                task_description,
                required_skill_id,
                priority,
                estimated_hours,
                deadline,
                task_status

            FROM Task

            ORDER BY task_id DESC

        """)

        tasks = cursor.fetchall()

        return jsonify({

            "total_tasks":
                len(tasks),

            "tasks":
                tasks

        })

    finally:

        cursor.close()
        connection.close()