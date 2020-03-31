import os
import time
import shutil
from flask import current_app
import web.dao.station_news as station_news_dao

def add_one_record(sender_id, sender_name, sender_kind, receiver_id, receiver_name, receiver_kind, news_content):
    # 获取时间
    local_time = time.strftime("%Y-%m-%d", time.localtime())

    # TODO:审核状态 默认为0
    news_status = 0
    last_id = station_news_dao.add_one_record(sender_id, sender_name, sender_kind, receiver_id, receiver_name, receiver_kind, news_content, local_time, news_status)
    if last_id == -1:
        return False
    return True

def get_records(user_name):
    temp = station_news_dao.get_records(user_name)
    checked_news = []
    unchecked_news = []
    for i in temp:
        if i['news_status'] == 0:
            unchecked_news.append(i)
        else:
            checked_news.append(i)
    result = {"unchecked_news":unchecked_news, "checked_news":checked_news}
    return result

def get_user_id(user_name, user_kind):
    user_id = station_news_dao.get_user_id(user_name, user_kind)
    if user_kind == '科技中介':
        result = user_id['charger_id']
    else:
        result = user_id['id']
    return result

def check_news(news_id):
    last_id = station_news_dao.check_news(news_id)
    if last_id == -1:
        return False
    return True

def get_count_unchecked_news(user_name):
    result = station_news_dao.get_count_unchecked_news(user_name)
    return result['count(*)']