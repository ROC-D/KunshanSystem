"""
知识产权相关的查询
"""
import os
import sys
sys.path.append(os.getcwd())
from web.utils import db
from web.config import MYSQL_CONFIG


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


if __name__ == '__main__':
    db.create_engine(**MYSQL_CONFIG)
    get_patent_number_by_type()
