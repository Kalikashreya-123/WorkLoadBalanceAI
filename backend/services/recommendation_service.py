from database import get_database_connection


def generate_recommendation(task_id, exclude_employee_id=None):

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # ----------------------------------------------------
        # GET TASK
        # ----------------------------------------------------

        cursor.execute("""

            SELECT

                task_id,
                task_name,
                required_skill_id,
                estimated_hours,
                task_status

            FROM Task

            WHERE task_id = %s

        """, (task_id,))

        task = cursor.fetchone()

        if not task:

            return {
                "success": False,
                "message": "Task not found",
                "status_code": 404
            }


        # ----------------------------------------------------
        # DO NOT RECOMMEND FOR ALREADY ASSIGNED TASK
        # ----------------------------------------------------

        if task["task_status"] != "Pending":

            return {
                "success": False,
                "message": "This task is already assigned",
                "status_code": 400
            }


        # ----------------------------------------------------
        # FIND SUITABLE EMPLOYEE
        # ----------------------------------------------------

        query = """

            SELECT

                Employee.employee_id,
                Employee.full_name,
                Employee.department,
                Employee.experience_years,
                Employee.working_hours_per_day,
                Employee.availability_status,

                Workload_Record.workload_percentage,
                Workload_Record.available_hours

            FROM Task

            JOIN Employee_Skill

                ON Task.required_skill_id =
                   Employee_Skill.skill_id

            JOIN Employee

                ON Employee_Skill.employee_id =
                   Employee.employee_id

            JOIN Workload_Record

                ON Employee.employee_id =
                   Workload_Record.employee_id

            WHERE Task.task_id = %s

            AND Employee.availability_status = 'Available'

          AND Workload_Record.available_hours > 0
        """

        params = [task_id]


        # ----------------------------------------------------
        # EXCLUDE CURRENT EMPLOYEE
        # ----------------------------------------------------

        if exclude_employee_id:

            query += """

                AND Employee.employee_id != %s

            """

            params.append(exclude_employee_id)


        # ----------------------------------------------------
        # AI SELECTION LOGIC
        # ----------------------------------------------------

        query += """

            ORDER BY

                Workload_Record.workload_percentage ASC,

                Employee.experience_years DESC

            LIMIT 1

        """


        cursor.execute(
            query,
            tuple(params)
        )


        recommendation = cursor.fetchone()


        if not recommendation:

            return {
                "success": False,
                "message": "No other suitable employee found",
                "status_code": 404
            }


        # ----------------------------------------------------
        # RECOMMENDATION REASON
        # ----------------------------------------------------

        reason = (
            "Best skill match with lowest workload "
            "and sufficient available hours"
        )


        # ----------------------------------------------------
        # SAVE RECOMMENDATION
        # ----------------------------------------------------

        cursor.execute("""

            INSERT INTO Recommendation_Log
            (
                task_id,
                recommended_employee_id,
                reason
            )

            VALUES
            (
                %s,
                %s,
                %s
            )

        """,
        (
            task_id,

            recommendation["employee_id"],

            reason
        ))


        recommendation_id = cursor.lastrowid


        connection.commit()


        # ----------------------------------------------------
        # RETURN RECOMMENDATION
        # ----------------------------------------------------

        return {

            "success": True,

            "message":
                "AI recommendation generated",

            "recommendation_id":
                recommendation_id,

            "task_id":
                task_id,

            "recommended_employee": {

                "employee_id":
                    recommendation["employee_id"],

                "name":
                    recommendation["full_name"],

                "department":
                    recommendation["department"],

                "experience_years":
                    recommendation["experience_years"],

                "working_hours_per_day":
                    recommendation["working_hours_per_day"],

                "availability_status":
                    recommendation["availability_status"],

                "current_workload":
                    float(
                        recommendation["workload_percentage"]
                        or 0
                    ),

                "available_hours":
                    recommendation["available_hours"]

            },

            "reason":
                reason

        }


    except Exception as error:

        connection.rollback()

        print(
            "Recommendation error:",
            error
        )

        return {

            "success": False,

            "message":
                "Unable to generate AI recommendation",

            "error":
                str(error),

            "status_code": 500

        }


    finally:

        cursor.close()
        connection.close()