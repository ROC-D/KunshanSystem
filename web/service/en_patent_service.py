"""
处理有关企业专利信息的数据库获取结果的处理
"""
from web.utils import db
from web.service import enterprise_patent_dao as DAO


def get_engineer_and_en_by_ipc2(ipc_id):
    """
    根据ipc获取工程师以及所在的公司,用于工程师分组
    :param ipc_id: ipc
    :return: 前10家的企业以及工程师
    """
    temp = DAO.get_engineer_and_en_by_ipc(ipc_id)
    en_id_list = []
    for i in temp:
        en_id_list.append(i[0])
    en_id_dict = {}
    for key in en_id_list:
        en_id_dict[key] = en_id_dict.get(key, 0) + 1
    list1 = sorted(en_id_dict.items(), key=lambda x: x[1], reverse=True)
    ten_en = []
    for i in list1[0:10]:
        ten_en.append(i[0])
    result = []
    for i in ten_en:
        temp1 = []
        for j in temp:
            if j[0] == i:
                temp1.extend(j[1].split(","))
        engineer_dict = {}
        for key in temp1:
            engineer_dict[key] = engineer_dict.get(key, 0) + 1
        engineer_list = sorted(engineer_dict.items(), key=lambda x: x[1], reverse=True)
        ten_engineer = []
        for x in engineer_list[0:15]:
            ten_engineer.append(x[0])
        if ten_engineer != ['不公告发明人']:
            result.append([DAO.get_en_name_by_en_id(i), ten_engineer])
    return result


def get_engineer_count(depth, town):
    """
    根据IPC类型获取工程师数量
    :param depth: int IPC层级 => 0, 1, 2
    :param town: 所属区镇
    :return: None or [
        {"code": 'B', "title": "作业；运输", "amount": 2795},
        ...
    ]
    """
    depth2ipc_dict = {
        0: "ipc_root",
        1: "ipc_class",
        2: "ipc_class_sm"
    }
    if depth not in depth2ipc_dict:
        return None

    ipc_mapping = DAO.get_ipc_map(depth)

    # ({"ipc":xxx, "number":123}, ...)
    data = DAO.get_count_with_ipc(ipc_code=depth2ipc_dict.get(depth), town=town)
    print(data)
    return [
        {
            "code": item["ipc"],
            "title": ipc_mapping[item["ipc"]],
            "amount": item["number"]
        }
        for item in data
    ]


if __name__ == "__main__":
    pass
