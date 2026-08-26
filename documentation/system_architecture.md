# WorkLoadBalance AI – System Architecture

## 1. Overview

WorkLoadBalance AI follows a modular client-server architecture.

The system consists of four major layers:

1. Frontend
2. Backend API
3. Business Logic and Recommendation Services
4. MySQL Database

The frontend communicates with the Flask backend through HTTP API requests. The backend processes the requests, applies the required business logic, communicates with the MySQL database, and returns the appropriate response to the frontend.

---

## 2. High-Level Architecture

```text
                    WorkLoadBalance AI
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Frontend                    Backend
             │                           │
    ┌────────┼────────┐          ┌───────┼────────┐
    │        │        │          │       │        │
  Login   Employee  Manager    Routes  Services Database
             │        │          │       │        │
             │       Admin       │       │        │
             │        │          │       │        │
             └────────┴──────────┴───────┴────────┘
                                      │
                                      ▼
                                MySQL Database
```

---

## 3. Frontend Architecture

The frontend is organized into separate modules based on user functionality.

```text
frontend/
│
├── connection/
│   ├── api.js
│   └── config.js
│
├── login/
│   ├── login.html
│   ├── login.css
│   └── login.js
│
├── employee/
│   ├── employee.html
│   ├── employee.css
│   └── employee.js
│
├── manager/
│   ├── manager.html
│   ├── manager.css
│   └── manager.js
│
└── admin/
    ├── admin.html
    ├── admin.css
    └── admin.js
```

### Connection Module

The `connection` module contains the configuration and API communication logic used by the frontend.

* `config.js` contains API configuration.
* `api.js` handles communication with the backend.

---

## 4. Login Module

The login module provides the entry point for users.

The general login flow is:

```text
User
 ↓
Enter Email and Password
 ↓
Select Role
 ↓
Frontend sends login request
 ↓
Flask Backend
 ↓
Authentication
 ↓
Successful Login
 ↓
Role-specific Dashboard
```

After successful authentication, the logged-in user information is stored on the client side so that the appropriate dashboard can be displayed.

---

## 5. Employee Module

The employee module provides the interface used by employees.

The employee dashboard communicates with the backend to retrieve information such as:

* Employee information
* Assigned tasks
* Workload information
* Available working hours
* Recognition information

The employee module contains:

```text
employee.html
employee.css
employee.js
```

---

## 6. Manager Module

The manager module provides functionality for monitoring the team and managing task assignments.

The manager can:

* View team information
* Monitor employee workload
* View available working hours
* View pending tasks
* Request employee recommendations
* Confirm task assignments
* Log out of the system

The manager module contains:

```text
manager.html
manager.css
manager.js
```

---

## 7. Administrator Module

The administrator module provides system-level management functionality.

The module is separated into:

```text
admin.html
admin.css
admin.js
```

This separation allows administrative functionality to be developed independently from employee and manager functionality.

---

## 8. Backend Architecture

The backend is developed using Python and Flask.

The backend follows a modular structure:

```text
backend/
│
├── app.py
├── config.py
├── database.py
│
├── database/
│   ├── __init__.py
│   ├── connection.py
│   └── init_db.py
│
├── routes/
│   ├── admin_routes.py
│   ├── assignment_routes.py
│   ├── auth_routes.py
│   ├── employee_routes.py
│   ├── recognition_routes.py
│   ├── recommendation_routes.py
│   ├── task_routes.py
│   └── workload_routes.py
│
├── services/
│   ├── assignment_service.py
│   └── recommendation_service.py
│
└── utils/
    └── __init__.py
```

---

## 9. Flask Application

The `app.py` file acts as the main entry point for the Flask backend.

It initializes the Flask application and registers the different route modules.

The route modules are implemented using Flask Blueprints.

This approach keeps the backend organized instead of placing all API endpoints in one large file.

---

## 10. Route Layer

The route layer receives HTTP requests from the frontend and sends appropriate responses.

The project contains separate route modules for:

### Authentication

```text
auth_routes.py
```

Handles user login and authentication-related requests.

### Employees

```text
employee_routes.py
```

Handles employee-related operations.

### Tasks

```text
task_routes.py
```

Handles task-related operations.

### Workload

```text
workload_routes.py
```

Provides workload-related information.

### Recognition

```text
recognition_routes.py
```

