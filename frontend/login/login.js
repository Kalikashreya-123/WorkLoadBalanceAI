// ============================================================
// WORKBALANCE AI - LOGIN SCRIPT
// ============================================================


// ============================================================
// ROLE SELECTION
// ============================================================

function selectRole(selectedRole) {

    const roleInput =
        document.getElementById("role");

    if (roleInput) {
        roleInput.value = selectedRole;
    }

    const roleCards =
        document.querySelectorAll(".role-card");

    roleCards.forEach(card => {

        card.classList.remove("active");

    });

    const selectedCard =
        document.querySelector(
            `.role-card[data-role="${selectedRole}"]`
        );

    if (selectedCard) {

        selectedCard.classList.add("active");

    }

    console.log(
        "Selected role:",
        selectedRole
    );
}


// ============================================================
// PASSWORD VISIBILITY
// ============================================================

function togglePassword() {

    const passwordInput =
        document.getElementById("password");

    const passwordIcon =
        document.getElementById("passwordIcon");

    if (!passwordInput) {
        return;
    }

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        if (passwordIcon) {
            passwordIcon.setAttribute(
                "data-lucide",
                "eye-off"
            );
        }

    } else {

        passwordInput.type = "password";

        if (passwordIcon) {
            passwordIcon.setAttribute(
                "data-lucide",
                "eye"
            );
        }
    }

    // Refresh Lucide icon if available
    if (
        typeof lucide !== "undefined" &&
        lucide.createIcons
    ) {
        lucide.createIcons();
    }
}


// ============================================================
// LOGIN
// ============================================================

async function login() {

    const roleElement =
        document.getElementById("role");

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const message =
        document.getElementById("loginMessage");


    const role =
        roleElement
            ? roleElement.value
            : "";

    const email =
        emailElement
            ? emailElement.value.trim()
            : "";

    const password =
        passwordElement
            ? passwordElement.value
            : "";


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!role) {

        if (message) {

            message.textContent =
                "Please select your role.";

            message.style.color =
                "#dc2626";
        }

        return;
    }


    if (!email || !password) {

        if (message) {

            message.textContent =
                "Please enter your email and password.";

            message.style.color =
                "#dc2626";
        }

        return;
    }


    // --------------------------------------------------------
    // SHOW LOGIN STATUS
    // --------------------------------------------------------

    if (message) {

        message.textContent =
            "Signing in...";

        message.style.color =
            "#2563eb";
    }


    try {

        // ----------------------------------------------------
        // CONNECT TO BACKEND THROUGH api.js
        // ----------------------------------------------------

        const data =
            await loginUser(
                email,
                password,
                role
            );


        // ----------------------------------------------------
        // CHECK LOGIN RESPONSE
        // ----------------------------------------------------

        if (!data || !data.success) {

            if (message) {

                message.textContent =
                    data?.message ||
                    "Login failed.";

                message.style.color =
                    "#dc2626";
            }

            return;
        }


        // ----------------------------------------------------
        // SAVE LOGGED-IN USER
        // ----------------------------------------------------

        localStorage.setItem(
            "workloadUser",
            JSON.stringify(data.user)
        );


        console.log(
            "Login successful:",
            data.user
        );


        // ----------------------------------------------------
        // GET USER ROLE
        // ----------------------------------------------------

        const userRole =
            data.user.role;


        // ----------------------------------------------------
        // EMPLOYEE
        // ----------------------------------------------------

        if (userRole === "Employee") {

            window.location.href =
                "../employee/employee.html";

            return;
        }


        // ----------------------------------------------------
        // MANAGER
        // ----------------------------------------------------

        if (userRole === "Manager") {

            window.location.href =
                "../manager/manager.html";

            return;
        }


        // ----------------------------------------------------
        // ADMIN / BOSS
        // ----------------------------------------------------

        if (
            userRole === "Admin" ||
            userRole === "Boss"
        ) {

            window.location.href =
                "../admin/admin.html";

            return;
        }


        // ----------------------------------------------------
        // UNKNOWN ROLE
        // ----------------------------------------------------

        if (message) {

            message.textContent =
                "Login successful, but the user role is not recognized.";

            message.style.color =
                "#dc2626";
        }


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        if (message) {

            message.textContent =
                error.message ||
                "Cannot connect to the backend. Make sure Flask is running.";

            message.style.color =
                "#dc2626";
        }
    }
}


// ============================================================
// LOGIN PAGE INITIALIZATION
// ============================================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        // ----------------------------------------------------
        // CHECK FOR PREVIOUS LOGIN
        // ----------------------------------------------------

        const savedUser =
            localStorage.getItem(
                "workloadUser"
            );


        if (savedUser) {

            try {

                const user =
                    JSON.parse(savedUser);


                // If a user is already logged in,
                // send them directly to their dashboard.

                if (user.role === "Employee") {

                    window.location.href =
                        "../employee/employee.html";

                    return;
                }


                if (user.role === "Manager") {

                    window.location.href =
                        "../manager/manager.html";

                    return;
                }


                if (
                    user.role === "Admin" ||
                    user.role === "Boss"
                ) {

                    window.location.href =
                        "../admin/admin.html";

                    return;
                }


            } catch (error) {

                console.error(
                    "Saved login data is invalid:",
                    error
                );

                localStorage.removeItem(
                    "workloadUser"
                );
            }
        }


        // ----------------------------------------------------
        // INITIALIZE LUCIDE ICONS
        // ----------------------------------------------------

        if (
            typeof lucide !== "undefined" &&
            lucide.createIcons
        ) {

            lucide.createIcons();

        }

    }
);