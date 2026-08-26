from flask import Blueprint, jsonify, request

from database import get_database_connection
from services.assignment_service import assign_task_to_employee


assignment_bp = Blueprint(
    "assignment",
    __name__
)


# ============================================================
# MANAGER CONFIRMS AI RECOMMENDATION
# ============================================================

@assignment_bp.route("/confirm-assignment", methods=["POST"])
def confirm_assignment():

    data = request.json or {}

    recommendation_id = data.get(
        "recommendation_id"
    )

    if not recommendation_id:

        return jsonify({

            "success": False,

            "message":
                "Recommendation ID is required"

        }), 400


    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)


    try:

        # ----------------------------------------------------
        # GET RECOMMENDATION
        # ----------------------------------------------------

        cursor.execute("""

            SELECT

                recommendation_id,
                task_id,
                recommended_employee_id

            FROM Recommendation_Log

            WHERE recommendation_id = %s

        """,
        (recommendation_id,))


        recommendation = cursor.fetchone()


        if not recommendation:

            return jsonify({

                "success": False,

                "message":
                    "Recommendation not found"

            }), 404


        task_id = recommendation[
            "task_id"
        ]


        employee_id = recommendation[
            "recommended_employee_id"
        ]


        # ----------------------------------------------------
        # PERFORM ASSIGNMENT
        # ----------------------------------------------------

        result = assign_task_to_employee(

            connection,

            cursor,

            task_id,

            employee_id

        )


        if not result["success"]:

            connection.rollback()

            return jsonify(result), 400


        # ----------------------------------------------------
        # COMMIT DATABASE CHANGES
        # ----------------------------------------------------

        connection.commit()


        return jsonify(result)


    except Exception as error:

        connection.rollback()

        print(
            "Confirm assignment error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to confirm assignment",

            "error":
                str(error)

        }), 500


    finally:

        cursor.close()
        connection.close()


# ============================================================
# MANAGER CHOOSES ANOTHER EMPLOYEE
# ============================================================

@assignment_bp.route(
    "/assign-other-employee",
    methods=["POST"]
)
def assign_other_employee():

    data = request.json or {}


    task_id = data.get("task_id")

    employee_id = data.get("employee_id")


    if not task_id or not employee_id:

        return jsonify({

            "success": False,

            "message":
                "Task ID and employee ID are required"

        }), 400


    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)


    try:

        # ----------------------------------------------------
        # ASSIGN SELECTED EMPLOYEE
        # ----------------------------------------------------

        result = assign_task_to_employee(

            connection,

            cursor,

            task_id,

            employee_id

        )


        if not result["success"]:

            connection.rollback()

            return jsonify(result), 400


        # ----------------------------------------------------
        # COMMIT DATABASE CHANGES
        # ----------------------------------------------------

        connection.commit()


        return jsonify(result)


    except Exception as error:

        connection.rollback()

        print(
            "Assign other employee error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to assign selected employee",

            "error":
                str(error)

        }), 500


    finally:

        cursor.close()
        connection.close()