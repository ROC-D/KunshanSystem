import os
import time
import shutil
from flask import current_app
import web.dao.service_provider as provider_dao


def get_assignments(charger_id):
    # 获取该负责人的所有任务
    tasks = provider_dao.get_assignments(charger_id)
    # 获取科室
    department_ids = [task['department_id'] for task in tasks]
    # 获取所有的科室
    departments = provider_dao.get_departments(department_ids)
    # 组合科室和任务
    return departments, tasks


def add_one_record(charge_name, charge_id, department_id, mission_type, complete_number, uploads):
    # 获取秒作为时间戳
    timestamp = int(time.time())
    # 创建以timestamp为名称的文件夹，并把uploads列表内的文件转移
    file_id = None if len(uploads) == 0 else timestamp
    # TODO:审核状态 默认为0
    audit_status = 0
    last_id = provider_dao.add_one_record(charge_name, charge_id, department_id, timestamp, mission_type, complete_number, audit_status, file_id)

    if last_id == -1:
        return False
    # 文件转移
    try:
        upload_path = current_app.config['FILE_UPLOAD_PATH']
        path = os.path.join(upload_path, str(timestamp))
        if not os.path.exists(path):
            os.makedirs(path)
        # 移动文件
        for filename in uploads:
            old_path = os.path.join(upload_path, filename)
            new_path = os.path.join(path, filename)
            shutil.move(old_path, new_path)
    except Exception as e:
        print(e)
        return False
    return True
