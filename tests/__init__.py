from web import create_app
from web.extensions import db


def run_test_app():
    """创建并运行测试服务器"""
    app = create_app('testing')
    with app.app_context():
        db.create_all()
    app.run()


if __name__ == '__main__':
    run_test_app()

