from flask import Blueprint, render_template, request, abort, redirect, url_for, jsonify, current_app
from web.service import en_patent_service as engineer_service
import flask_excel as excel


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
    back = get_engineer_count(depth=0, town="开发区")
    return fill_barGraph_params(data=back,
                                title="昆山开发区工程师分组",
                                xAxis="技术领域",
                                yAxis="工程师数量")


@engineer_bp.route('/second_ipc')
def get_engineer_second_ipc():
    """
    根据第二类ipc_id获取工程师数量
    :return:
    """
    back = get_engineer_count(depth=1, town="开发区")
    return fill_barGraph_params(data=back,
                                title="昆山开发区工程师分组",
                                xAxis="技术领域",
                                yAxis="工程师数量")


@engineer_bp.route('/third_ipc')
def get_engineer_third_ipc():
    """
    根据第三类ipc_id获取工程师数量
    :return:
    """
    back = get_engineer_count(depth=2, town="开发区")
    return fill_barGraph_params(data=back,
                                title="昆山开发区工程师分组",
                                xAxis="技术领域",
                                yAxis="工程师数量")


@engineer_bp.route("/get_engineer/<ipc_id>")
def get_engineer(ipc_id):
    # 获取ipc分类的工程师以及所在的企业
    length = len(ipc_id)
    if length > 4 or length < 1:
        # TODO
        return None
    #
    elif 1 == length:
        depth = 0
    else:
        depth = length - 2

    engineer_list = engineer_service.get_engineer_group_by_ipc(depth=depth,
                                                               ipc_code=ipc_id,
                                                               town="开发区",
                                                               limit=500)
    excel.init_excel(current_app._get_current_object())

    data = [(item["en_name"], item["engineer_name"]) for item in engineer_list]
    return excel.make_response_from_array(data, "csv", "result")
    # TODO
    # return jsonify(engineer_list)


def get_engineer_count(depth=0, town='开发区'):
    data = engineer_service.get_engineer_count(depth=depth, town=town)

    if data is None:
        return jsonify({
            "status": "参数有误，获取数据失败"
        })
    return {
        "status": "ok",
        "data": data
    }


def fill_barGraph_params(data={}, title="", subtitle="", legend=[], xAxis="", yAxis=""):
    data.update({
        "title": title,
        "subtitle": subtitle,
        "legend": legend,
        "xAxis_name": xAxis,
        "yAxis_name": yAxis
    })
    return jsonify(data)