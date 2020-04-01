from flask import Blueprint, render_template, request, jsonify, flash, redirect,url_for
from web.service import intellectual_property as property_service
from web.forms import AddProvidersForm
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


@intellectual_property_bp.route('/delete_server_task', methods=["POST"])
def delete_server_task():
    task_id = request.form.get("id")
    return property_service.remove_assignment(task_id)


@intellectual_property_bp.route('/get_service_situation/<department_id>', methods=['GET', 'POST'])
def get_service_situation(department_id):
    """
    根据部门id获取该部门的所用服务商的任务执行情况
    """
    try:
        outcome = property_service.get_service_situation(department_id)
        return {"error": False, "data": outcome}
    except Exception as e:
        return {"error": True, "errorMsg": e}


@intellectual_property_bp.route('/get_completion_rate/<department_id>', methods=['GET', 'POST'])
def get_completion_rate(department_id):
    """
    根据部门id获取该部门的总任务的完成情况
    """
    try:
        completion_rate = property_service.get_completion_rate(department_id)
        return {"error": False, "value": completion_rate, "name": "完成率"}
    except Exception as e:
        return {"error": True, "errorMsg": e}


@intellectual_property_bp.route('/get_service_completion/', methods=['GET', 'POST'])
def get_service_completion():
    """
    获取某一部门某一类型的各服务商完成任务的数量
    """
    try:
        department_id = request.form.get("department_id")
        mission_type = request.form.get("mission_type")
        outcome = property_service.get_service_completion(department_id, mission_type)
        return {"error": False, "data": outcome}
    except Exception as e:
        return {"error": True, "errorMsg": e}


@intellectual_property_bp.route('/manage_providers', methods=["GET", "POST"])
def add_providers():
    """
    政府部门人员新增服务商
    """
    form = AddProvidersForm()
    if form.validate_on_submit():
        company = form.company.data
        changer = form.charger.data
        charger_tel = form.charger_tel.data
        outcome = property_service.add_one_record(company, changer, charger_tel)
        msg, status = ('success', '服务商添加成功') if outcome != -1 else ('danger', '添加失败, 请确认服务商信息是否重复')
        flash(status, msg)
        providers = property_service.get_provider_info()
        return render_template('intellectual_property/add_provider.html', form=form, providers=providers)
    providers = property_service.get_provider_info()
    return render_template('intellectual_property/add_provider.html', form=form, providers=providers)


@intellectual_property_bp.route('/modify_providers', methods=['POST'])
def modify_providers():
    """
    用户修改服务商信息
    """
    charger_id = request.form.get("charger_id")
    company = request.form.get("company")
    charger_name = request.form.get("charger_name")
    charger_tel = request.form.get("charger_tel")
    return property_service.modify_providers(charger_id, company, charger_name, charger_tel)


@intellectual_property_bp.route('/delete_providers', methods=['POST'])
def delete_provides():
    """
    用户删除服务商信息
    """
    charger_id = request.form.get("charger_id")
    return property_service.dalete_providers(charger_id)

