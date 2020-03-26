"""
有关知识产权的对数据库的操作
"""

from web.utils import db


def get_different_patent_type_count(town="开发区"):
    """
    获取某一区镇的各类知识产权数量
    :return:  None or tuple of dict
    """
    sql = "SELECT pa_type as type, COUNT(pa_type) as count FROM enterprise_patent " \
          "LEFT JOIN en_base_info on enterprise_patent.en_id = en_base_info.en_id " \
          "WHERE en_town='{town}' GROUP BY pa_type".format(town=town)

    return db.select(sql)