from web.utils import db

def add_one_record(sender_id, sender_name, sender_kind, receiver_id, receiver_name, receiver_kind, news_content, news_date, news_status):
    sql = """insert into station_news(sender_id, sender_name, sender_kind, receiver_id, receiver_name, receiver_kind, news_content, news_date, news_status) values(?,?,?,?,?,?,?,?,?)"""
    last_id = db.insert(sql, sender_id, sender_name, sender_kind, receiver_id, receiver_name, receiver_kind, news_content, news_date, news_status)
    return last_id

def get_records(user_name):
    """
    获取用户有关的消息
    """
    sql = 'select * from station_news where receiver_name= %s' .format(user_name)
    results = db.select(sql, user_name)
    return results

def get_user_id(user_name, user_kind):
    """
    根据用户名和用户种类获取用户id
    """
    if user_kind == '科技中介':
        sql = "select charger_id from service_provider where charger_name = ?"
        result = db.select_one(sql, user_name)
    else:
        sql = "select id from department where people_name = %s and department = %s" .format(user_name, user_kind)
        result = db.select_one(sql, user_name, user_kind)
    return result

def check_news(news_id):
    """
    进行已读操作
    """
    sql = "update station_news set news_status = 1 where news_id = %s" .format(news_id)
    result = db.update(sql, news_id)
    return result