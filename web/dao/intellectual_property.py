"""
知识产权相关的查询
"""
import os
import sys
sys.path.append(os.getcwd())
from web.utils import db
import datetime


def get_different_patent_type_count(town="开发区"):
    """
    获取某一区镇的各类知识产权数量
    :return:  None or tuple of dict
    """
    sql = "SELECT pa_type as type, COUNT(pa_type) as count FROM enterprise_patent " \
          "LEFT JOIN en_base_info on enterprise_patent.en_id = en_base_info.en_id " \
          "WHERE en_town='{town}' GROUP BY pa_type".format(town=town)

    return db.select(sql)


def get_patent_number_by_type(area="开发区", year=2020):
    """
    获取某一区域下近n年来 每年 不同类型的专利数量
    """
    sql = """SELECT a.pa_year, a.pa_type, count(1) number
            from enterprise_patent a LEFT JOIN en_base_info b on a.en_id=b.en_id
            where b.en_town='{}' and a.pa_year < {}
            GROUP BY a.pa_year, a.pa_type""".format(area, str(year))
    outcome_list = db.select(sql)
    return outcome_list


def get_target_info(department_id, year):
    """
    获取某部门、某年的 任务目标信息
    :return :empty tuple or list of dict ==>[{"id","name", "numbers"}]
    """
    sql = "select id, target_name as name, numbers from target where department_id=? and year=?"
    return db.select(sql, department_id, year)


def get_ipc_map(depth=0):
    """
    获取ipc目录
    :return: dict ==> {"ipc_id":"A", "ipc_content": "xxxx"}
    """
    return db.select('select ipc_id,ipc_content from ipc where depth=?', depth)


def get_total_patent_number():
    """获取企业的所有专利数量"""
    sql = 'select count(1) as count from enterprise_patent'
    result = db.select_one(sql)
    if result:
        return result['count']


def count_patents_with_ipc(length, ipc_list, limit=20):
    """
    根据IPC的特征按照专利的主分类号前若干个字符对专利进行统计
    :param length: 取ipc_list的前几个字符
    :param ipc_list: IPC组成的数组
    :param limit: 限制返回的个数
    :return: [{'code': '', 'amount': 1}, ...]
    """
    # 根据ipc获取对应的专利数量
    sql_format = 'select left(pa_main_kind_num, {length}) as code, count(1) as amount ' \
                 'from enterprise_patent where left(pa_main_kind_num, {length}) in ({in_})' \
                 'group by code order by amount desc limit {limit}'
    in_ = []
    for ipc in ipc_list:
        in_.append('"%s"' % ipc)

    sql = sql_format.format(length=length, in_=','.join(in_), limit=limit)
    # 查询，并返回dict的数据
    return db.select(sql)


def update_year_target(id, numbers):
    """
    用户更新年度目标
    """
    sql = "update target set numbers=? where id=?"
    return db.update(sql, numbers, id)


def insert_year_target(target_name, numbers, year, department_id):
    sql = "insert into target(target_name, numbers, year, department_id) values(?,?,?,?)"
    return db.insert(sql, target_name, numbers, year, department_id)


def insert_assignment(type, target, charger_id, charger_name, deadline, department_id):
    """
    插入一条任务
    """
    sql = "insert into assignment(type, task_target, charger_id, charger_name, deadline, department_id) " \
          "values(?, ?, ?, ?, ?, ?)"
    return db.insert(sql, type, target, charger_id, charger_name, deadline, department_id)


def update_assignment(task_id, type, target, charge_id, charge_name, deadline):
    """
    政府人员更新任务信息，包含 任务名，目标，负责人，截至日期等
    """
    sql = "update assignment set type=?, task_target=?, charger_id=?, charger_name=?, deadline=? where task_id=?"
    return db.update(sql, type, target, charge_id, charge_name, deadline, task_id)


def update_assignment_status(task_id, status):
    """
    修改任务的状态
    """
    sql = "update assignment set status=? where task_id=?"
    return db.update(sql, status, task_id)


def update_assignment_progress(task_id, progress):
    """
    服务商修改完成度
    """
    sql = "update assignment set progress=progress + ? where task_id=?"
    return db.update(sql, progress, task_id)


def get_server_list():
    """
    获取可用服务商列表
    : return: None or [{id, name, principal}, ...]
    """
    sql = "SELECT charger_id as id, service_provider_name as name, charger_name as principal " \
          "from service_provider where status=1"
    return db.select(sql)


def get_service_situation(department_id):
    """
    根据部门id获取该部门的所用服务商的任务执行情况
    """
    sql = """
        SELECT s.charger_name, s.charger_id, s.service_provider_name company, a.task_id, a.type, a.task_target, a.progress, 
        FROM_UNIXTIME(a.deadline, "%%Y-%%m-%%d") deadline
        from assignment a left join service_provider s on a.charger_id=s.charger_id
        where a.department_id={} and a.status != 3
        ORDER BY deadline desc
    """.format(department_id)
    return db.select(sql)


def get_completion_rate(department_id):
    """
    根据部门id获取该部门的总任务的完成情况
    """
    sql = """
        SELECT sum(task_target) sum, sum(progress) done 
        from assignment 
        where department_id={}
    """.format(department_id)
    completion = db.select_one(sql)
    return completion


def get_service_comparison(department_id, mission_type):
    """
    获取某一部门某一类型的各服务商完成任务的数量
    """
    sql = """
        SELECT a.task_target, a.charger_id, a.charger_name, a.progress, s.service_provider_name company
        from assignment a left join service_provider s on a.charger_id=s.charger_id
        where type="{}" and department_id={}
    """.format(mission_type, department_id)
    return db.select(sql)

