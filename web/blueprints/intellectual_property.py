from flask import Blueprint, render_template, request, jsonify
from web.service import intellectual_property as property_service
import json

intellectual_property_bp = Blueprint('intellectual_property', __name__)


@intellectual_property_bp.route("/")
@intellectual_property_bp.route("/index")
@intellectual_property_bp.route("/property")
def index():
    return render_template("intellectual_property/index.html")


@intellectual_property_bp.route("/get_different_patent_type_count")
def get_different_patent_type_count():
    town = request.args.get("town")
    town = "开发区" if not town else town

    back = property_service.get_different_patent_type_count(town)

    return jsonify(back)


@intellectual_property_bp.route('/get_patent_number_by_type_year')
def get_patent_number_by_type_year():
    """
    按专利类型和时间获取不同地区近五年的专利数量统计
    """
    outcome_dict = property_service.get_patent_number_by_type_and_year()
    return outcome_dict


@intellectual_property_bp.route('/this_year_target')
def get_this_year_target():
    # TODO 从 session 中获取 department_id
    department_id = request.args.get("department")
    return jsonify(property_service.get_this_year_target_info(department_id=department_id))


@intellectual_property_bp.route('/count_patents_with_ipc/<int:depth>')
def get_patent_counts_with_depth(depth):
    results = property_service.count_patents_with_ipc(depth=depth, limit=7)
    return jsonify(results)


@intellectual_property_bp.route('/update_year_target', methods=['POST'])
def update_year_target():
    """
    更新年度目标
    """
    department_id = request.form.get("department_id")
    data = json.loads(request.form.get("data"))
    return property_service.update_year_target(department_id, data)


@intellectual_property_bp.route('/get_server_list')
def get_server_list():
    """
    获取服务商列表
    """
    return property_service.get_server_list()


@intellectual_property_bp.route('/distribute_task', methods=["POST"])
def distribute_task():
    charger_id = request.form.get("server-name")
    task_name = request.form.get("task-name")
    principal = request.form.get("principal")
    task_goal = request.form.get("task-goal")
    deadline = request.form.get("deadline")
    task_id = request.form.get("task-id")

    # TODO 从session中获取department_id
    department_id = 1
    return property_service.upsert_assignment(task_id=task_id, name=task_name, goal=task_goal, charger_id=charger_id,
                                              charger_name=principal, deadline=deadline, department_id=department_id)
