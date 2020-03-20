"""
有关企业专利的数据库查询文件
"""
# -*- coding: utf-8 -*-
import pymysql
from web.config import MYSQL_CONFIG

conn = pymysql.connect(**MYSQL_CONFIG)
cursor = conn.cursor()


def get_first_ipc():
    """
    获取第一类ipc目录，只有1位
    :return:
    """
    sql = "select ipc_id, ipc_content from ipc where char_length (ipc_id) = 1"
    cursor.execute(sql)
    temp = cursor.fetchall()
    result = []
    for i in temp:
        result.append([i[0], i[1]])
    return result


def get_second_ipc():
    """
    获取第二类ipc目录，只有4位
    :return:
    """
    sql = "select ipc_id, ipc_content from ipc where char_length (ipc_id) = 4"
    cursor.execute(sql)
    temp = cursor.fetchall()
    result = []
    for i in temp:
        if "(" in i[1]:
            result.append([i[0], i[1][0:i[1].index("(")]])
        else:
            result.append([i[0], i[1]])
    return result


def get_ipc_content_by_ipc_id(ipc_id):
    """
    根据ipc_id获取ipc内容
    :return:
    """
    if len(ipc_id) > 4:
        ipc_id = ipc_id[0:4]
    sql = "select ipc_content from ipc where ipc_id = %s".format(ipc_id)
    cursor.execute(sql, ipc_id)
    temp = cursor.fetchone()
    result = ''
    if "(" in temp[0]:
        result = temp[0][0: temp[0].index("(")]
    else:
        result = temp[0]
    return result


def get_all_third_ipc():
    """
    从专利表中统计第三类ipc目录
    :return:
    """
    sql = "select pa_main_kind_num from enterprise_patent"
    cursor.execute(sql)
    temp = cursor.fetchall()
    result = []
    for i in temp:
        result.append(i[0])
    result_dict = {}
    for key in result:
        result_dict[key] = result_dict.get(key, 0) + 1
    result_1 = sorted(result_dict.items(), key=lambda x: x[1], reverse=True)
    result_2 = []
    for i in result_1:
        if len(i[0]) > 5:
            result_2.append([i[0], i[1]])
    result_2 = sorted(result_2, key=lambda x: x[1], reverse=True)[0:50]
    final_result = []
    for i in result_2:
        final_result.append([i[0], get_ipc_content_by_ipc_id(i[0])])
    return final_result


def get_engineer_and_en_by_ipc(ipc_id):
    """
    根据ipc获取工程师以及所在的公司
    :param field: 技术领域
    :return: 公司以及工程师
    """
    sql = "select en_id, pa_inventor from enterprise_patent where pa_main_kind_num =%s "
    cursor.execute(sql, ipc_id)
    result = cursor.fetchall()
    return result


def get_count_with_ipc(ipc_id):
    """
    根据ipc获取相关的所有工程师数量
    :return:
    """
    query_param = ['%s%%' % ipc_id]
    sql = "select pa_inventor from enterprise_patent where pa_main_kind_num like %s"
    cursor.execute(sql, query_param)
    temp = cursor.fetchall()
    result = []
    for i in temp:
        for j in i:
            result.append(j)
    result = list(set(result))
    return len(result)


def get_count_with_ipc2(ipc_id):
    """
    根据ipc获取相关的所有工程师数量,第三类
    :return:
    """
    sql = "select pa_inventor from enterprise_patent where pa_main_kind_num = %s".format(ipc_id)
    cursor.execute(sql, ipc_id)
    temp = cursor.fetchall()
    result = []
    for i in temp:
        for j in i:
            result.append(j)
    result = list(set(result))
    return len(result)


def get_en_name_by_en_id(en_id):
    """
    根据企业id获取企业名
    :param en_id:
    :return:
    """
    sql = "select en_name from en_base_info where en_id =%s".format(en_id)
    cursor.execute(sql, en_id)
    result = cursor.fetchone()
    return result[0]


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
