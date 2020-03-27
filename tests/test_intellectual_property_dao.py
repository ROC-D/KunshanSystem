import pytest
import sys
import os
sys.path.append(os.getcwd())
from web.dao.intellectual_property import *


def test_get_ipc_map(init_test_app):
    results = get_ipc_map(depth=0)
    assert len(results) == 8


def test_get_total_number(init_test_app):
    result = get_total_patent_number()
    assert isinstance(result, int)
    assert result > 0


def test_count_patents_with_ipc(init_test_app):
    ipc_list = ['A', 'B']
    length = 1
    results = count_patents_with_ipc(length, ipc_list, len(ipc_list))

    assert isinstance(results, list)
    assert len(results) == len(ipc_list)
    first_datum = results[0]
    assert 'code' in first_datum
    assert 'amount' in first_datum


def test_update_target(init_test_app):
    department_id = 1
    data = [
        {
            "key": "发明专利",
            "value": 500,
            "id": 1,
        },{
            "key": "实用新型",
            "value": 500,
            "id": 2,
        },{
            "key": "软件著作权",
            "value": 500,
            "id": 3,
        },
    ]
    return_dict = update_year_target(department_id, data)
    assert return_dict["success"]


if __name__ == '__main__':
    pytest.main([__file__, '-s'])
