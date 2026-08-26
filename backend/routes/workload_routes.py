from flask import Blueprint, jsonify

from database import get_database_connection


workload_bp = Blueprint("workload", __name__)


# ============================================================
# GET WORKLOAD DETAILS
# ============================================================

@workload_bp.route("/workload")
def get_workload():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("""

            SELECT

                Employee.employee_id,

                Employee.full_name,

                Workload_Record.workload_percentage,

                Workload_Record.available_hours,

                Workload_Record.calculated_date

            FROM Workload_Record

            JOIN Employee

                ON Employee.employee_id =
                   Workload_Record.employee_id

            ORDER BY Employee.employee_id

        """)

        workload = cursor.fetchall()

        return jsonify({

            "workload_details":
                workload

        })

    finally:

        cursor.close()
        connection.close()