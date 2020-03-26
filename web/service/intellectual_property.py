"""
TODO:
存储和知识产权相关的代码
"""
import os
import sys
sys.path.append(os.getcwd())
from web.dao.intellectual_property import get_patent_number_by_type
import pprint
from web.utils import db
from web.config import MYSQL_CONFIG


def get_patent_number_by_type_and_year(area="开发区"):
    """
    获取某一地区近五年来不同类型的专利的数量统计
    return: 1. 年份列表：
                    [2015, 2016, 2017, 2018, 2019]
            2. 每年对应的不同种类的专利数量：
                {'其他专利': [7, 8, 18, 3, 0],
                 '发明专利': [353, 835, 844, 1094, 899],
                 '外观设计': [0, 0, 0, 0, 0],
                 '实用新型': [595, 744, 1241, 1489, 353]}
    """
    relate_dict = {
        "1": "发明专利",
        "2": "实用新型",
        "3": "外观设计",
        "8": "其他专利",
        "9": "其他专利",
    }
    outcome_list = get_patent_number_by_type(area)
    patent_dict = {}
    year_set = set()
    for d in outcome_list:
        year = d["pa_year"]
        type = d["pa_type"]
        number = d["number"]
        year_set.add(year)
        if year in patent_dict.keys():
            patent_dict[year][relate_dict[str(type)]] = number
        else:
            patent_dict[year] = {
                relate_dict[str(type)]: number
            }
    year_list = list(year_set)
    year_list.sort()
    return_dict = {
        "发明专利": [],
        "实用新型": [],
        "外观设计": [],
        "其他专利": [],
    }
    for year in year_list:
        if "发明专利" in patent_dict[year]:
            return_dict["发明专利"].append(patent_dict[year]["发明专利"])
        else:
            return_dict["发明专利"].append(0)

        if "实用新型" in patent_dict[year]:
            return_dict["实用新型"].append(patent_dict[year]["实用新型"])
        else:
            return_dict["实用新型"].append(0)

        if "外观设计" in patent_dict[year]:
            return_dict["外观设计"].append(patent_dict[year]["外观设计"])
        else:
            return_dict["外观设计"].append(0)

        if "其他专利" in patent_dict[year]:
            return_dict["其他专利"].append(patent_dict[year]["其他专利"])
        else:
            return_dict["其他专利"].append(0)
    print(pprint.pformat(return_dict))

    return {"year_list": year_list, "patent_dict": return_dict}


if __name__ == '__main__':
    db.create_engine(**MYSQL_CONFIG)
    get_patent_number_by_type_and_year()


