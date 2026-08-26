from flask import Blueprint, jsonify

from database import get_database_connection


admin_bp = Blueprint("admin", __name__)


# ============================================================
# ADMIN OVERVIEW
# ============================================================

@admin_bp.route("/admin/overview", methods=["GET"])
def admin_overview():

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # ----------------------------------------------------
        # TOTAL EMPLOYEES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS total_employees
            FROM Employee
            WHERE role = 'Employee'
        """)

        total_employees = cursor.fetchone()["total_employees"]


        # ----------------------------------------------------
        # TOTAL MANAGERS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS total_managers
            FROM Employee
            WHERE role = 'Manager'
        """)

        total_managers = cursor.fetchone()["total_managers"]


        # ----------------------------------------------------
        # TOTAL TASKS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS total_tasks
            FROM Task
        """)

        total_tasks = cursor.fetchone()["total_tasks"]


        # ----------------------------------------------------
        # PENDING TASKS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS pending_tasks
            FROM Task
            WHERE task_status = 'Pending'
        """)

        pending_tasks = cursor.fetchone()["pending_tasks"]


        # ----------------------------------------------------
        # ASSIGNED TASKS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS assigned_tasks
            FROM Task
            WHERE task_status = 'Assigned'
        """)

        assigned_tasks = cursor.fetchone()["assigned_tasks"]


        # ----------------------------------------------------
        # EMPLOYEE WORKLOAD
        # ----------------------------------------------------

        cursor.execute("""
            SELECT
                Employee.employee_id,
                Employee.full_name,
                Employee.department,
                Employee.working_hours_per_day,
                Employee.availability_status,
                Workload_Record.workload_percentage,
                Workload_Record.available_hours

            FROM Employee

            LEFT JOIN Workload_Record
                ON Employee.employee_id =
                   Workload_Record.employee_id

            WHERE Employee.role = 'Employee'

            ORDER BY
                Workload_Record.workload_percentage DESC
        """)

        employee_workload = cursor.fetchall()


        # ----------------------------------------------------
        # TASK ASSIGNMENTS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT

                Task_Assignment.assignment_id,

                Task.task_id,

                Task.task_name,

                Task.estimated_hours,

                Task_Assignment.employee_id,

                Employee.full_name,

                Task_Assignment.assigned_date,

                Task_Assignment.assignment_status

            FROM Task_Assignment

            JOIN Task
                ON Task.task_id =
                   Task_Assignment.task_id

            JOIN Employee
                ON Employee.employee_id =
                   Task_Assignment.employee_id

            ORDER BY
                Task_Assignment.assigned_date DESC
        """)

        task_assignments = cursor.fetchall()


        # ----------------------------------------------------
        # MANAGER WORKLOAD
        # ----------------------------------------------------

        cursor.execute("""
SELECT
    Employee.employee_id,
    Employee.full_name,
    Employee.department,
    Employee.working_hours_per_day,
    Employee.availability_status,
    Workload_Record.workload_percentage,
    Workload_Record.available_hours

            FROM Employee

            LEFT JOIN Workload_Record
                ON Employee.employee_id =
                   Workload_Record.employee_id

            WHERE Employee.role = 'Manager'

            ORDER BY
                Workload_Record.workload_percentage DESC
        """)

        manager_workload = cursor.fetchall()


        # ----------------------------------------------------
        # OVERALL WORKLOAD
        # ----------------------------------------------------

        cursor.execute("""
            SELECT
                ROUND(
                    AVG(workload_percentage),
                    2
                ) AS average_workload

            FROM Workload_Record

            WHERE employee_id IN
            (
                SELECT employee_id
                FROM Employee
                WHERE role = 'Employee'
            )
        """)

        workload_result = cursor.fetchone()

        average_workload = (
            workload_result["average_workload"]
            if workload_result["average_workload"] is not None
            else 0
        )


        # ----------------------------------------------------
        # RETURN ADMIN DATA
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "summary": {

                "total_employees":
                    total_employees,

                "total_managers":
                    total_managers,

                "total_tasks":
                    total_tasks,

                "pending_tasks":
                    pending_tasks,

                "assigned_tasks":
                    assigned_tasks,

                "average_workload":
                    average_workload

            },

            "employee_workload":
                employee_workload,

            "task_assignments":
                task_assignments,

            "manager_workload":
                manager_workload

        })


    except Exception as error:

        print(
            "Admin overview error:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to load admin overview"

        }), 500


    finally:

        cursor.close()
        connection.close()