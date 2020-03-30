import os
from flask import Blueprint, render_template, request, current_app, redirect, url_for, flash, jsonify
from web.forms import ProcessForm
from web.service import service_provider as provider_service

service_provider_bp = Blueprint('service_provider', __name__)


@service_provider_bp.route('/', methods=['GET', 'POST'])
def index():
    # TODO:登录的商务
    charger_id = 1
    charger_name = '负责人1'
    # TODO:待修改
    departments, tasks, records = provider_service.get_assignments(charger_id)
    form = ProcessForm(departments, tasks)
    # 上传
    if form.validate_on_submit():
        uploads = form.get_upload_filenames()
        department_id = form.departments.data
        mission_type = form.tasks.data
        complete_number = form.numbers.data
        ret = provider_service.add_one_record(charger_name, charger_id, department_id, mission_type, complete_number, uploads)
        status, msg = ("success", "插入成功") if ret else ("danger", "插入失败")
        flash(msg, status)
        # 转到GET
        return redirect(url_for('service_provider.index'))
    return render_template('service_provider/index.html', form=form, tasks=tasks, records=records)


@service_provider_bp.route('/upload', methods=['POST'])
def upload():
    if 'file' in request.files:
        f = request.files.get('file')
        # TODO:目前暂时不改变文件名
        filename = f.filename
        upload_path = current_app.config['FILE_UPLOAD_PATH']
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
        f.save(os.path.join(upload_path, filename))
        return jsonify({'filename': filename})
