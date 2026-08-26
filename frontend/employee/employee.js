// ============================================================
// SET LOGGED-IN USER
// ============================================================

function setupLoggedInUser(user) {

    if (!user) {
        return;
    }


    const loggedUser =
        document.getElementById("loggedUser");

    if (loggedUser) {
        loggedUser.textContent =
            user.full_name || "User";
    }


    const welcomeName =
        document.getElementById(
            "employeeWelcomeName"
        );

    if (welcomeName) {
        welcomeName.textContent =
            user.full_name || "User";
    }


    // --------------------------------------------------------
    // AVATAR
    // --------------------------------------------------------

    const avatar =
        document.getElementById("userAvatar");

    if (avatar && user.full_name) {

        const initials =
            user.full_name
                .split(" ")
                .map(name =>
                    name.charAt(0)
                )
                .join("")
                .substring(0, 2)
                .toUpperCase();

        avatar.textContent =
            initials;
    }


    // --------------------------------------------------------
    // PROFILE NAME
    // --------------------------------------------------------

    const profileName =
        document.getElementById(
            "profileName"
        );

    if (profileName) {

        profileName.textContent =
            user.full_name || "-";
    }


    // --------------------------------------------------------
    // PROFILE ROLE
    // --------------------------------------------------------

    const profileRole =
        document.getElementById(
            "profileRole"
        );

    if (profileRole) {

        profileRole.textContent =
            user.role || "-";
    }


    // --------------------------------------------------------
    // TODAY'S DATE
    // --------------------------------------------------------

    const todayDate =
        document.getElementById(
            "todayDate"
        );

    if (todayDate) {

        todayDate.textContent =
            new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
    }
}


// ============================================================
// LOGOUT - EMPLOYEE
// ============================================================

function logout() {

    // Remove saved login information
    localStorage.removeItem("workloadUser");

    // Go back to the login page
    window.location.href = "../login/login.html";
}


// ============================================================
// EMPLOYEE DASHBOARD NAVIGATION
// ============================================================

function showSection(sectionName) {
    console.log("showSection called:", sectionName);

    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );
        console.log("Selected section:", document.getElementById(sectionName));


    sections.forEach(section => {

        section.classList.add(
            "hidden"
        );

    });
     console.log("All sections hidden");

    const selectedSection =
        document.getElementById(
            sectionName
        );

if (selectedSection) {

    selectedSection.classList.remove("hidden");
    selectedSection.style.display = "block";

    document
        .querySelectorAll(".dashboard-section")
        .forEach(section => {

            if (section !== selectedSection) {
                section.style.display = "none";
            }

        });

    console.log(
        "Showing section:",
        sectionName
    );
}
    // --------------------------------------------------------
    // SIDEBAR ACTIVE BUTTON
    // --------------------------------------------------------

    const sidebarButtons =
        document.querySelectorAll(
            ".sidebar-btn"
        );


    sidebarButtons.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    if (
        typeof event !== "undefined" &&
        event &&
        event.currentTarget
    ) {

        event.currentTarget.classList.add(
            "active"
        );
    }


    // --------------------------------------------------------
    // LOAD SECTION DATA
    // --------------------------------------------------------

    if (sectionName === "tasks") {
        loadTasks();
    }


    if (sectionName === "workload") {
        loadWorkload();
    }


    if (sectionName === "recognition") {
        loadRecognition();
    }


    if (sectionName === "profile") {
        loadProfile();
    }
}


