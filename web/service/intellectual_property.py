"""
TODO:
存储和知识产权相关的代码
"""
import web.dao.intellectual_property as property_dao


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
