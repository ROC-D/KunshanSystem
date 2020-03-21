"""
有关企业专利的数据库查询文件
"""
# -*- coding: utf-8 -*-
from web.utils import db


def get_ipc_map(depth=0):
    """
    获取ipc目录
    :return: dict ==> {"ipc_id":"A", "ipc_content": "xxxx"}
    """

    return db.select('select ipc_id,ipc_content from ipc where depth=?', depth)


def get_engineer_group_by_ipc(ipc_type, ipc_code, town, limit=1200):
    """
    根据ipc获取工程师信息以及所在的公司
    :param ipc_type: 选择的字段： 'ipc_root' or 'ipc_class' or 'ipc_class_sm'
    :param ipc_code: ipc代码： "A","B","B01","B03D",...
    :param town: 所属区镇
    :param limit: 工程师数量上限
    :return: tuple ==> (
        {"en_id": 24790, "en_name": "昆山康佳电子有限公司", "engineer_id": 20, "engineer_name": "白占良"},
        ...
    )
    """
    sql = """SELECT enterprise_engineer.en_id as en_id, enterprise_engineer.en_name as en_name, 
            enterprise_engineer.engineer_id as engineer_id, enterprise_engineer.engineer_name as engineer_name
            FROM engineer_patent
            LEFT JOIN enterprise_engineer
            on engineer_patent.engineer_id=enterprise_engineer.engineer_id
            LEFT JOIN en_base_info
            on enterprise_engineer.en_id=en_base_info.en_id
            WHERE engineer_patent.{ipc_type}="{ipc_code}" 
            and en_town="{town}"
            GROUP BY engineer_patent.engineer_id limit {limit} """\
        .format(ipc_type=ipc_type, ipc_code=ipc_code, town=town, limit=limit)

    data = db.select(sql)
    return data


def get_engineer_count_with_ipc(ipc_type, town, limit=40):
    """
    根据ipc获取相关的所有工程师数量
    :param ipc_type: 'ipc_root' or 'ipc_class' or 'ipc_class_sm'
    :param town: "开发区"
    :param limit: 数量
    :return:
    tuple ==> (
        {"ipc": "A", "number": 123},
        ...
    )
    """
    sql = """
        SELECT COUNT(num) as number,ipc from 
        (SELECT COUNT(engineer_patent.engineer_id) as num, {ipc_code} as ipc FROM engineer_patent 
            LEFT JOIN enterprise_engineer
            on engineer_patent.engineer_id=enterprise_engineer.engineer_id 
            LEFT JOIN  en_base_info
            on enterprise_engineer.en_id=en_base_info.en_id
            WHERE en_town="{town}"
            GROUP BY {ipc_code}, engineer_patent.engineer_id) as t
        GROUP BY ipc ORDER BY number desc limit {limit}""".format(ipc_code=ipc_type, town=town, limit=limit)

    data = db.select(sql)
    return data


def get_enterprise_count_with_ipc(length, params, town, limit=30):
    # 根据ipc获取对应的专利数量，目前设定最多返回30个
    sql_format = 'select left(pa_main_kind_num, {length}) as code, count(1) as amount ' \
                 'from enterprise_patent where left(pa_main_kind_num, {length}) in ({params})' \
                 'group by code order by amount desc limit {limit}'
    sql = sql_format.format(length=length, params=params, limit=limit)
    # 查询，并返回dict的数据
    return db.select(sql)


if __name__ == "__main__":
    pass
