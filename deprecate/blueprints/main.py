from flask import Blueprint, render_template, request, abort, redirect, url_for, jsonify
from web.service import en_patent_service as SERVICE
from web.utils import db


main_bp = Blueprint('main', __name__)


@main_bp.route('/area', defaults={'depth': 0})
@main_bp.route('/area/<int:depth>')
def show_bar(depth):
    # TODO:到大组级别，ipc共有8000多，目前暂时只到小类
    ancestors = ['部', '大类', '小类']
    town = '开发区'
    if depth >= len(ancestors):
        abort(400)
    # code 和 title的映射
    ipc_mapping = SERVICE.get_ipc_map(depth)
    enterprises, engineers = SERVICE.get_enterprise_and_engineers(depth, town, limit=20)

    for datum in enterprises:
        datum['title'] = ipc_mapping[datum['code']]

    counter = {
        "enterprises": enterprises,
        "engineers": engineers,
        "title": "昆山开发区企业技术领域分布",
        "xAxis_name": "技术领域",
        "yAxis_name": "数量"
    }
    return render_template('main/show_bar.html', ancestors=ancestors, depth=depth, counter=counter)


@main_bp.route('/')
@main_bp.route('/pie')
def show_pic():
    level = request.args.get("level")
    level = 0 if not level else int(level)

    type = "1"

    ancestors = getAncestors()

    if 2 == level:
        type = request.args.get("type")

        return render_template("main/company_property_sort.html", ancestors=ancestors, depth=level, type=type)

    if 3 == level:
        com_name = request.args.get("name")
        com_id = request.args.get("id")
        type = request.args.get("type")
        ancestors = getAncestors(com_id=com_id, com_name=com_name)
        # print(ancestors)
        type = "1" if not type else type

    return render_template('main/show_pic.html', ancestors=ancestors, depth=level, type=type)


@main_bp.route('/pie_data')
def get_pie_data():
    level = request.args.get('level')
    town = request.args.get('town')
    if not town:
        town = "开发区"

    if '0' == level or not level:
        return getAllDistribution(town)

    elif '1' == level:
        return getProperty(town)

    elif '2' == level:
        property_type = request.args.get("type")
        return companyPropertySequence(town, property_type)

    elif '3' == level:
        com_id = request.args.get("id")
        print("com_id: ", com_id)
        return companyProperty(com_id)

    return jsonify({"status": "error level"})


def getAllDistribution(town="开发区"):
    """
    获取全部企业的知识产权分布情况
    """

    sql = "SELECT COUNT(en_id) as total_com, sum(has_property) as focus_com " \
          "FROM enterprise_property WHERE en_town='%s'" % town
    data = db.select(sql)
    data = format_pie_data(data)

    if data is None:
        return jsonify({"status": "获取数据失败"})

    return jsonify({
        "pie_data": [
            {"key": "拥有知识产权的企业", "value": data["focus_com"], "click2": 1},
            {"key": "其他企业", "value": data["total_com"] - data["focus_com"], "click2": False},
        ],
        "status": "ok"
        ""
    })


def getProperty(town="开发区"):
    """
    获取知识产权分布
    """
    sql = "SELECT SUM(patent) as patent, SUM(utility_model_patent) as utility, " \
          "SUM(design_patent) as design, SUM(software_copyright) as sw FROM enterprise_property WHERE en_town='%s'" \
          % town

    data = db.select(sql)

    return format_property_data(data, click2=2)


def companyPropertySequence(town="开发区", property_type='发明专利'):
    """
    根据企业所拥有的某类知识产权数量排名
    """
    property_type_dict = {
        '发明专利': "patent",
        '实用新型专利': "utility_model_patent",
        '外观设计': "design_patent",
        '软件著作权': "software_copyright"
    }
    if str(property_type) not in property_type_dict:
        return jsonify({"status": "property_type 参数类型错误"})
    key = property_type_dict.get(property_type)

    sql = "SELECT enterprise_property.en_id as id,en_name as name,{key} as num FROM enterprise_property " \
          "LEFT JOIN en_base_info " \
          "on enterprise_property.en_id=en_base_info.en_id " \
          "WHERE enterprise_property.en_town='{town}' ORDER BY {key} DESC LIMIT 30".format(key=key, town=town)

    data = db.select(sql)
    if 0 == len(data):
        return jsonify({"status": "数据获取失败"})

    return jsonify({
        "data": data,
        "bar_graph": True,
        "title": "拥有 %s 的企业排名" % property_type,
        "xAxis_name": "企业名",
        "yAxis_name": "数量/件",
        "status": "ok"
    })


def companyProperty(com_id):
    """
    获取某一企业的知识产权信息
    """
    try:
        com_id = int(com_id)
    except Exception as e:
        return jsonify({"status": "企业id格数错误"})

    sql = "SELECT patent as patent, utility_model_patent as utility, design_patent as design, software_copyright as sw " \
          "FROM enterprise_property WHERE en_id=%d" % int(com_id)
    data = db.select(sql)

    return format_property_data(data)


def getAncestors(com_name="", com_id=0):
    # 用于显示面包屑导航栏
    ancestors = [
        {"level": 0, "key": "企业分布"},
        {"level": 1, "key": "知识产权分布"},
        {"level": 2, "list": {
            "1": "发明专利", "2": "实用新型专利", "3": "外观设计", "4": "软件著作权"
            }
        }
    ]
    if com_name:
        ancestors.append({
            "level": 3,
            "key": com_name,
            "com_id": com_id
        })
    return ancestors


def format_pie_data(data):
    if 0 == len(data):
        return None

    data = data[0]
    for key, value in data.items():
        if value is None:
            value = 0
        data[key] = int(value)
    return data


def format_property_data(data, click2=None):
    data = format_pie_data(data)

    if data is None:
        return jsonify({"status": "获取数据失败"})

    return jsonify({
        "status": "ok",
        "pie_data": [
            {"key": "发明专利", "value": data["patent"], "click2": click2},
            {"key": "实用新型专利", "value": data["utility"], "click2": click2},
            {"key": "外观设计", "value": data["design"], "click2": click2},
            # {"key": "软件著作权", "value": data["sw"], "click2": click2}
        ]
    })


def fill_pieGraph_params(data={}, title="", subtitle="", legend=[]):
    data.update({
        "title": title,
        "subtitle": subtitle,
        "legend": legend,
    })
    return jsonify(data)