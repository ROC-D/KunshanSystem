from flask import Blueprint, render_template, request, abort, redirect, url_for
from web.utils import db


main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    return redirect(url_for('main.show_bar', depth=0))


@main_bp.route('/area', defaults={'depth': 0})
@main_bp.route('/area/<int:depth>')
def show_bar(depth):
    # TODO:到大组级别，ipc共有8000多，目前暂时只到小类
    ancestors = ['部', '大类', '小类']
    if depth >= len(ancestors):
        abort(400)
    # code 和 title的映射
    ipc_list = db.select('select ipc_id,ipc_content from ipc where depth=?', depth)
    params = []
    ipc_mapping = {}
    length = None
    for ipc in ipc_list:
        ipc_mapping[ipc['ipc_id']] = ipc['ipc_content']
        params.append('"%s"' % ipc['ipc_id'])
        if length is None:
            length = len(ipc['ipc_id'])
    # 根据ipc获取对应的专利数量，目前设定最多返回30个
    sql_format = 'select left(pa_main_kind_num, {0}) as code, count(1) as amount from enterprise_patent where left(pa_main_kind_num, {0}) in ({1}) group by code order by amount desc limit 0,30'
    sql = sql_format.format(length, ','.join(params))
    # 查询，并返回dict的数据
    counter = db.select(sql)
    for datum in counter:
        datum['title'] = ipc_mapping[datum['code']]
    return render_template('main/show_bar.html', ancestors=ancestors, depth=depth, counter=counter)