// ============================================================
// LOAD EMPLOYEE DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        const [
            employeesResponse,
            tasksResponse,
            workloadResponse,
            recognitionResponse
        ] = await Promise.all([

            fetch(
                `${API_URL}/employees`
            ),

            fetch(
                `${API_URL}/tasks`
            ),

            fetch(
                `${API_URL}/workload`
            ),

            fetch(
                `${API_URL}/recognition`
            )

        ]);


        const employees =
            await employeesResponse.json();

        const tasks =
            await tasksResponse.json();

        const workload =
            await workloadResponse.json();

        const recognition =
            await recognitionResponse.json();


        // --------------------------------------------------------
        // SAVE DASHBOARD DATA
        // --------------------------------------------------------

        window.dashboardData = {

            employees:
                employees.employees || [],

            tasks:
                tasks.tasks || [],

            workload:
                workload.workload_details || [],

            recognition:
                recognition.recognition || []

        };


        // --------------------------------------------------------
        // GET CURRENT USER
        // --------------------------------------------------------

        const savedUser =
            localStorage.getItem(
                "workloadUser"
            );


        if (!savedUser) {
            return;
        }


        const currentUser =
            JSON.parse(savedUser);


        // --------------------------------------------------------
        // FIND EMPLOYEE
        // --------------------------------------------------------

        const employee =
            window.dashboardData.employees.find(
                emp =>
                    Number(emp.employee_id) ===
                    Number(currentUser.employee_id)
            );


        if (employee) {

            updateEmployeeInformation(
                employee
            );
        }


        // --------------------------------------------------------
        // UPDATE WORKLOAD
        // --------------------------------------------------------

        updateEmployeeWorkload(
            currentUser,
            window.dashboardData.workload
        );


        // --------------------------------------------------------
        // UPDATE RECOGNITION
        // --------------------------------------------------------

        updateEmployeeRecognition(
            currentUser,
            window.dashboardData.recognition
        );


        // --------------------------------------------------------
        // UPDATE TASK COUNT
        // --------------------------------------------------------

        updateTaskInformation(
            window.dashboardData.tasks
        );


        // --------------------------------------------------------
        // DISPLAY RECENT TASKS
        // --------------------------------------------------------

        displayRecentTasks(
            window.dashboardData.tasks
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}


// ============================================================
// UPDATE EMPLOYEE INFORMATION
// ============================================================

function updateEmployeeInformation(employee) {

    if (!employee) {
        return;
    }


    const profileName =
        document.getElementById(
            "profileName"
        );

    if (profileName) {

        profileName.textContent =
            employee.full_name || "-";
    }


    const profileRole =
        document.getElementById(
            "profileRole"
        );

    if (profileRole) {

        profileRole.textContent =
            employee.role || "-";
    }


    const workingHours =
        document.getElementById(
            "workingHours"
        );

    if (workingHours) {

        workingHours.textContent =
            `${employee.working_hours_per_day ?? 8} hrs`;
    }


    const employeeStatus =
        document.getElementById(
            "employeeStatus"
        );

    if (employeeStatus) {

        employeeStatus.textContent =
            employee.availability_status ||
            "Available";
    }


    // --------------------------------------------------------
    // PROFILE DETAILS
    // --------------------------------------------------------

    const profileDetails =
        document.getElementById(
            "profileDetails"
        );


    if (profileDetails) {

        profileDetails.innerHTML = `

            <div class="workload-info-row">
                <span>Employee ID</span>
                <strong>
                    ${employee.employee_id}
                </strong>
            </div>

            <div class="workload-info-row">
                <span>Full Name</span>
                <strong>
                    ${employee.full_name}
                </strong>
            </div>

            <div class="workload-info-row">
                <span>Email</span>
                <strong>
                    ${employee.email}
                </strong>
            </div>

            <div class="workload-info-row">
                <span>Role</span>
                <strong>
                    ${employee.role}
                </strong>
            </div>

            <div class="workload-info-row">
                <span>Department</span>
                <strong>
                    ${employee.department || "-"}
                </strong>
            </div>

            <div class="workload-info-row">
                <span>Experience</span>
                <strong>
                    ${employee.experience_years ?? "-"} years
                </strong>
            </div>

            <div class="workload-info-row">
                <span>Working Hours</span>
                <strong>
                    ${employee.working_hours_per_day ?? 8}
                    hrs/day
                </strong>
            </div>

            <div class="workload-info-row">
                <span>Availability</span>
                <strong>
                    ${employee.availability_status || "-"}
                </strong>
            </div>

        `;
    }
}


// ============================================================
// UPDATE EMPLOYEE WORKLOAD
// ============================================================

