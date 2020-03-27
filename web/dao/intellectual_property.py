"""
知识产权相关的查询
"""
import os
import sys
from web.utils import db


sys.path.append(os.getcwd())


def get_different_patent_type_count(town="开发区"):
    """
    获取某一区镇的各类知识产权数量
    :return:  None or tuple of dict
    """
    sql = "SELECT pa_type as type, COUNT(pa_type) as count FROM enterprise_patent " \
          "LEFT JOIN en_base_info on enterprise_patent.en_id = en_base_info.en_id " \
          "WHERE en_town='{town}' GROUP BY pa_type".format(town=town)

    return db.select(sql)


def get_patent_number_by_type(area="开发区"):
    """
    获取某一区域下近五年来 每年 不同类型的专利数量
    """
    sql = """
        SELECT pa_year, pa_type, count(1) number
        from enterprise_patent 
        where pa_year <= 2020
        and enterprise_patent.pa_id in
        (
            SELECT pa_id from engineer_patent where engineer_id in
            (
                SELECT engineer_id from enterprise_engineer where en_id in
                (
                SELECT en_id from en_base_info where en_town = "{}"
                )
            )
        )
        GROUP BY pa_year, pa_type
    """.format(area)
    outcome_list = db.select(sql)
    print(outcome_list)
    return outcome_list


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
