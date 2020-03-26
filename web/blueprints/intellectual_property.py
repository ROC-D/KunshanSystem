from flask import Blueprint, render_template
from web.service import intellectual_property

intellectual_property_bp = Blueprint('intellectual_property', __name__)


@intellectual_property_bp.route('/get_patent_number_by_type_year', )
def get_patent_number_by_type_year():
    """
    按专利类型和时间获取不同地区近五年的专利数量统计
    """
    outcome_dict = intellectual_property.get_patent_number_by_type_and_year()
    return outcome_dict