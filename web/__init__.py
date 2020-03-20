import os
from flask import Flask, render_template

from web.settings import configuration
from web.blueprints.main import main_bp
from web.blueprints.engineer_group import engineer_bp
from web.extensions import bootstrap
from web.utils import db
from web.config import MYSQL_CONFIG


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', "development")

    app = Flask('web')
    app.config.from_object(configuration[config_name])
    db.create_engine(**MYSQL_CONFIG)

    # 注册日志处理器
    register_logger(app)
    # 初始化扩展
    register_extensions(app)
    # 注册蓝图
    register_blueprints(app)
    # 注册错误处理函数
    register_errors(app)
    # 注册模板上下文处理函数
    register_template_context(app)
    # 注册命令
    register_commands(app)
    # 注册shell
    register_shell_context(app)

    return app


def register_logger(app):
    pass


def register_extensions(app):
    bootstrap.init_app(app)


def register_blueprints(app):
    app.register_blueprint(main_bp)
    app.register_blueprint(engineer_bp, url_prefix="/engineer")


def register_errors(app):
    @app.errorhandler(404)
    def bad_request(error):
        return render_template('errors/404.html', error=error), 404

    @app.errorhandler(400)
    def bad_request(error):
        return render_template('errors/400.html', error=error), 400


def register_shell_context(app):
    pass


def register_commands(app):
    pass


def register_template_context(app):
    """注册模板上下文"""
    pass