function updateEmployeeWorkload(
    currentUser,
    workloadRecords
) {

    if (!currentUser || !workloadRecords) {
        return;
    }


    const record =
        workloadRecords.find(
            item =>
                Number(item.employee_id) ===
                Number(currentUser.employee_id)
        );


    if (!record) {

        console.log(
            "No workload record found for this employee."
        );

        return;
    }


    const workload =
        Number(
            record.workload_percentage
        ) || 0;


    const availableHours =
        Number(
            record.available_hours
        ) || 0;


    // --------------------------------------------------------
    // MAIN WORKLOAD
    // --------------------------------------------------------

    const employeeWorkload =
        document.getElementById(
            "employeeWorkload"
        );


    if (employeeWorkload) {

        employeeWorkload.textContent =
            workload.toFixed(1);
    }


    // --------------------------------------------------------
    // WORKLOAD BAR
    // --------------------------------------------------------

    const workloadBar =
        document.getElementById(
            "employeeWorkloadBar"
        );


    if (workloadBar) {

        workloadBar.style.width =
            `${Math.min(workload, 100)}%`;
    }


    // --------------------------------------------------------
    // AVAILABLE HOURS
    // --------------------------------------------------------

    const employeeAvailableHours =
        document.getElementById(
            "employeeAvailableHours"
        );


    if (employeeAvailableHours) {

        employeeAvailableHours.textContent =
            availableHours;
    }


    // --------------------------------------------------------
    // SMALL AVAILABLE HOURS
    // --------------------------------------------------------

    const availableHoursSmall =
        document.getElementById(
            "availableHoursSmall"
        );


    if (availableHoursSmall) {

        availableHoursSmall.textContent =
            `${availableHours} hrs`;
    }


    // --------------------------------------------------------
    // WORKLOAD CIRCLE
    // --------------------------------------------------------

    const circleValue =
        document.getElementById(
            "workloadCircleValue"
        );


    if (circleValue) {

        circleValue.textContent =
            `${workload.toFixed(0)}%`;
    }


    const circle =
        document.querySelector(
            ".workload-circle"
        );


    if (circle) {

        const degrees =
            Math.min(workload, 100) * 3.6;


        circle.style.background =
            `conic-gradient(
                #4A90E2 0deg,
                #4A90E2 ${degrees}deg,
                #E9EEF4 ${degrees}deg,
                #E9EEF4 360deg
            )`;
    }


    // --------------------------------------------------------
    // WORKLOAD STATUS
    // --------------------------------------------------------

    const employeeStatus =
        document.getElementById(
            "employeeStatus"
        );


    if (employeeStatus) {

        if (workload >= 90) {

            employeeStatus.textContent =
                "High workload";

            employeeStatus.style.color =
                "#EF4444";

        } else if (workload >= 70) {

            employeeStatus.textContent =
                "Moderate";

            employeeStatus.style.color =
                "#F59E0B";

        } else {

            employeeStatus.textContent =
                "Available";

            employeeStatus.style.color =
                "#16A34A";
        }
    }
}


// ============================================================
// UPDATE TASK INFORMATION
// ============================================================

function updateTaskInformation(tasks) {

    const taskCount =
        document.getElementById(
            "employeeTaskCount"
        );


    if (taskCount) {

        taskCount.textContent =
            tasks
                ? tasks.length
                : 0;
    }
}


// ============================================================
// DISPLAY RECENT TASKS
// ============================================================

function displayRecentTasks(tasks) {

    const container =
        document.getElementById(
            "employeeRecentTasks"
        );


    if (!container) {
        return;
    }


    if (!tasks || tasks.length === 0) {

        container.innerHTML = `

            <div class="empty-state">
                No tasks available right now.
            </div>

        `;

        return;
    }


    const recentTasks =
        tasks.slice(0, 5);


    let html = `

        <div class="recent-task-list">

    `;


    recentTasks.forEach(task => {

        html += `

            <div class="recent-task-row">

                <div>

                    <strong>
                        ${task.task_name ||
                            "Untitled Task"}
                    </strong>

                    <span>
                        ${task.task_description ||
                            ""}
                    </span>

                </div>

                <div>

                    <strong>
                        ${task.priority || "-"}
                    </strong>

                </div>

                <div>

                    <span>
                        ${task.task_status || "-"}
                    </span>

                </div>

            </div>

        `;

    });


    html += `

        </div>

    `;


    container.innerHTML =
        html;
}


// ============================================================
// UPDATE EMPLOYEE RECOGNITION
// ============================================================

function updateEmployeeRecognition(
    currentUser,
    recognitionRecords
) {

    if (!currentUser || !recognitionRecords) {
        return;
    }


    const myRecognition =
        recognitionRecords.filter(
            record =>
                record.full_name ===
                currentUser.full_name
        );


    const totalPoints =
        myRecognition.reduce(
            (total, record) =>
                total +
                Number(record.points || 0),
            0
        );


    const employeeRecognition =
        document.getElementById(
            "employeeRecognition"
        );


    if (employeeRecognition) {

        employeeRecognition.textContent =
            totalPoints;
    }


    const recognitionHeroPoints =
        document.getElementById(
            "recognitionHeroPoints"
        );


    if (recognitionHeroPoints) {

        recognitionHeroPoints.textContent =
            totalPoints;
    }
}


