from flask import Blueprint, jsonify, request

from database import get_database_connection


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json or {}

    email = data.get("email")
    password = data.get("password")
    selected_role = data.get("role")

    if not email or not password or not selected_role:

        return jsonify({
            "success": False,
            "message": "Email, password and role are required"
        }), 400

    connection = get_database_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute("""
            SELECT
                employee_id,
                full_name,
                email,
                password,
                role,
                department,
                experience_years,
                working_hours_per_day,
                availability_status,
                created_at

            FROM Employee

            WHERE email = %s
        """, (email,))

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "success": False,
                "message": "Account not found"
            }), 401

        # Frontend uses "Boss"
        # Database uses "Admin"

        database_role = user["role"]

        if selected_role == "Boss":
            expected_role = "Admin"
        else:
            expected_role = selected_role

        if database_role != expected_role:

            return jsonify({
                "success": False,
                "message": "Selected role does not match this account"
            }), 401

        if user["password"] != password:

            return jsonify({
                "success": False,
                "message": "Incorrect password"
            }), 401

        # Never send password to frontend

        user.pop("password", None)

        return jsonify({

            "success": True,

            "message": "Login successful",

            "user": user

        })

    finally:

        cursor.close()
        connection.close()