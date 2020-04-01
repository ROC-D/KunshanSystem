"""
存储和知识产权相关的代码
"""
import os
import sys
import time
import datetime
sys.path.append(os.getcwd())
import web.dao.intellectual_property as property_dao
from web.settings import PATENT_TYPE


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
    if outcome_list is None:
        return return_error("获取数据失败")
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


def upsert_assignment(task_id, name, goal, charger_id, charger_name, deadline, department_id):
    """
    政府插入/更新分配的任务
    """
    try:
        # "2020-02-25" ==> 1381419600
        timeArray = time.strptime(deadline, "%Y-%m-%d")
        deadline = int(time.mktime(timeArray))

        task_id, goal, charger_id, department_id = int(task_id), int(goal), int(charger_id), int(department_id)
    except Exception as e:
        return return_error("数据格式不正确")

    # 未传 或 task_id < 0, 插入
    if not task_id or task_id <= 0:
        # data => 123 (row_id)
        data = property_dao.insert_assignment(name, goal, charger_id, charger_name, deadline, department_id)
    else:
        # data => 0 or 1 (effected rows)
        data = property_dao.update_assignment(task_id, name, goal, charger_id, charger_name, deadline)
    if data is None:
        return return_error("操作失败")
    return {"success": data}


def remove_assignment(task_id):
    data = property_dao.update_assignment_status(task_id, 3)
    if data is None:
        return return_error("操作失败")
    return {"success": True}


def get_server_list():
    """

    """
    data = property_dao.get_server_list()
    if data is None:
        return return_error("获取服务商信息失败")
    return {
        item.get("name"): {"id": item.get("id"), "principal": item.get("principal")}
        for item in data
    }


def get_service_situation(department_id):
    """
    根据部门id获取该部门的所用服务商的任务执行情况()
    """
    service_situation = property_dao.get_service_situation(department_id)
    # 计算完成百分比
    for d in service_situation:
        d["percent"] = tranform_percent(d["progress"], d["task_target"])  # 转换成百分制
    return service_situation


def tranform_percent(a, b):
    """
    转化成百分制
    """
    c = a* 100 // b
    return str(c) + "%"


def get_completion_rate(department_id):
    """
    根据部门id获取该部门的总任务的完成情况
    """
    completion = property_dao.get_completion_rate(department_id)
    completion_rate = completion["done"] / completion["sum"]
    return float(round(completion_rate * 100, 2))  # 保留两位小数


def get_service_completion(department_id, mission_type):
    """
    获取某一部门某一类型的各服务商完成任务的数量
    """
    return property_dao.get_service_comparison(department_id, mission_type)


def add_one_record(company, changer, charger_tel):
    """
    增加服务商
    """
    if company is None or changer is None or charger_tel is None:
        return -1
    else:
        return property_dao.insert_one_record(company, changer, charger_tel)


def get_provider_info():
    """
    获取服务于该科室下服务商的信息
    """
    return property_dao.get_provider_info()