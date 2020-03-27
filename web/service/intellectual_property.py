"""
存储和知识产权相关的代码
"""
import os
import sys
import datetime
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
                {'其他知识产权': [7, 8, 18, 3, 0],
                 '发明专利': [353, 835, 844, 1094, 899],
                 '外观设计': [0, 0, 0, 0, 0],
                 '实用新型': [595, 744, 1241, 1489, 353]}
    """
    relate_dict = {
        "1": "发明专利",
        "2": "实用新型",
        "3": "外观设计",
        "8": "其他知识产权",
        "9": "其他知识产权",
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
        "其他知识产权": [],
    }
    for year in year_list:
        for key in return_dict.keys():
            if key in patent_dict[year]:
                return_dict[key].append(patent_dict[year][key])
            else:
                return_dict[key].append(0)

    return {"year_list": year_list, "patent_dict": return_dict}


def get_this_year_target_info(department_id):
    """
    获取今年某部门的各项指标及目标
    : return : () or list of data
    """
    year = datetime.datetime.now().year
    data = property_dao.get_target_info(department_id, year)
    if data is None:
        return return_error("部门参数有误")
    return data


def count_patents_with_ipc(depth, limit=20):
    """
    根据IPC的特征按照专利的主分类号前若干个字符对专利进行统计 并对剩下的数据进行了统计
    :param depth: 深度
    :param limit: 限制返回的个数
    :return: [{'code': '', 'amount': 1}, ...]
    """
    # TODO: 不能超过3类以上
    if depth >= 3:
        return return_error('invalid value of depth')
    # 根据深度获取到对应的IPC
    ipc_results = property_dao.get_ipc_map(depth)
    # 存储IPC 存储IPC和对应的描述
    ipc_list, ipc_title_mapping = [], {}
    for ipc in ipc_results:
        ipc_list.append(ipc['ipc_id'])
        ipc_title_mapping[ipc['ipc_id']] = ipc['ipc_content']
    # 获取前若干个
    length = len(ipc_list[0])
    results = property_dao.count_patents_with_ipc(length, ipc_list, limit)
    # 统计当前数量，并添加描述
    count = 0
    for result in results:
        count += result['amount']
        result['title'] = ipc_title_mapping[result['code']]
    # 得到其他知识产权数量
    total = property_dao.get_total_patent_number()
    results.append({'code': '其他', 'amount': total - count, 'title': '其他类别的所有专利'})

    return results


def update_year_target(department_id, data):
    """
    用户更新年度目标
    """
    if 0 == len(data):
        return return_error("无参数")
    result = False
    for target_name, content in data.items():
        if "id" in content:
            back = property_dao.update_year_target(content["id"], content["value"])
        else:
            year = datetime.datetime.now().year
            back = property_dao.insert_year_target(target_name, content["value"], year, department_id)
        result = result or back
    if result:
        return {"success": True}
    return return_error("修改失败")