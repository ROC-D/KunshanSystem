from flask import Blueprint

enterprise_patent_bp = Blueprint('enterprise_patent', __name__)


@enterprise_patent_bp.route('/get')
def get():
    pass
