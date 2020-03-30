from flask import Blueprint, render_template, request, jsonify
from web.service import review_submit as review_submit

review_submit_bp = Blueprint('review_submit', __name__)


@review_submit_bp.route("/")
@review_submit_bp.route("/index")
def review():
    type = request.args.get("type")
    server = request.args.get("server")
    task = request.args.get("task")
    # TODO 从session中获取department_id
    department_id = 1
    records = review_submit.get_records(department_id=department_id, type=type, server_id=server, task=task)
    return render_template("review_submit/index.html", records=records)


@review_submit_bp.route("/operate", methods=["POST"])
def operate_record():
    status = request.form.get("status")
    record_id = request.form.get("id")
    return review_submit.update_record_status(record_id, status)
