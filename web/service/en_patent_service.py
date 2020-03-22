"""
处理有关企业专利信息的数据库获取结果的处理
"""
from web.service import enterprise_patent_dao as DAO

# TODO 加入config文件
depth2ipc_dict = {
    0: "ipc_root",
    1: "ipc_class",
    2: "ipc_class_sm"
}

IPC_MAP = {}


def get_ipc_map(depth=0):
    """
    获取ipc目录
    :return: dict ==> {"A":"xxxx", "B": "xxxx"}
    """
    global IPC_MAP
    str_depth = str(depth)
    if str_depth not in IPC_MAP:
        IPC_MAP[str_depth] = DAO.get_ipc_map(depth)

    return {ipc['ipc_id']: ipc['ipc_content'] for ipc in IPC_MAP[str_depth]}


def get_engineer_group_by_ipc(depth, ipc_code, town, limit):
    """
    根据ipc获取工程师以及所在的公司,用于工程师分组
    :param depth: int IPC层级 => 0, 1, 2
    :param ipc_code: ipc 代码
    :param town: 区镇
    :param limit: 工程师人数上限
    :return: 前10家的企业以及工程师
    """
    if depth not in depth2ipc_dict:
        return None
    data = DAO.get_engineer_group_by_ipc(ipc_type=depth2ipc_dict[depth],
                                         ipc_code=ipc_code,
                                         town=town,
                                         limit=limit)
    return data


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
    if depth not in depth2ipc_dict:
        return None

    ipc_mapping = get_ipc_map(depth)

    # ({"ipc":xxx, "number":123}, ...)
    data = DAO.get_engineer_count_with_ipc(ipc_type=depth2ipc_dict.get(depth), town=town)
    # print(data)
    return [
        {
            "code": item["ipc"],
            "title": ipc_mapping[item["ipc"]],
            "amount": item["number"]
        }
        for item in data
    ]


def get_enterprise_count(depth, town):
    """
    获取区域内各个IPC细分领域内的 专利数量
    :return : dict ==> {"A": 123, ...}
    """
    # code 和 title的映射
    # {"A":"xxx", ...}
    ipc_mapping = get_ipc_map(depth)
    params = []
    length = None
    for ipc in ipc_mapping.keys():
        params.append('"%s"' % ipc)
        if length is None:
            length = len(ipc)

    return DAO.get_enterprise_count_with_ipc(length=length, params=",".join(params), town=town)


def get_enterprise_and_engineers(depth, town, limit=40):
    """
    获取区域内各个IPC细分领域内的 企业和工程师数量
    :return : dict ==> {"A": 123, ...}
    :param depth:
    :param town:
    :param limit:
    :return:
    """
    # 先获取工程师分组
    engineers = DAO.get_engineer_count_with_ipc(ipc_type=depth2ipc_dict.get(depth), town=town, limit=limit)
    ipc_list, params, length = [], [], None
    for engineer in engineers:
        ipc_list.append(engineer['ipc'])
        params.append('"%s"' % engineer['ipc'])
        if length is None:
            length = len(engineer['ipc'])
    # 获取到工程师分组对应的IPC
    enterprises = DAO.get_enterprise_count_with_ipc(length=length, params=",".join(params), town=town, limit=limit)
    # 让企业数据顺序和工程师顺序一致
    temp = [None] * len(enterprises)
    for enterprise in enterprises:
        index = ipc_list.index(enterprise['code'])
        temp[index] = enterprise
    enterprises = temp

    return enterprises, engineers


if __name__ == "__main__":
    pass
