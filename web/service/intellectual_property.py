"""
TODO:
存储和知识产权相关的代码
"""

from web.dao import intellectual_property
from web.CONST_DICT import PATENT_TYPE


def get_different_patent_type_count(town='开发区'):
    """
    返回某一区镇的各类知识产权数量
    ：return： dict ==>{
        error: True, errorMsg:xxx
        OR
        patent_type_name: patent_count
    }
    """
    data = intellectual_property.get_different_patent_type_count(town)
    if data is None:
        return {"error": True, "errorMsg": "获取数据失败，检查区镇名"}

    result = {}
    for item in data:
        key = PATENT_TYPE[4] if item["type"] not in PATENT_TYPE else PATENT_TYPE[item["type"]]
        result[key] = item["count"]

    return result
