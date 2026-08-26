from flask import Blueprint, jsonify

from database import get_database_connection


recognition_bp = Blueprint("recognition", __name__)


# ============================================================
# GET RECOGNITION POINTS
# ============================================================

@recognition_bp.route("/recognition")
def get_recognition():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("""

            SELECT

                Employee.full_name,

                Recognition.points,

                Recognition.reason,

                Recognition.awarded_date

            FROM Recognition

            JOIN Employee

                ON Employee.employee_id =
                   Recognition.employee_id

            ORDER BY Recognition.awarded_date DESC

        """)

        recognition = cursor.fetchall()

        return jsonify({

            "recognition":
                recognition

        })

    finally:

        cursor.close()
        connection.close()