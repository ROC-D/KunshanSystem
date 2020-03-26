from web.utils import db


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
