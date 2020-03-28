import os

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


class BaseConfig(object):
    # wtform库用于CSRF
    SECRET_KEY = os.getenv('SECRET_KEY', "secret key")
    # 文件上传路径
    FILE_UPLOAD_PATH = os.path.join(basedir, 'uploads')


class DevelopmentConfig(BaseConfig):
    """开发环境配置"""
    pass


class TestingConfig(BaseConfig):
    """测试环境配置"""
    TESTING = True
    WTF_CSRF_ENABLED = False


class ProductionConfig(BaseConfig):
    """生产环境配置"""
    # 连接数据库
    pass


configuration = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}