from flask import Blueprint, jsonify, request

from services.recommendation_service import generate_recommendation


recommendation_bp = Blueprint(
    "recommendation",
    __name__
)


# ============================================================
# AI EMPLOYEE RECOMMENDATION
# ============================================================

@recommendation_bp.route("/recommend/<int:task_id>")
def recommend_employee(task_id):

    exclude_employee_id = request.args.get(
        "exclude_employee_id",
        type=int
    )

    result = generate_recommendation(
        task_id,
        exclude_employee_id
    )

    status_code = result.pop(
        "status_code",
        200
    )

    return jsonify(result), status_code