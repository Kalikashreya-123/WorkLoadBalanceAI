from flask import Blueprint, jsonify

from database import get_database_connection


employee_bp = Blueprint("employee", __name__)


# ============================================================
# GET ALL EMPLOYEES
# ============================================================

@employee_bp.route("/employees")
def get_employees():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("""

            SELECT

                employee_id,
                full_name,
                email,
                role,
                department,
                experience_years,
                working_hours_per_day,
                availability_status

            FROM Employee

        """)

        employees = cursor.fetchall()

        return jsonify({

            "total_employees":
                len(employees),

            "employees":
                employees

        })

    finally:

        cursor.close()
        connection.close()


# ============================================================
# GET EMPLOYEE SKILLS
# ============================================================

@employee_bp.route("/employee-skills")
def get_employee_skills():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("""

            SELECT

                Employee.employee_id,

                Employee.full_name
                    AS employee_name,

                Skill.skill_name

            FROM Employee

            JOIN Employee_Skill

                ON Employee.employee_id =
                   Employee_Skill.employee_id

            JOIN Skill

                ON Employee_Skill.skill_id =
                   Skill.skill_id

        """)

        skills = cursor.fetchall()

        return jsonify({

            "employee_skills":
                skills

        })

    finally:

        cursor.close()
        connection.close()