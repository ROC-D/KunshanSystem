from flask import Blueprint, render_template, request, jsonify
from web.service import intellectual_property

intellectual_property_bp = Blueprint('intellectual_property', __name__)


@intellectual_property_bp.route("/")
@intellectual_property_bp.route("/index")
@intellectual_property_bp.route("/property")
def index():
    return render_template("intellectual_property.py/index.html")


@intellectual_property_bp.route("/get_different_patent_type_count")
def get_different_patent_type_count():
    town = request.args.get("town")
    town = "开发区" if not town else town

    back = intellectual_property.get_different_patent_type_count(town)

    return jsonify(back)
