from flask import Blueprint, render_template, request, abort

technology_bureau_bp = Blueprint('technology_bureau', __name__)


@technology_bureau_bp.route("/")
@technology_bureau_bp.route("/index")
@technology_bureau_bp.route("/property")
def property():
    return render_template("technology_bureau/property.html")
