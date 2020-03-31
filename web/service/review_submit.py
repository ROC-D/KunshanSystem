import web.dao.review_submit as review_submit
import os


def return_error(msg):
    return {"error": True, "errorMsg": msg}


def get_records(department_id, type=None, server_id=None, task=None):
    """
    获取提交信息
    """
    data = None
    if type:
        data = review_submit.get_records_with_type(department_id, type)
    elif server_id:
        data = review_submit.get_records_with_server(department_id, server_id)
    elif task:
        data = review_submit.get_records_with_task(department_id, task)
    else:
        data = review_submit.get_all_records(department_id)

    if data is None:
        return return_error("获取数据失败")

    return data


def update_record_status(record_id, status):
    status = str(status)
    if '1' != status and '2' != status:
        return return_error("参数有误")

    data = review_submit.update_record_status(record_id, status)
    if data != 1:
        return return_error("更新失败")
    return {"success": data}