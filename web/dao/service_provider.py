from web.utils import db


def get_departments(department_ids):
    sql_format = 'select * from department where id in(%s)'
    sql = sql_format % ','.join(['?'] * len(department_ids))
    results = db.select(sql, *department_ids)
    return results


def get_assignments(charger_id):
    """
    根据负责人的id获取
    :param charger_id:
    :return:
    """
    sql = 'select * from assignment where charger_id=?'
    results = db.select(sql, charger_id)
    return results


def add_one_record(charge_name, charge_id, department_id, submit_time, mission_type, complete_numbers, audit_status, file_id):
    sql = """insert into submit_record(charger_name,charger_id,department_id,submit_time,mission_type,complete_numbers,
             audit_status,file_id) values(?,?,?,?,?,?,?,?)"""
    last_id = db.insert(sql, charge_name, charge_id, department_id, submit_time, mission_type, complete_numbers, audit_status, file_id)
    return last_id


def get_records(charger_id):
    sql = 'select *,FROM_UNIXTIME(submit_time, "%%Y-%%m-%%d") as sub_time from submit_record where charger_id=? ' \
          'order by submit_time desc'
    results = db.select(sql, charger_id)
    return results
