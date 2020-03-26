from flask import Blueprint, jsonify
from web.service.intellectual_property import *

intellectual_property_bp = Blueprint('intellectual_property', __name__)


@intellectual_property_bp.route('/count_patents_with_ipc/<int:depth>')
def get_patent_counts_with_depth(depth):
    # TODO: 不能超过3类以上
    if depth >= 3:
        results = {'status': 'error', 'msg': 'invalid value of depth'}
    else:
        data = count_patents_with_ipc(depth=depth, limit=7)
        results = {'status': 'ok', 'data': data}
    return jsonify(results)
