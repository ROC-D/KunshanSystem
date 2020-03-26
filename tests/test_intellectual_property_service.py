import pytest
from web.service.intellectual_property import *


def test_count_patents_with_ipc(init_test_app):
    results = count_patents_with_ipc(depth=0)

    assert isinstance(results, list)
    assert len(results) == (9)
    first_datum = results[0]
    assert 'code' in first_datum
    assert 'amount' in first_datum


if __name__ == '__main__':
    pytest.main([__file__, '-s'])
