// ============================================================
// MANAGER - LOAD EMPLOYEES
// ============================================================

async function loadManagerEmployees() {

    const container =
        document.getElementById(
            "managerEmployeesTable"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <tr>
            <td colspan="6">
                Loading employees...
            </td>
        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/employees`
            );


        const data =
            await response.json();


        if (
            !data.employees ||
            data.employees.length === 0
        ) {

            container.innerHTML = `

                <tr>
                    <td colspan="6">
                        No employees found.
                    </td>
                </tr>

            `;

            return;
        }


        let html = "";


        data.employees.forEach(employee => {

            html += `

                <tr>

                    <td>

                        <div class="employee-cell">

                            <div class="employee-table-avatar">

                                ${
                                    employee.full_name
                                        ? employee.full_name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "?"
                                }

                            </div>

                            <div>

                                <strong>
                                    ${employee.full_name || "-"}
                                </strong>

                                <span>
                                    ${employee.email || "-"}
                                </span>

                            </div>

                        </div>

                    </td>

                    <td>
                        ${employee.department || "-"}
                    </td>

                    <td>
                        ${employee.role || "-"}
                    </td>

                    <td>
                        ${employee.working_hours_per_day || 8}
                        hrs/day
                    </td>

                    <td>
                        ${employee.availability_status || "-"}
                    </td>

                    <td>
                        ${employee.experience_years || 0}
                        years
                    </td>

                </tr>

            `;

        });


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            "Manager employees error:",
            error
        );


        container.innerHTML = `

            <tr>
                <td colspan="6">
                    Unable to load employees.
                </td>
            </tr>

        `;
    }
}


// ============================================================
// MANAGER - LOAD TASKS
// ============================================================

async function loadManagerTasks() {

    const container =
        document.getElementById(
            "managerTasksContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "Loading tasks...";


    try {

        const response =
            await fetch(
                `${API_URL}/tasks`
            );


        const data =
            await response.json();


        if (
            !data.tasks ||
            data.tasks.length === 0
        ) {

            container.innerHTML =
                "<p>No tasks found.</p>";

            return;
        }


        let html = `

            <table class="manager-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Task</th>
                        <th>Priority</th>
                        <th>Hours</th>
                        <th>Deadline</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

        `;


        data.tasks.forEach(task => {

            html += `

                <tr>

                    <td>
                        ${task.task_id}
                    </td>

                    <td>
                        ${task.task_name || "-"}
                    </td>

                    <td>
                        ${task.priority || "-"}
                    </td>

                    <td>
                        ${task.estimated_hours || "-"}
                    </td>

                    <td>
                        ${task.deadline || "-"}
                    </td>

                    <td>
                        ${task.task_status || "-"}
                    </td>

                </tr>

            `;

        });


        html += `

                </tbody>

            </table>

        `;


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            "Manager tasks error:",
            error
        );


        container.innerHTML =
            "<p>Unable to load tasks.</p>";
    }
}


// ============================================================
// MANAGER DASHBOARD NAVIGATION
// ============================================================

function managerShowSection(
    sectionId,
    button
) {
    console.log("Manager section clicked:", sectionId);

    const sections =
        document.querySelectorAll(
            ".manager-section"
        );


    sections.forEach(section => {

        section.classList.add(
            "hidden"
        );

    });


    const selectedSection =
        document.getElementById(
            sectionId
        );


    if (selectedSection) {

        selectedSection.classList.remove(
            "hidden"
        );
    }


    const buttons =
        document.querySelectorAll(
            ".manager-nav-item"
        );


    buttons.forEach(btn => {

        btn.classList.remove(
            "active"
        );

    });


    if (button) {

        button.classList.add(
            "active"
        );
    }


    if (
        sectionId ===
        "managerEmployees"
    ) {

        loadManagerEmployees();
    }


    if (
        sectionId ===
        "managerTasks"
    ) {

        loadManagerTasks();
    }
}
if (
    sectionId ===
    "managerTasks"
) {

    loadManagerTasks();
}

// ============================================================
// MANAGER LOGOUT
// ============================================================

function managerLogout() {

    localStorage.removeItem(
        "workloadUser"
    );


    window.location.href = "../login/login.html";
}
// ============================================================
// AI RECOMMENDATION - LOAD RECOMMENDATION
// ============================================================

async function loadManagerAIRecommendation(showAlert = true) {

    try {

        // Get tasks from backend
        const response =
            await fetch(
                `${API_URL}/tasks`
            );

        const data =
            await response.json();


        if (
            !response.ok ||
            !data.tasks ||
            data.tasks.length === 0
        ) {

            if (showAlert) {
                alert(
                    "No tasks available for AI recommendation."
                );
            }

            return false;
        }


        // Select a pending task
        const task =
            data.tasks.find(
                item =>
                    item.task_status === "Pending"
            );


        if (!task) {

            if (showAlert) {
                alert(
                    "No pending task is available for AI recommendation."
                );
            }

            return false;
        }


        const taskId =
            task.task_id;


        console.log(
            "AI recommendation requested for task:",
            task
        );


        // Ask backend for best employee
        const recommendationResponse =
            await fetch(
                `${API_URL}/recommend/${taskId}`
            );


        const recommendationData =
            await recommendationResponse.json();


        if (
            !recommendationResponse.ok ||
            !recommendationData.success
        ) {

            if (showAlert) {
                alert(
                    recommendationData.message ||
                    "Unable to generate AI recommendation."
                );
            }

            return false;
        }


        // ----------------------------------------------------
        // SAVE RECOMMENDATION
        // ----------------------------------------------------

        window.currentRecommendedEmployee =
            recommendationData.recommended_employee;

        window.currentRecommendationTaskId =
            taskId;


        console.log(
            "AI recommended employee:",
            window.currentRecommendedEmployee
        );

        console.log(
            "AI recommendation task ID:",
            window.currentRecommendationTaskId
        );


        // ----------------------------------------------------
        // UPDATE MAIN DASHBOARD AI CARD
        // ----------------------------------------------------

        const employee =
            recommendationData.recommended_employee;


        const employeeName =
            document.getElementById(
                "aiRecommendedName"
            );

        if (employeeName) {

            employeeName.textContent =
                employee.name ||
                employee.full_name ||
                "Unknown";
        }


        const employeeDepartment =
            document.getElementById(
                "aiRecommendedDepartment"
            );

        if (employeeDepartment) {

            employeeDepartment.textContent =
                employee.department ||
                "-";
        }


        const employeeWorkload =
            document.getElementById(
                "aiCurrentWorkload"
            );

        if (employeeWorkload) {

            employeeWorkload.textContent =
                `${employee.current_workload ?? employee.workload_percentage ?? 0}%`;
        }


        const employeeAvatar =
            document.getElementById(
                "aiRecommendedAvatar"
            );

        if (employeeAvatar) {

            const name =
                employee.name ||
                employee.full_name ||
                "?";

            employeeAvatar.textContent =
                name.charAt(0).toUpperCase();
        }


        const recommendedTask =
            document.getElementById(
                "aiRecommendedTask"
            );

        if (recommendedTask) {

            recommendedTask.textContent =
                task.task_name ||
                "Recommended Task";
        }


        const requiredSkill =
            document.getElementById(
                "aiRequiredSkill"
            );

        if (requiredSkill) {

            requiredSkill.textContent =
                "Best skill match";
        }


        const reasonText =
            document.getElementById(
                "aiReasonText"
            );

        if (reasonText) {

            reasonText.textContent =
                recommendationData.reason ||
                "Best skill match with lowest workload and sufficient available hours.";
        }


        // ----------------------------------------------------
        // OPTIONAL POPUP
        // ----------------------------------------------------

        if (showAlert) {

            alert(
                `AI recommends ${employee.name || employee.full_name} for this task.`
            );
        }


        return true;


    } catch (error) {

        console.error(
            "AI recommendation error:",
            error
        );

        if (showAlert) {

            alert(
                "Unable to generate AI recommendation. Check that Flask is running."
            );
        }

        return false;
    }
}
//---------------------------------------------
// AI - RECOMMENDATION CONFIRM ASSIGMENT

async function confirmAIAssignment() {

    try {

        // ----------------------------------------------------
        // USE EXISTING RECOMMENDATION IF AVAILABLE
        // ----------------------------------------------------

        let recommendation =
            window.currentRecommendedEmployee;

        let taskId =
            window.currentRecommendationTaskId;


        // ----------------------------------------------------
        // IF NO RECOMMENDATION EXISTS, FIND ONE NOW
        // ----------------------------------------------------

        if (!recommendation || !taskId) {

            console.log(
                "No stored recommendation. Finding a valid recommendation now..."
            );


            const tasksResponse =
                await fetch(
                    `${API_URL}/tasks`
                );


            const tasksData =
                await tasksResponse.json();


            if (
                !tasksResponse.ok ||
                !tasksData.tasks
            ) {

                alert(
                    "Unable to load tasks for AI recommendation."
                );

                return;
            }


            const pendingTasks =
                tasksData.tasks.filter(
                    task =>
                        task.task_status === "Pending"
                );


            let foundRecommendation =
                false;


            for (const task of pendingTasks) {

                const recommendationResponse =
                    await fetch(
                        `${API_URL}/recommend/${task.task_id}`
                    );


                const recommendationData =
                    await recommendationResponse.json();


                if (
                    recommendationResponse.ok &&
                    recommendationData.success &&
                    recommendationData.recommended_employee
                ) {

                    taskId =
                        task.task_id;

                    recommendation =
                        recommendationData.recommended_employee;

                    foundRecommendation =
                        true;

                    console.log(
                        "Recommendation found:",
                        {
                            taskId: taskId,
                            employee: recommendation
                        }
                    );

                    break;
                }
            }


            if (!foundRecommendation) {

                alert(
                    "No pending task currently has a suitable AI recommendation."
                );

                return;
            }


            // Save it for the other AI button
            window.currentRecommendedEmployee =
                recommendation;

            window.currentRecommendationTaskId =
                taskId;
        }


        // ----------------------------------------------------
        // ASSIGN TASK
        // ----------------------------------------------------

        const response =
            await fetch(
                `${API_URL}/assign-other-employee`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        task_id:
                            Number(taskId),

                        employee_id:
                            Number(
                                recommendation.employee_id
                            )

                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Assignment failed."
            );

            return;
        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        alert(
            `Task successfully assigned to ${data.employee_name}!`
        );


        console.log(
            "Assignment saved to database:",
            data
        );


        // Clear stored recommendation
        window.currentRecommendedEmployee =
            null;

        window.currentRecommendationTaskId =
            null;


        // Refresh manager data
        await loadManagerTasks();
        await loadManagerEmployees();


        if (
            typeof loadManagerWorkload ===
            "function"
        ) {

            await loadManagerWorkload();
        }


    } catch (error) {

        console.error(
            "Confirm assignment error:",
            error
        );

        alert(
            "Unable to confirm assignment. Check that Flask is running."
        );
    }
}
// ============================================================
// AI RECOMMENDATION - CHOOSE ANOTHER EMPLOYEE
// ============================================================

async function chooseAnotherEmployee() {

    try {

        // ----------------------------------------------------
        // MAKE SURE A RECOMMENDATION EXISTS
        // ----------------------------------------------------

        if (
            !window.currentRecommendedEmployee ||
            !window.currentRecommendationTaskId
        ) {

            console.log(
                "No stored recommendation. Loading one now..."
            );

            const loaded =
                await loadManagerAIRecommendation(false);

            if (!loaded) {

                alert(
                    "No current AI recommendation found."
                );

                return;
            }
        }


        // ----------------------------------------------------
        // READ CURRENT RECOMMENDATION
        // ----------------------------------------------------

        const taskId =
            window.currentRecommendationTaskId;

        const currentEmployee =
            window.currentRecommendedEmployee;


        if (
            !taskId ||
            !currentEmployee
        ) {

            alert(
                "No current AI recommendation found."
            );

            return;
        }


        // ----------------------------------------------------
        // ASK BACKEND FOR ANOTHER EMPLOYEE
        // ----------------------------------------------------

        const response =
            await fetch(
                `${API_URL}/recommend/${taskId}?exclude_employee_id=${currentEmployee.employee_id}`
            );


        const data =
            await response.json();


      if (
    !response.ok ||
    !data.success
) {

    alert(
        "No other suitable employee is available for this task."
    );

    return;
}

        // ----------------------------------------------------
        // SAVE NEW RECOMMENDATION
        // ----------------------------------------------------

        window.currentRecommendedEmployee =
            data.recommended_employee;
            window.currentRecommendationTaskId =
    taskId;
 

        // ----------------------------------------------------
        // UPDATE MAIN DASHBOARD CARD
        // ----------------------------------------------------

        const employee =
            data.recommended_employee;


        const employeeName =
            document.getElementById(
                "aiRecommendedName"
            );

        if (employeeName) {

            employeeName.textContent =
                employee.name ||
                employee.full_name ||
                "Unknown";
        }


        const employeeDepartment =
            document.getElementById(
                "aiRecommendedDepartment"
            );

        if (employeeDepartment) {

            employeeDepartment.textContent =
                employee.department ||
                "-";
        }


        const employeeWorkload =
            document.getElementById(
                "aiCurrentWorkload"
            );

        if (employeeWorkload) {

            employeeWorkload.textContent =
                `${employee.current_workload ?? employee.workload_percentage ?? 0}%`;
        }


        const employeeAvatar =
            document.getElementById(
                "aiRecommendedAvatar"
            );

        if (employeeAvatar) {

            employeeAvatar.textContent =
                (
                    employee.name ||
                    employee.full_name ||
                    "?"
                )
                .charAt(0)
                .toUpperCase();
        }


        console.log(
            "New AI recommendation:",
            employee
        );


        alert(
            `AI recommends ${employee.name || employee.full_name} instead.`
        );


    } catch (error) {

        console.error(
            "Choose another employee error:",
            error
        );

        alert(
            "Unable to find another employee."
        );
    }
}

// ============================================================
// OPTIONAL: MANAGER WORKLOAD LOADING
// ============================================================
// This function is intentionally safe.
// If manager.html has a workload container,
// it will automatically populate it.
// If not, nothing happens.
// ============================================================

async function loadManagerWorkload() {

    const container =
        document.getElementById(
            "managerWorkloadContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "Loading workload...";


    try {

        const response =
            await fetch(
                `${API_URL}/workload`
            );


        const data =
            await response.json();


        const records =
            data.workload_details || [];


        if (records.length === 0) {

            container.innerHTML =
                "<p>No workload records found.</p>";

            return;
        }


        let html = `

            <table class="manager-table">

                <thead>

                    <tr>
                        <th>Employee</th>
                        <th>Workload</th>
                        <th>Available Hours</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>

        `;


        records.forEach(record => {

            const workload =
                Number(
                    record.workload_percentage
                ) || 0;


            let status =
                "Available";


            if (workload >= 90) {

                status =
                    "High";

            } else if (workload >= 70) {

                status =
                    "Moderate";
            }


            html += `

                <tr>

                    <td>
                        ${record.full_name || "-"}
                    </td>

                    <td>

                        <div class="workload-bar">

                            <div
                                class="workload-fill"
                                style="
                                    width:${Math.min(
                                        workload,
                                        100
                                    )}%
                                "
                            ></div>

                        </div>

                        ${workload.toFixed(1)}%

                        <small>
                            ${status}
                        </small>

                    </td>

                    <td>
                        ${record.available_hours ?? 0}
                    </td>

                    <td>
                        ${record.calculated_date || "-"}
                    </td>

                </tr>

            `;

        });


        html += `

                </tbody>

            </table>

        `;


        container.innerHTML =
            html;


    } catch (error) {

        console.error(
            "Manager workload error:",
            error
        );


        container.innerHTML =
            "<p>Unable to load workload.</p>";
    }
}


// ============================================================
// GLOBAL ASSIGNMENT REFRESH HELPER
// ============================================================
// This allows manager assignment to update the frontend
// immediately after Flask updates MySQL.
// ============================================================

async function refreshAllDashboardData() {

    try {

        // Employee dashboard
        if (
            typeof loadDashboard ===
            "function"
        ) {

            await loadDashboard();
        }


        // Manager employees
        if (
            typeof loadManagerEmployees ===
            "function"
        ) {

            await loadManagerEmployees();
        }


        // Manager tasks
        if (
            typeof loadManagerTasks ===
            "function"
        ) {

            await loadManagerTasks();
        }


        // Manager workload
        if (
            typeof loadManagerWorkload ===
            "function"
        ) {

            await loadManagerWorkload();
        }


        console.log(
            "All dashboard data refreshed."
        );


    } catch (error) {

        console.error(
            "Global dashboard refresh error:",
            error
        );
    }
}

// ============================================================
// LOAD AI RECOMMENDATION WHEN MANAGER DASHBOARD OPENS
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

    loadManagerAIRecommendation(false);

});