// ============================================================
// LOAD EMPLOYEE TASKS
// ============================================================

async function loadTasks() {

    const container =
        document.getElementById(
            "tasksContainer"
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

            <table class="data-table">

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
            "Employee tasks error:",
            error
        );


        container.innerHTML =
            "<p>Unable to load tasks.</p>";
    }
}


// ============================================================
// LOAD EMPLOYEE WORKLOAD
// ============================================================

async function loadWorkload() {

    const container =
        document.getElementById(
            "workloadContainer"
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


        if (
            !data.workload_details ||
            data.workload_details.length === 0
        ) {

            container.innerHTML =
                "<p>No workload records found.</p>";

            return;
        }


        const savedUser =
            localStorage.getItem(
                "workloadUser"
            );


        const currentUser =
            savedUser
                ? JSON.parse(savedUser)
                : null;


        let records =
            data.workload_details;


        // Employee sees only own workload
        if (
            currentUser &&
            currentUser.role === "Employee"
        ) {

            records =
                records.filter(
                    record =>
                        Number(
                            record.employee_id
                        ) ===
                        Number(
                            currentUser.employee_id
                        )
                );
        }


        let html = `

            <table class="data-table">

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
            "Employee workload error:",
            error
        );


        container.innerHTML =
            "<p>Unable to load workload.</p>";
    }
}


// ============================================================
// LOAD RECOGNITION
// ============================================================

async function loadRecognition() {

    const container =
        document.getElementById(
            "recognitionContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "Loading recognition...";


    try {

        const response =
            await fetch(
                `${API_URL}/recognition`
            );


        const data =
            await response.json();


        if (
            !data.recognition ||
            data.recognition.length === 0
        ) {

            container.innerHTML =
                "<p>No recognition records found.</p>";

            return;
        }


        const savedUser =
            localStorage.getItem(
                "workloadUser"
            );


        const currentUser =
            savedUser
                ? JSON.parse(savedUser)
                : null;


        let records =
            data.recognition;


        // Employee sees own recognition
        if (
            currentUser &&
            currentUser.role === "Employee"
        ) {

            records =
                records.filter(
                    record =>
                        record.full_name ===
                        currentUser.full_name
                );
        }


        if (records.length === 0) {

            container.innerHTML = `

                <div class="empty-state">
                    No recognition points awarded yet.
                </div>

            `;

            return;
        }


        let html = `

            <table class="data-table">

                <thead>

                    <tr>
                        <th>Employee</th>
                        <th>Points</th>
                        <th>Reason</th>
                        <th>Date</th>
                    </tr>

                </thead>

                <tbody>

        `;


        records.forEach(record => {

            html += `

                <tr>

                    <td>
                        ${record.full_name || "-"}
                    </td>

                    <td>
                        ${record.points || 0}
                    </td>

                    <td>
                        ${record.reason || "-"}
                    </td>

                    <td>
                        ${record.awarded_date || "-"}
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
            "Recognition error:",
            error
        );


        container.innerHTML =
            "<p>Unable to load recognition.</p>";
    }
}


// ============================================================
// LOAD PROFILE
// ============================================================

async function loadProfile() {

    const savedUser =
        localStorage.getItem(
            "workloadUser"
        );


    if (!savedUser) {
        return;
    }


    try {

        const currentUser =
            JSON.parse(savedUser);


        const response =
            await fetch(
                `${API_URL}/employees`
            );


        const data =
            await response.json();


        const employee =
            (data.employees || []).find(
                emp =>
                    Number(
                        emp.employee_id
                    ) ===
                    Number(
                        currentUser.employee_id
                    )
            );


        if (employee) {

            updateEmployeeInformation(
                employee
            );
        }


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );
    }
}
// ============================================================
// EMPLOYEE DASHBOARD INITIALIZATION
// ============================================================

window.addEventListener("DOMContentLoaded", async () => {

    console.log("Employee dashboard loaded.");

    const savedUser =
        localStorage.getItem("workloadUser");

    if (!savedUser) {

        console.log("No logged-in user found.");

        window.location.href =
            "../login/login.html";

        return;
    }

    try {

        const user =
            JSON.parse(savedUser);

        console.log(
            "Logged-in employee:",
            user
        );

        setupLoggedInUser(user);

        await loadDashboard();

    } catch (error) {

        console.error(
            "Employee initialization error:",
            error
        );

    }

});