Handles employee recognition information.

### Recommendations

```text
recommendation_routes.py
```

Handles requests for suitable employee recommendations.

### Assignments

```text
assignment_routes.py
```

Handles task assignment operations.

### Administration

```text
admin_routes.py
```

Handles administrator-related functionality.

---

## 11. Service Layer

The service layer contains the main business logic of the application.

This separates application logic from the API routes.

### Recommendation Service

```text
recommendation_service.py
```

The recommendation service identifies suitable employees for pending tasks based on task and employee workload information.

The process includes checking factors such as:

* Task status
* Employee availability
* Current workload
* Available working hours
* Estimated task hours

If a suitable employee cannot be identified, the system returns an appropriate message rather than making an unsuitable recommendation.

### Assignment Service

```text
assignment_service.py
```

The assignment service handles the actual task assignment.

Before assignment, the service verifies that:

* The task is still pending.
* The employee is available.
* The employee has sufficient available working hours.
* The assignment can be completed successfully.

This helps maintain consistency between workload information and task assignments.

---

## 12. Database Layer

The backend communicates with the MySQL database through the database layer.

The project contains database connection components such as:

```text
database/
├── connection.py
└── init_db.py
```

The database connection configuration is kept separate from the application routes and services.

This improves maintainability and makes it easier to manage database-related functionality.

---

## 13. Database

The project uses MySQL as its database management system.

The database is named:

```text
WorkBalanceAI
```

The database stores information related to:

* Employees
* Tasks
* Task assignments
* Workload records
* Recognition
* User authentication
* Employee availability

The database structure is described in detail in `Database_Design.md`.

---

## 14. API Communication

The frontend communicates with the Flask backend through HTTP requests.

The general communication flow is:

```text
Frontend
    │
    │ HTTP Request
    ▼
Flask API
    │
    ▼
Route
    │
    ▼
Service / Database
    │
    ▼
MySQL
    │
    ▼
Response
    │
    ▼
Frontend
```

For example, when a manager requests a recommendation:

```text
Manager Dashboard
       ↓
Recommendation API
       ↓
Recommendation Route
       ↓
Recommendation Service
       ↓
Employee + Workload Data
       ↓
Suitable Employee
       ↓
Recommendation Response
       ↓
Manager Dashboard
```

---

## 15. Task Assignment Flow

The task assignment process can be represented as:

```text
Manager selects pending task
             ↓
Request recommendation
             ↓
Check task information
             ↓
Check employee workload
             ↓
Check available hours
             ↓
Suitable employee found?
        ┌────┴────┐
       Yes        No
        │          │
        ▼          ▼
Recommendation   Inform manager
        │
        ▼
Manager confirms
        │
        ▼
Assignment service
        │
        ▼
Task assigned
```

---

## 16. Workload Management Flow

Workload information is used to determine employee capacity.

```text
Employee Tasks
      ↓
Workload Calculation
      ↓
Workload Record
      ↓
Workload Percentage
      +
Available Working Hours
      ↓
Employee Capacity
```

The available capacity is then considered when recommending employees for new tasks.

---

## 17. Security and Configuration

Sensitive configuration information such as database credentials is stored in an environment file rather than directly inside the source code.

The environment file is:

```text
backend/.env
```

This file is excluded from version control using `.gitignore`.

Therefore, sensitive credentials are not intended to be uploaded to the public GitHub repository.

---

## 18. Advantages of the Architecture

The modular architecture provides several advantages:

* Easier maintenance
* Clear separation of responsibilities
* Easier debugging
* Reusable backend services
* Independent frontend modules
* Better scalability
* Easier future development
* Reduced complexity in individual files

---

## 19. Future Architecture Improvements

Future versions of the system can extend the architecture with:

* A dedicated machine learning model service
* Automated task allocation
* Background workload calculations
* Notification services
* Advanced analytics
* Centralized authentication
* Production database deployment
* Cloud hosting
* API authentication and authorization improvements

---

## 20. Conclusion

WorkLoadBalance AI uses a modular architecture that separates the frontend, backend routes, business services, database layer, and database itself.

This architecture allows each component to be developed and maintained independently while enabling communication between the different layers through APIs.

The separation of the recommendation and assignment services also provides a clear foundation for improving the intelligent workload management capabilities of the system in future versions.
