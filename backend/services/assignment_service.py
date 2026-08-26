def assign_task_to_employee(
    connection,
    cursor,
    task_id,
    employee_id
):

    # --------------------------------------------------------
    # GET TASK
    # --------------------------------------------------------

    cursor.execute("""

        SELECT

            task_id,
            task_name,
            estimated_hours,
            task_status

        FROM Task

        WHERE task_id = %s

        FOR UPDATE

    """, (task_id,))

    task = cursor.fetchone()

    if not task:

        return {
            "success": False,
            "message": "Task not found"
        }

    task_hours = int(
        task["estimated_hours"] or 0
    )

    # --------------------------------------------------------
    # CHECK TASK STATUS
    # --------------------------------------------------------

    if task["task_status"] != "Pending":

        return {
            "success": False,
            "message": "This task has already been assigned"
        }

    # --------------------------------------------------------
    # GET EMPLOYEE
    # --------------------------------------------------------

    cursor.execute("""

        SELECT

            employee_id,
            full_name,
            availability_status

        FROM Employee

        WHERE employee_id = %s

        FOR UPDATE

    """, (employee_id,))

    employee = cursor.fetchone()

    if not employee:

        return {
            "success": False,
            "message": "Employee not found"
        }

    # --------------------------------------------------------
    # CHECK EMPLOYEE AVAILABILITY
    # --------------------------------------------------------

    if employee["availability_status"] != "Available":

        return {
            "success": False,
            "message": "Employee is not currently available"
        }

    # --------------------------------------------------------
    # GET CURRENT WORKLOAD
    # --------------------------------------------------------

    cursor.execute("""

        SELECT

            workload_percentage,
            available_hours

        FROM Workload_Record

        WHERE employee_id = %s

        FOR UPDATE

    """, (employee_id,))

    workload = cursor.fetchone()

    if not workload:

        return {
            "success": False,
            "message": "Workload record not found for employee"
        }

    current_workload = float(
        workload["workload_percentage"] or 0
    )

    current_available_hours = int(
        workload["available_hours"] or 0
    )

    # --------------------------------------------------------
    # CHECK AVAILABLE HOURS
    # --------------------------------------------------------

    if current_available_hours <= 0:

        return {
            "success": False,
            "message":
                "Employee does not have enough available hours"
        }

    # --------------------------------------------------------
    # PREVENT DUPLICATE ACTIVE ASSIGNMENT
    # --------------------------------------------------------

    cursor.execute("""

        SELECT

            assignment_id

        FROM Task_Assignment

        WHERE task_id = %s

        AND assignment_status = 'Assigned'

        LIMIT 1

    """, (task_id,))

    existing_assignment = cursor.fetchone()

    if existing_assignment:

        return {
            "success": False,
            "message": "This task has already been assigned"
        }

    # --------------------------------------------------------
    # CALCULATE NEW WORKLOAD
    # --------------------------------------------------------

    workload_increase = (
        task_hours / 40
    ) * 100

    new_workload = (
        current_workload +
        workload_increase
    )

    new_available_hours = max(
        0,
        current_available_hours -
        task_hours
    )

    # --------------------------------------------------------
    # INSERT TASK ASSIGNMENT
    # --------------------------------------------------------

    cursor.execute("""

        INSERT INTO Task_Assignment
        (
            task_id,
            employee_id,
            assigned_date,
            completion_date,
            assignment_status
        )

        VALUES
        (
            %s,
            %s,
            CURDATE(),
            NULL,
            'Assigned'
        )

    """,
    (
        task_id,
        employee_id
    ))

    assignment_id = cursor.lastrowid

    # --------------------------------------------------------
    # UPDATE TASK STATUS
    # --------------------------------------------------------

    cursor.execute("""

        UPDATE Task

        SET task_status = 'Assigned'

        WHERE task_id = %s

    """, (task_id,))

    # --------------------------------------------------------
    # UPDATE EMPLOYEE WORKLOAD
    # --------------------------------------------------------

    cursor.execute("""

        UPDATE Workload_Record

        SET

            workload_percentage = %s,

            available_hours = %s,

            calculated_date = CURDATE()

        WHERE employee_id = %s

    """,
    (
        round(new_workload, 2),

        new_available_hours,

        employee_id
    ))

    # --------------------------------------------------------
    # RETURN UPDATED INFORMATION
    # --------------------------------------------------------

    return {

        "success": True,

        "message":
            "Task assignment confirmed",

        "assignment_id":
            assignment_id,

        "task_id":
            task_id,

        "employee_id":
            employee_id,

        "employee_name":
            employee["full_name"],

        "task_hours":
            task_hours,

        "updated_workload":
            round(new_workload, 2),

        "updated_available_hours":
            new_available_hours

    }
    