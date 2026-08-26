// ============================================================
// ADMIN DASHBOARD
// ============================================================

// ============================================================
// GLOBAL DATA
// ============================================================

let adminEmployees = [];

let adminWorkload = [];

let adminTasks = [];

let adminManagers = [];

let adminSummary = {};
// ============================================================
// NAVIGATION
// ============================================================

function showAdminSection(sectionId, button) {

    document
        .querySelectorAll(".admin-section")
        .forEach(section => {

            section.classList.add("hidden");

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.remove("hidden");

    }


    document
        .querySelectorAll(".admin-nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    if (window.lucide) {

        lucide.createIcons();

    }

}
//-------------------------------------------------
// ADMIN DASHBOARD
//---------------------------------------------

async function loadAdminDashboard() {

    try {

        console.log(
            "Loading admin dashboard..."
        );


        const response =
            await fetch(
                `${API_URL}/admin/overview`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "Unable to load admin overview:",
                data
            );

            return;

        }


        // ====================================================
        // SAVE ADMIN OVERVIEW DATA
        // ====================================================

        adminSummary =
            data.summary || {};


        adminEmployees =
            data.employee_workload || [];


        adminTasks =
            data.task_assignments || [];


        adminManagers =
            data.manager_workload || [];


adminWorkload =
    data.employee_workload || [];

        console.log(
            "Admin summary:",
            adminSummary
        );


        console.log(
            "Admin employees:",
            adminEmployees
        );


        console.log(
            "Admin task assignments:",
            adminTasks
        );


        console.log(
            "Admin managers:",
            adminManagers
        );


        // ====================================================
        // UPDATE ADMIN DASHBOARD
        // ====================================================

        renderAdminEmployees();

        renderAdminWorkload();

        renderAdminTasks();

        calculateAdminStatistics();

        loadManagerInformation();


        console.log(
            "Admin dashboard loaded successfully."
        );


    } catch (error) {

        console.error(
            "Admin dashboard loading error:",
            error
        );

    }

}

// ============================================================
// LOAD ALL ADMIN DATA
// ============================================================

async function loadAdminData() {

    try {

        console.log(
            "Loading admin overview..."
        );


        const response =
            await fetch(
                `${API_URL}/admin/overview`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "Unable to load admin overview.",
                data
            );

            return;

        }


        // ====================================================
        // SAVE ADMIN DATA
        // ====================================================

       adminEmployees =
    data.employee_workload || [];


adminWorkload =
    data.employee_workload || [];


adminTasks =
    data.task_assignments || [];


adminManagers =
    data.manager_workload || [];
        // ====================================================
        // RENDER ADMIN DATA
        // ====================================================

        renderAdminEmployees();

        renderAdminWorkload();

        renderAdminTasks();


        // ====================================================
        // UPDATE STATISTICS
        // ====================================================

        calculateAdminStatistics();


        // ====================================================
        // UPDATE MANAGER INFORMATION
        // ====================================================

        loadManagerInformation();


        console.log(
            "Admin overview loaded successfully:",
            data
        );

    } catch (error) {

        console.error(
            "Admin overview error:",
            error
        );

    }

}

// ============================================================
// RENDER EMPLOYEE TABLE
// ============================================================

