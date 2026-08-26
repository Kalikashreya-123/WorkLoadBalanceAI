# WorkLoadBalance AI – Database Design

## 1. Introduction

WorkLoadBalance AI uses a MySQL relational database to store and manage the information required for employee management, task management, workload monitoring, task assignment, recognition, and employee recommendations.

The database is named:

```text
WorkBalanceAI
```

The database is designed to maintain relationships between employees, tasks, workload records, and task assignments.

---

## 2. Database Objectives

The main objectives of the database are:

* Store employee information.
* Store authentication-related information.
* Store task information.
* Track task assignments.
* Store employee workload records.
* Track available employee working hours.
* Store employee recognition information.
* Provide data required by the recommendation system.
* Maintain consistency between task assignments and employee workload.

---

## 3. Database Structure

The project database contains tables that support the major modules of the application.

The major entities include:

```text
Employee
Task
Task_Assignment
Workload_Record
Recognition
```

These tables work together to support task management and workload balancing.

---

## 4. Employee

The `Employee` table stores information about employees and their account details.

The employee information is used by the authentication system, employee dashboard, manager dashboard, workload calculations, and recommendation system.

Typical information stored includes:

* Employee ID
* Employee name
* Email
* Password
* Role
* Availability-related information

The employee ID acts as the unique identifier for an employee.

### Purpose

The table provides the basic employee information required throughout the system.

---

## 5. Task

The `Task` table stores information about tasks created or managed within the system.

Important task information includes:

* Task ID
* Task title
* Task description
* Estimated hours
* Task status
* Other task-related information

The task ID uniquely identifies each task.

### Task Status

The task status is used by the recommendation and assignment processes.

For example, a task can have a status such as:

```text
Pending
```

A pending task can be considered for employee recommendation and assignment.

---

## 6. Task_Assignment

The `Task_Assignment` table records the relationship between tasks and employees.

It is used to identify which employee has been assigned to a particular task.

Important information includes:

* Task ID
* Employee ID
* Assignment-related information

The table creates a relationship between the `Task` and `Employee` entities.

### Relationship

```text
Employee
   │
   │ assigned to
   ▼
Task_Assignment
   │
   │ belongs to
   ▼
Task
```

This allows the system to track task allocation across employees.

---

## 7. Workload_Record

The `Workload_Record` table stores calculated workload information for employees.

Important workload information includes:

* Employee ID
* Workload percentage
* Available working hours
* Calculated date

The workload record is important for determining employee capacity.

For example:

```text
Employee
   ↓
Assigned Work
   ↓
Workload Calculation
   ↓
Workload_Record
   ├── Workload Percentage
   └── Available Hours
```

The recommendation service uses workload information when identifying suitable employees for pending tasks.

---

## 8. Recognition

The recognition functionality stores information related to employee appreciation and achievements.

Recognition is maintained separately from workload calculation.

This separation ensures that appreciation or recognition does not directly alter an employee's workload capacity.

Recognition information can be used by the employee and manager dashboards.

---

## 9. Entity Relationships

The major relationships can be represented as follows:

```text
                 ┌──────────────┐
                 │   Employee   │
                 └──────┬───────┘
                        │
              ┌─────────┼──────────┐
              │         │          │
              ▼         ▼          ▼
       Task_Assignment  Workload  Recognition
              │         Record
              │
              ▼
         ┌──────────┐
         │   Task   │
         └──────────┘
```

### Employee → Task Assignment

One employee can be associated with multiple task assignments.

```text
Employee 1 ────────< Task_Assignment
```

### Task → Task Assignment

A task can be associated with an assignment record.

```text
Task 1 ────────────< Task_Assignment
```

### Employee → Workload Record

An employee can have workload records representing workload calculations over time.

```text
Employee 1 ────────< Workload_Record
```

### Employee → Recognition

An employee can have multiple recognition records.

```text
Employee 1 ────────< Recognition
```

---

## 10. Workload and Task Assignment Relationship

Workload management is one of the main purposes of the database.

When tasks are assigned to employees, the workload information can be used to determine whether an employee has sufficient capacity for additional work.

