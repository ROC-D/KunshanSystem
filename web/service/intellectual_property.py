"""
存储和知识产权相关的代码
"""
import os
import sys
import web.dao.intellectual_property as property_dao
from web.CONST_DICT import PATENT_TYPE


sys.path.append(os.getcwd())


def return_error(errroMsg=""):
    """
    返回 dict 格式的报错
    """
    return {"error": True, "errorMsg": errroMsg}


def get_different_patent_type_count(town='开发区'):
    """
    返回某一区镇的各类知识产权数量
    ：return： dict ==>{
        error: True, errorMsg:xxx
        OR
        patent_type_name: patent_count
    }
    """
    # ==> [{"type":1, "count": 123}]
    patent_type = PATENT_TYPE
    data = property_dao.get_different_patent_type_count(town)
    if data is None:
        return return_error(errroMsg="获取数据失败，检查区镇名")

    return {
        patent_type[item["type"]]: item["count"]
        for item in data
    }


def get_patent_number_by_type_and_year(area="开发区"):
    """
    获取某一地区近五年来不同类型的专利的数量统计
    return: 1. 年份列表：
                    [2015, 2016, 2017, 2018, 2019]
            2. 每年对应的不同种类的专利数量：
                {'其他专利': [7, 8, 18, 3, 0],
                 '发明专利': [353, 835, 844, 1094, 899],
                 '外观设计': [0, 0, 0, 0, 0],
                 '实用新型': [595, 744, 1241, 1489, 353]}
    """
    relate_dict = {
        "1": "发明专利",
        "2": "实用新型",
        "3": "外观设计",
        "8": "其他专利",
        "9": "其他专利",
    }
    outcome_list = property_dao.get_patent_number_by_type(area)
    patent_dict = {}
    year_set = set()
    for d in outcome_list:
        year = d["pa_year"]
        type = d["pa_type"]
        number = d["number"]
        year_set.add(year)
        if year in patent_dict.keys():
            patent_dict[year][relate_dict[str(type)]] = number
        else:
            patent_dict[year] = {
                relate_dict[str(type)]: number
            }
    year_list = list(year_set)
    year_list.sort()
    return_dict = {
        "发明专利": [],
        "实用新型": [],
        "外观设计": [],
        "其他专利": [],
    }
    for year in year_list:
        if "发明专利" in patent_dict[year]:
            return_dict["发明专利"].append(patent_dict[year]["发明专利"])
        else:
            return_dict["发明专利"].append(0)

        if "实用新型" in patent_dict[year]:
            return_dict["实用新型"].append(patent_dict[year]["实用新型"])
        else:
            return_dict["实用新型"].append(0)

        if "外观设计" in patent_dict[year]:
            return_dict["外观设计"].append(patent_dict[year]["外观设计"])
        else:
            return_dict["外观设计"].append(0)

        if "其他专利" in patent_dict[year]:
            return_dict["其他专利"].append(patent_dict[year]["其他专利"])
        else:
            return_dict["其他专利"].append(0)

    return {"year_list": year_list, "patent_dict": return_dict}


def count_patents_with_ipc(depth, limit=20):
    """
    根据IPC的特征按照专利的主分类号前若干个字符对专利进行统计 并对剩下的数据进行了统计
    :param depth: 深度
    :param limit: 限制返回的个数
    :return: [{'code': '', 'amount': 1}, ...]
    """
    # 根据深度获取到对应的IPC
    ipc_map = property_dao.get_ipc_map(depth)
    ipc_list = [ipc['ipc_id'] for ipc in ipc_map]
    length = len(ipc_list[0])
    # 获取前若干个
    results = property_dao.count_patents_with_ipc(length, ipc_list, limit)
    # 统计当前数量
    count = 0
    for result in results:
        count += result['amount']
    # 得到其他专利数量
    total = property_dao.get_total_patent_number()
    results.append({'code': 'others', 'amount': total - count})

    return results
