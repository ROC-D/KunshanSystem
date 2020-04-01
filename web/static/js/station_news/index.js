// 发送消息
function send_news(){
    var receiver_kind_select = document.getElementById("receiver_kind");
    var receiver_name_select = document.getElementById("receiver_name");
    // 消息接受者所在部门
    var receiver_kind_index = receiver_kind_select.selectedIndex;
    var receiver_kind = receiver_kind_select.options[receiver_kind_index].text;

    // 消息接受者姓名
    var receiver_name_index = receiver_name_select.selectedIndex;
    var receiver_name = receiver_name_select.options[receiver_name_index].text;
    var news_content = document.getElementById("news_content").value;
    let data = {
        "receiver_kind": receiver_kind,
        "receiver_name": receiver_name,
        "news_content": news_content
    };
    if(news_content == ""){
        toggle_alert(false, "内容不能为空！");
        return false;
    }
    $.ajax({
        type: "get",
        url: "/station_news/send_news",
        data: data,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'ok') {
                toggle_alert(false, "发送失败");
                return false;
            }
            toggle_alert(true, "发送成功");
        },
        error: function (error) {
        }
    });
}

function send_news_model(){
    var receiver_kind_select = document.getElementById("receiver_kind_model");
    var receiver_name_select = document.getElementById("receiver_name_model");
    // 消息接受者所在部门
    var receiver_kind_index = receiver_kind_select.selectedIndex;
    var receiver_kind = receiver_kind_select.options[receiver_kind_index].text;

    // 消息接受者姓名
    var receiver_name_index = receiver_name_select.selectedIndex;
    var receiver_name = receiver_name_select.options[receiver_name_index].text;
    var news_content = document.getElementById("news_content_model").value;
    let data = {
        "receiver_kind": receiver_kind,
        "receiver_name": receiver_name,
        "news_content": news_content
    };
    if(news_content == ""){
        toggle_alert(false, "内容不能为空！");
        return false;
    }
    $.ajax({
        type: "get",
        url: "/station_news/send_news",
        data: data,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'success') {
                toggle_alert(false, "发送失败");
                return false;
            }
            toggle_alert(true, "发送成功");
        },
        error: function (error) {
        }
    });
}

function checked_news(element) {
    // console.log(element)
    // console.log(element.parents(".list-group-item"))
    // console.log(element.parents(".list-group-item").find(".sender_name"))
    // console.log(element.parents(".list-group-item").find(".news_id").text().trim())
    let news_id = element.parents(".list-group-item").find(".news_id").text().trim()
    let data = {"news_id":news_id}
    $.ajax({
        type: "get",
        url: "/station_news/check_news",
        data: data,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'success') {
                toggle_alert(false, "操作失败");
                return false;
            }
            toggle_alert(true, "操作成功");
        },
        error: function (error) {
        }
    });
}

function showModal(element) {
    let sender_kind = element.parents(".list-group-item").find(".sender_kind").text().trim();
    let sender_name = element.parents(".list-group-item").find(".sender_name").text().trim();
    $('#scheduleModal').modal("show");
    // $('#receiver_kind_model').val(sender_kind)
    // $('#receiver_name_model').val(sender_name)

    // document.getElementById("scheduleModal2").style.display="none";//隐藏
}

function showModal2(element) {
    // document.getElementById("scheduleModal").style.display="none";//隐藏
    let sender_kind = element.parents(".list-group-item").find(".sender_kind").text().trim();
    let sender_name = element.parents(".list-group-item").find(".sender_name").text().trim();
    let news_date = element.parents(".list-group-item").find(".news_date").text().trim();
    let news_content = element.parents(".list-group-item").find(".news_content").text().trim();

    $('#scheduleModal2').modal("show");
    $('#sender_kind_detail').val(sender_kind)
    $('#sender_name_detail').val(sender_name)
    $('#news_date_detail').val(news_date)
    $('#news_content_detail').val(news_content)

}