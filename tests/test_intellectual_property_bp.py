import pytest
from flask import url_for


def test_count_patents_with_ipc(init_test_app):
    client = init_test_app
    response = client.get(url_for('intellectual_property.get_patent_counts_with_depth', depth=0))
    json_data = response.get_json()

    assert 'status' in json_data
    assert 'ok' in json_data['status']
    assert len(json_data['data']) == 8


def test_count_patents_with_ipc_invalid(init_test_app):
    client = init_test_app
    response = client.get(url_for('intellectual_property.get_patent_counts_with_depth', depth=3))
    json_data = response.get_json()

    assert 'status' in json_data
    assert 'error' in json_data['status']


if __name__ == '__main__':
    pytest.main([__file__, '-s'])
