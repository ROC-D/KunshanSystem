from web.utils import db


def get_all_records(department_id):
    """
    获取某一部门的全部提交记录
    """
    sql = "SELECT submit_record.*, service_provider_name as name, " \
          "FROM_UNIXTIME(submit_time, '%%Y-%%m-%%d') as submit_time " \
          "FROM submit_record LEFT JOIN service_provider on submit_record.charger_id=service_provider.charger_id " \
          "WHERE department_id=? ORDER BY audit_status ASC, submit_time DESC"
    return db.select(sql, department_id)


def get_records_with_type(department_id, type):
    """
    获取某部门下，某一服务商的全部提交
    """
    sql = "SELECT submit_record.*, service_provider_name as name, " \
          "FROM_UNIXTIME(submit_time, '%%Y-%%m-%%d') as sub_time " \
          "FROM submit_record LEFT JOIN service_provider on submit_record.charger_id=service_provider.charger_id " \
          "WHERE department_id=? and audit_status=? ORDER BY submit_time DESC"
    return db.select(sql, department_id, type)


def get_records_with_server(department_id, server_id):
    """
    获取某部门下，某一服务商的全部提交
    """
    sql = "SELECT submit_record.*, service_provider_name as name, " \
          "FROM_UNIXTIME(submit_time, '%%Y-%%m-%%d') as sub_time " \
          "FROM submit_record LEFT JOIN service_provider on submit_record.charger_id=service_provider.charger_id " \
          "WHERE department_id=? and submit_record.charger_id=? ORDER BY audit_status ASC, submit_time DESC"
    return db.select(sql, department_id, server_id)


def get_records_with_task(department_id, task):
    """
    获取某部门下，某类任务的全部提交
    """
    sql = "SELECT submit_record.*, service_provider_name as name, " \
          "FROM_UNIXTIME(submit_time, '%%Y-%%m-%%d') as sub_time " \
          "FROM submit_record LEFT JOIN service_provider on submit_record.charger_id=service_provider.charger_id " \
          "WHERE department_id=? and mission_type=? ORDER BY audit_status ASC, submit_time DESC"
    return db.select(sql, department_id, task)


def update_record_status(record_id, status):
    """
    更新记录状态
    """
    sql = "update submit_record set audit_status=? where record_id=?"
    return db.update(sql, status, record_id)