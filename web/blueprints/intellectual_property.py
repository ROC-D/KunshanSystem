from flask import Blueprint, render_template

intellectual_property_bp = Blueprint('intellectual_property', __name__)


@intellectual_property_bp.route("/")
@intellectual_property_bp.route("/index")
@intellectual_property_bp.route("/property")
def index():
    return render_template("intellectual_property.py/index.html")