The general flow is:

```text
Employee
   ↓
Existing Task Assignments
   ↓
Workload Calculation
   ↓
Available Working Hours
   ↓
Recommendation System
   ↓
New Task Assignment
```

This allows task allocation decisions to take employee capacity into account.

---

## 11. Database Usage in Employee Recommendation

The employee recommendation feature uses database information to identify suitable employees.

The general process is:

```text
Pending Task
     ↓
Retrieve Task Information
     ↓
Retrieve Employee Information
     ↓
Retrieve Workload Information
     ↓
Check Available Hours
     ↓
Find Suitable Employee
     ↓
Return Recommendation
```

The estimated hours of the task are compared with the employee's available working hours.

If the employee does not have enough available hours, the employee should not be selected as a suitable recommendation.

---

## 12. Database Usage During Assignment

After a manager confirms a recommendation, the assignment service performs the task assignment.

The process includes checks such as:

1. Verify that the task exists.
2. Verify that the task is still pending.
3. Retrieve the employee information.
4. Check employee availability.
5. Check available working hours.
6. Assign the task if the required conditions are satisfied.
7. Update the relevant task and workload information.

This prevents tasks from being assigned incorrectly.

---

## 13. Transaction and Data Consistency

Task assignment requires multiple pieces of information to remain consistent.

For example, when a task is assigned:

```text
Task
  +
Employee
  +
Available Hours
  +
Workload
```

must remain logically consistent.

The assignment service uses database operations to verify the task and employee state before completing an assignment.

This helps prevent situations such as assigning a task that has already been assigned or assigning work beyond an employee's available capacity.

---

## 14. Database Connection

The Flask backend communicates with MySQL through the database connection layer.

The relevant backend components include:

```text
backend/
├── database.py
└── database/
    ├── connection.py
    └── init_db.py
```

The connection configuration is separated from the application routes and business logic.

Database credentials are stored in the environment configuration file rather than being directly included in the public source code.

---

## 15. Database Initialization

The project contains database initialization functionality that can be used when setting up the application.

The database initialization process allows the required database structure to be created before the application is used.

The SQL database script is stored in:

```text
Database/workbalance_database.sql
```

This file contains the database structure required by the project.

---

## 16. Data Flow

The overall database data flow can be represented as:

```text
                    User
                     │
                     ▼
                Frontend
                     │
                     ▼
                Flask API
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       Routes                Services
          │                     │
          └──────────┬──────────┘
                     ▼
              Database Layer
                     │
                     ▼
              MySQL Database
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    Employee       Task       Workload
        │            │            │
        └────────────┼────────────┘
                     ▼
              Task Assignment
```

---

## 17. Data Security

Database credentials are not stored directly in the source code repository.

The project uses an environment file:

```text
backend/.env
```

The `.env` file is excluded from Git version control using `.gitignore`.

Therefore, sensitive database credentials are kept separate from the source code that is uploaded to GitHub.

The database SQL file may contain the database structure and sample/project data, but sensitive credentials should not be stored inside it.

---

## 18. Advantages of the Database Design

The relational database design provides:

* Structured data storage
* Reduced duplication
* Clear relationships between entities
* Easier task tracking
* Employee workload monitoring
* Better task assignment management
* Data consistency
* Easier integration with the Flask backend
* Support for future analytics

---

## 19. Future Database Enhancements

Possible future improvements include:

* Additional indexes for faster queries
* More detailed employee skill information
* Employee availability schedules
* Task priority information
* Task deadlines
* Historical workload tracking
* Employee performance metrics
* Recommendation history
* Assignment history
* Audit logs

These additions could support more advanced workload analysis and machine learning features in future versions.

---

## 20. Conclusion

The WorkBalanceAI database provides the foundation for the application's employee management, task management, workload monitoring, task assignment, recognition, and recommendation functionality.

The relational structure allows information about employees, tasks, assignments, and workload records to be connected and used by the Flask backend.

By combining database information with the recommendation and assignment services, WorkLoadBalance AI can make workload-aware task allocation decisions while maintaining consistency between employee capacity and assigned work.

