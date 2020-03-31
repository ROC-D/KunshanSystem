from flask import Blueprint, render_template, request, jsonify, send_from_directory, current_app
from web.service import review_submit as review_submit
import os

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

    # TODO 测试读取文件名的性能
    read_record_filenames(records)
    return render_template("review_submit/index.html", records=records)


@review_submit_bp.route("/operate", methods=["POST"])
def operate_record():
    status = request.form.get("status")
    record_id = request.form.get("id")
    return review_submit.update_record_status(record_id, status)


@review_submit_bp.route("/download/<path:filename>")
def download(filename):
    # print(filename)
    return send_from_directory(current_app.config["FILE_UPLOAD_PATH"], filename)


def read_record_filenames(records):
    # TODO 测试读取文件名的性能
    for record in records:
        if record["file_id"]:
            dir = os.path.join(current_app.config["FILE_UPLOAD_PATH"], str(record["file_id"]))
            record["file_list"] = os.listdir(dir)