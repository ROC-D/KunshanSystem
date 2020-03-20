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
    return get_engineer_count(depth=0, town="开发区")


@engineer_bp.route('/second_ipc')
def get_engineer_second_ipc():
    """
    根据第二类ipc_id获取工程师数量
    :return:
    """
    return get_engineer_count(depth=1, town="开发区")


@engineer_bp.route('/third_ipc')
def get_engineer_third_ipc():
    """
    根据第三类ipc_id获取工程师数量
    :return:
    """
    return get_engineer_count(depth=2, town="开发区")


@engineer_bp.route("/get_engineer/<ipc_id>")
def get_engineer(ipc_id):
    # 获取ipc分类的工程师以及所在的企业
    ipc_id = ipc_id.replace("$", "/")
    engineer_list = engineer_service.get_engineer_and_en_by_ipc2(ipc_id[0:ipc_id.index(":")])
    return render_template("engineer_group/patent_engineer.html", engineer_list=engineer_list, ipc_id=ipc_id)


def get_engineer_count(depth=0, town='开发区'):
    data = engineer_service.get_engineer_count(depth=depth, town=town)

    if data is None:
        return jsonify({
            "status": "参数有误，获取数据失败"
        })
    return jsonify({
        "status": "ok",
        "data": data
    })