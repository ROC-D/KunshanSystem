"""
有关企业专利的数据库查询文件
"""
# -*- coding: utf-8 -*-
from web.utils import db


def get_ipc_map(depth=0):
    """
    获取ipc目录
    :return:
    """
    ipc_list = db.select('select ipc_id,ipc_content from ipc where depth=?', depth)

    return {ipc['ipc_id']: ipc['ipc_content'] for ipc in ipc_list}


def get_engineer_and_en_by_ipc(ipc_id):
    """
    根据ipc获取工程师以及所在的公司
    :param field: 技术领域
    :return: 公司以及工程师
    """
    sql = "select en_id, pa_inventor from enterprise_patent where pa_main_kind_num ={} ".format(ipc_id)
    result = db.select(sql)
    return result


def get_count_with_ipc(ipc_code, town, limit=40):
    """
    根据ipc获取相关的所有工程师数量
    :param ipc_code: 'ipc_root' or 'ipc_class' or 'ipc_class_sm'
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
        GROUP BY ipc ORDER BY number desc limit {limit}""".format(ipc_code=ipc_code, town=town, limit=limit)

    data = db.select(sql)
    return data


def get_en_name_by_en_id(en_id):
    """
    根据企业id获取企业名
    :param en_id:
    :return:
    """
    sql = "select en_name from en_base_info where en_id =%s" .format(en_id)
    # cursor.execute(sql, en_id)
    # result = cursor.fetchone()
    # return result[0]


if __name__ == "__main__":
    # print(get_pa_id_by_patent("不锈钢"))
    # gg = get_en_name_by_pa_id(56460)
    # print(gg)
    # print(get_engineer("电子信息技术"))
    # print(get_all_field())
    # print(get_engineer_and_en_by_field("低温余热发电技术"))
    # print(get_engineer_and_en_by_ipc("A23C7/00"))
    # print(get_patent_by_first_ipc("A"))
    print(get_all_third_ipc())
    # print(get_ipc_content_by_ipc_id("F21S"))
    # pass
