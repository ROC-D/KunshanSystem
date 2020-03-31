import os
from flask import Blueprint, render_template, request, current_app, redirect, url_for, flash, jsonify
from web.forms import ProcessForm
from web.service import station_news as station_news_service

station_news_bp = Blueprint('station_news', __name__)

@station_news_bp.route('/index')
def index():
    # TODO:需要登录
    # 获取消息
    news = station_news_service.get_records("时梦佳")
    unchecked_news = news['unchecked_news']
    checked_news = news['checked_news']
    return render_template('station_news/index.html', unchecked_news=unchecked_news, checked_news=checked_news)

@station_news_bp.route("send_news")
def send_news():
    # 获取消息接受者信息
    receiver_name = request.args.get('receiver_name')
    receiver_kind = request.args.get('receiver_kind')
    news_content = request.args.get('news_content')
    sender_id = "1"
    sender_name = "时梦佳"
    sender_kind = "知识产权科"
    receiver_id = station_news_service.get_user_id(receiver_name, receiver_kind)
    ret = station_news_service.add_one_record(sender_id, sender_name, sender_kind, receiver_id, receiver_name, receiver_kind, news_content)
    if ret:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error'})

@station_news_bp.route("check_news")
def check_news():
    #消息已读
    news_id = request.args.get("news_id")
    ret = station_news_service.check_news(news_id)
    if ret:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error'})