function renderAdminEmployees() {

    const table =
        document.getElementById(
            "adminEmployeesTable"
        );


    if (!table) {

        return;

    }


    if (
        adminEmployees.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    No employees found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        adminEmployees.map(employee => {

            const workload =
                adminWorkload.find(
                    item =>
                        Number(item.employee_id) ===
                        Number(employee.employee_id)
                );


            const workloadValue =
                workload
                    ? Number(
                        workload.workload_percentage || 0
                    )
                    : 0;


            const availableHours =
                workload
                    ? Number(
                        workload.available_hours || 0
                    )
                    : 0;


            const workloadClass =
                getWorkloadClass(
                    workloadValue
                );


            const statusClass =
                employee.availability_status ===
                "Available"
                    ? "available"
                    : "busy";


            const initials =
                (employee.full_name || "?")
                    .charAt(0)
                    .toUpperCase();


            return `

                <tr>

                    <td>

                        <div class="admin-employee-cell">

                            <div class="admin-employee-avatar">

                                ${initials}

                            </div>

                            <strong>

                                ${employee.full_name || "Unknown"}

                            </strong>

                        </div>

                    </td>


                    <td>

                        ${employee.department || "-"}

                    </td>


                    <td>

                        ${employee.working_hours_per_day || "-"} hrs

                    </td>


                    <td>

                        <span class="admin-workload ${workloadClass}">

                            ${workloadValue}%

                        </span>

                    </td>


                    <td>

                        ${availableHours} hrs

                    </td>


                    <td>

                        <span class="admin-status ${statusClass}">

                            ${employee.availability_status || "Unknown"}

                        </span>

                    </td>

                </tr>

            `;

        }).join("");


}


// ============================================================
// RENDER OVERVIEW EMPLOYEES
// ============================================================
// ============================================================
// RENDER EMPLOYEE WORKLOAD MONITORING
// ============================================================

function renderAdminWorkload() {

    const table =
        document.getElementById(
            "adminOverviewEmployees"
        );


    if (!table) {

        console.error(
            "Employee workload table not found."
        );

        return;

    }


    // ========================================================
    // NO DATA
    // ========================================================

    if (
        !adminWorkload ||
        adminWorkload.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="4">

                    No employee workload data available.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================================
    // RENDER EMPLOYEES
    // ========================================================

    table.innerHTML =
        adminWorkload.map(
            employee => {

                const workloadValue =
                    Number(
                        employee.workload_percentage || 0
                    );


                const availableHours =
                    Number(
                        employee.available_hours || 0
                    );


                const status =
                    employee.availability_status ||
                    "Unknown";


                const workloadClass =
                    getWorkloadClass(
                        workloadValue
                    );


                const statusClass =
                    status === "Available"
                        ? "available"
                        : "busy";


                const name =
                    employee.full_name ||
                    "Unknown";


                const initials =
                    name
                        .charAt(0)
                        .toUpperCase();


                return `

                    <tr>

                        <td>

                            <div class="admin-employee-cell">

                                <div class="admin-employee-avatar">

                                    ${initials}

                                </div>

                                <strong>

                                    ${name}

                                </strong>

                            </div>

                        </td>


                        <td>

                            <span
                                class="admin-workload ${workloadClass}"
                            >

                                ${workloadValue.toFixed(2)}%

                            </span>

                        </td>


                        <td>

                            ${availableHours} hrs

                        </td>


                        <td>

                            <span
                                class="admin-status ${statusClass}"
                            >

                                ${status}

                            </span>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}

// ============================================================
// RENDER TASK ASSIGNMENTS
// ============================================================

function renderAdminTasks() {

    const table =
        document.getElementById(
            "adminTasksTable"
        );


    if (!table) {

        return;

    }


    if (
        adminTasks.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="4">

                    No task assignments found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        adminTasks.map(task => {

            const status =
                task.assignment_status ||
                "Unknown";


            const isAssigned =
                status === "Assigned";


            const statusClass =
                isAssigned
                    ? "assigned"
                    : "pending";


            const employeeName =
                task.full_name ||
                "Unassigned";


            return `

                <tr>

                    <td>

                        <strong>

                            ${task.task_name || "Unnamed Task"}

                        </strong>

                    </td>


                    <td>

                        ${task.estimated_hours || 0} hrs

                    </td>


                    <td>

                        <span class="admin-status ${statusClass}">

                            ${status}

                        </span>

                    </td>


                    <td>

                        ${
                            isAssigned
                                ? employeeName
                                : "Waiting for employee"
                        }

                    </td>

                </tr>

            `;

        }).join("");

}


// ============================================================
// WORKLOAD CLASS
// ============================================================

function getWorkloadClass(workload) {

    if (workload < 50) {

        return "low";

    }


    if (workload < 80) {

        return "medium";

    }


    return "high";

}

// ============================================================
// CALCULATE ADMIN STATISTICS
// ============================================================

function calculateAdminStatistics() {

    // ========================================================
    // USE SUMMARY FROM ADMIN BACKEND
    // ========================================================

    const totalEmployees =
        Number(
            adminSummary.total_employees || 0
        );


    const totalTasks =
        Number(
            adminSummary.total_tasks || 0
        );


    const assignedTasks =
        Number(
            adminSummary.assigned_tasks || 0
        );


    const pendingTasks =
        Number(
            adminSummary.pending_tasks || 0
        );


    const averageWorkload =
        Number(
            adminSummary.average_workload || 0
        );


    // ========================================================
    // EMPLOYEE AVAILABILITY
    // ========================================================

    const availableEmployees =
        adminEmployees.filter(
            employee =>
                employee.availability_status ===
                "Available"
        ).length;


    const busyEmployees =
        adminEmployees.filter(
            employee =>
                employee.availability_status !==
                "Available"
        ).length;


    // ========================================================
    // HIGHEST WORKLOAD
    // ========================================================

    const workloads =
        adminEmployees.map(
            employee =>
                Number(
                    employee.workload_percentage || 0
                )
        );


    const highestWorkload =
        workloads.length
            ? Math.max(...workloads)
            : 0;


    // ========================================================
    // UPDATE MAIN STAT CARDS
    // ========================================================

    setText(
        "totalEmployees",
        totalEmployees
    );


    setText(
        "totalTasks",
        totalTasks
    );


    setText(
        "assignedTasks",
        assignedTasks
    );


    setText(
        "pendingTasks",
        pendingTasks
    );


    setText(
        "averageWorkload",
        Math.round(averageWorkload)
    );


    // ========================================================
    // SYSTEM STATUS
    // ========================================================

    setText(
        "availableEmployees",
        availableEmployees
    );


    setText(
        "busyEmployees",
        busyEmployees
    );


    setText(
        "highestWorkload",
        `${Math.round(highestWorkload)}%`
    );


    setText(
        "systemTaskCount",
        totalTasks
    );


    // ========================================================
    // TASK SUMMARY
    // ========================================================

    setText(
        "overviewAssigned",
        assignedTasks
    );


    setText(
        "overviewPending",
        pendingTasks
    );


    setText(
        "overviewTotalTasks",
        totalTasks
    );


    console.log(
        "Admin statistics updated:",
        {
            totalEmployees,
            totalTasks,
            assignedTasks,
            pendingTasks,
            averageWorkload,
            availableEmployees,
            busyEmployees,
            highestWorkload
        }
    );

}

// ============================================================
// MANAGER INFORMATION
// ============================================================

function loadManagerInformation() {

    // ========================================================
    // GET ACTUAL MANAGER FROM ADMIN API
    // ========================================================

    const manager =
        adminManagers.length > 0
            ? adminManagers[0]
            : null;


    if (!manager) {

        setText(
            "adminManagerName",
            "No Manager"
        );

        setText(
            "managerTeamSize",
            adminEmployees.length
        );

        setText(
            "managerWorkload",
            "0"
        );

        setText(
            "managerAssignedTasks",
            adminSummary.assigned_tasks || 0
        );

        return;
    }


    // ========================================================
    // MANAGER NAME
    // ========================================================

    const name =
        manager.full_name ||
        "Manager";


    setText(
        "adminManagerName",
        name
    );


    // ========================================================
    // MANAGER AVATAR
    // ========================================================

    const managerAvatar =
        document.getElementById(
            "adminAvatar"
        );


    if (managerAvatar) {

        managerAvatar.textContent =
            name
                .split(" ")
                .map(
                    part =>
                        part.charAt(0)
                )
                .join("")
                .substring(0, 2)
                .toUpperCase();

    }

setText(
    "adminProfileName",
    "Kalika Shreya"
);


    // ========================================================
    // MANAGER TEAM SIZE
    // ========================================================

    setText(
        "managerTeamSize",
        adminSummary.total_employees || 0
    );


    // ========================================================
    // MANAGER WORKLOAD
    // ========================================================

    setText(
        "managerWorkload",
        Math.round(
            Number(
                manager.workload_percentage || 0
            )
        )
    );


    // ========================================================
    // ASSIGNED TASKS
    // ========================================================

    setText(
        "managerAssignedTasks",
        adminSummary.assigned_tasks || 0
    );

}

// ============================================================
// SET TEXT HELPER
// ============================================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ============================================================
// REFRESH
// ============================================================

async function refreshAdminDashboard() {

    const button =
        document.querySelector(
            ".admin-refresh-button"
        );


    if (button) {

        button.disabled =
            true;

    }


    await loadAdminDashboard();


    if (button) {

        button.disabled =
            false;

    }


    if (window.lucide) {

        lucide.createIcons();

    }

}


// ============================================================
// LOGOUT
// ============================================================

function adminLogout() {

    localStorage.removeItem(
        "workloadUser"
    );


    window.location.href =
        "../login/login.html";

}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Admin dashboard initialized."
        );


        const today =
            document.getElementById(
                "adminToday"
            );


        if (today) {

            today.textContent =
                new Date().toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        await loadAdminDashboard();


        if (window.lucide) {

            lucide.createIcons();

        }

    }
);