// ============================================================
// WORKBALANCE AI - COMMON API CONNECTION
// ============================================================

// ------------------------------------------------------------
// COMMON FETCH FUNCTION
// ------------------------------------------------------------

async function apiFetch(endpoint, options = {}) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    let data;

    try {
        data = await response.json();
    } catch (error) {
        throw new Error(
            "Invalid response received from backend."
        );
    }

    if (!response.ok) {

        throw new Error(
            data.message || "API request failed."
        );
    }

    return data;
}


// ============================================================
// LOGIN
// ============================================================

async function loginUser(email, password, role) {

    return await apiFetch(
        "/login",
        {
            method: "POST",

            body: JSON.stringify({
                email: email,
                password: password,
                role: role
            })
        }
    );
}


// ============================================================
// EMPLOYEES
// ============================================================

async function getEmployees() {

    return await apiFetch(
        "/employees"
    );
}


// ============================================================
// TASKS
// ============================================================

async function getTasks() {

    return await apiFetch(
        "/tasks"
    );
}


// ============================================================
// WORKLOAD
// ============================================================

async function getWorkload() {

    return await apiFetch(
        "/workload"
    );
}


// ============================================================
// RECOGNITION
// ============================================================

async function getRecognition() {

    return await apiFetch(
        "/recognition"
    );
}


// ============================================================
// AI RECOMMENDATION
// ============================================================

async function getAIRecommendation(
    taskId,
    excludeEmployeeId = null
) {

    let endpoint =
        `/recommend/${taskId}`;

    if (excludeEmployeeId) {

        endpoint +=
            `?exclude_employee_id=${excludeEmployeeId}`;
    }

    return await apiFetch(
        endpoint
    );
}


// ============================================================
// ASSIGN TASK TO EMPLOYEE
// ============================================================

async function assignTask(
    taskId,
    employeeId
) {

    return await apiFetch(
        "/assign-other-employee",
        {
            method: "POST",

            body: JSON.stringify({
                task_id: Number(taskId),
                employee_id: Number(employeeId)
            })
        }
    );
}
// ============================================================
// LOGIN API
// ============================================================

async function loginUser(email, password, role) {

    return await apiFetch("/login", {
        method: "POST",

        body: JSON.stringify({
            email: email,
            password: password,
            role: role
        })
    });
}