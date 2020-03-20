from flask import Blueprint, render_template, request, abort, redirect, url_for, jsonify
from web.service import en_patent_service as engineer_service
from web.utils import db

engineer_bp = Blueprint('engineer', __name__)


@engineer_bp.route('/')
@engineer_bp.route('/index')
def engineer_info():
    return render_template("engineer_group/engineer_info.html")


@engineer_bp.route('/init_bar')
def init_engineer_bar():
    """
    初始化工程师分组的柱状图
    :return:
    """
    data = engineer_service.get_engineer_count_with_first_ipc()
    print(data)
    data1 = []
    data2 = []
    for i in data:
        data1.append(i[0])
        data2.append({"value": i[1], "name": i[0]})
    return jsonify({
        'status': 'ok',
        'data1': data1,
        'data2': data2
    })


@engineer_bp.route('/second_ipc')
def get_engineer_second_ipc():
    """
    根据第二类ipc_id获取工程师数量
    :return:
    """
    data = engineer_service.get_engineer_count_with_second_ipc()
    data1 = []
    data2 = []
    for i in data:
        data1.append(i[0])
        data2.append({"value": i[1], "name": i[0]})
    return jsonify({
        'status': 'ok',
        'data1': data1,
        'data2': data2
    })


@engineer_bp.route('/third_ipc')
def get_engineer_third_ipc():
    """
    根据第三类ipc_id获取工程师数量
    :return:
    """
    data = engineer_service.get_engineer_count_with_third_ipc()
    data1 = []
    data2 = []
    for i in data:
        data1.append(i[0])
        data2.append({"value": i[1], "name": i[0]})
    return jsonify({
        'status': 'ok',
        'data1': data1,
        'data2': data2
    })


@engineer_bp.route("/get_engineer/<ipc_id>")
def get_engineer(ipc_id):
    # 获取ipc分类的工程师以及所在的企业
    ipc_id = ipc_id.replace("$", "/")
    engineer_list = engineer_service.get_engineer_and_en_by_ipc2(ipc_id[0:ipc_id.index(":")])
    return render_template("engineer_group/patent_engineer.html", engineer_list=engineer_list, ipc_id=ipc_id)
