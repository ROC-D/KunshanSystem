from flask import Blueprint, render_template, request, jsonify
from web.service import intellectual_property as property_service

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


@intellectual_property_bp.route('/count_patents_with_ipc/<int:depth>')
def get_patent_counts_with_depth(depth):
    results = property_service.count_patents_with_ipc(depth=depth, limit=7)
    return jsonify(results)
