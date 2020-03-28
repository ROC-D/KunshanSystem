/*
* 保存服务商列表： [{name, id, principal},...]
* */
SERVER_LIST = [];

/*
* 保存任务列表：[{name, id}, ...]
* TODO 请求该部门的任务列表
* */
TARGET_LIST = ["发明专利","实用新型", "外观设计", "其他知识产权"];


$("#server-name").on("change", function (e) {
   let option = $(this).children("option:selected");
   if (option.attr("id")){
        // 选择添加服务商
        console.log(`window.location.href = "/add_server"`);
        //TODO
        // window.location.href = "/add_server";
   }
   else if (option.data("principal")){
        $("#principal").val(option.data("principal"));

   }
});

/*
* 提交分配任务表单
* */
$("#submit-distribute-task").on("click", function (e) {
    let data = $("#form-distribute-task").serializeArray();
    let send = {};
    for(let i = 0; i< data.length; i++){
        // 数据为空 or 数值为0
        if(!data[i].value){
            toggle_alert(false, "请填写完整数据");
            return false;
        }
        send[data[i].name] = data[i].value.trim();
    }

    $.ajax({
        url: "/distribute_task",
        type: "POST",
        data: send,
        dataType: "json",
        success: function (json_data) {
            if(json_data.error){
                toggle_alert(false, json_data.errorMsg);
                return false;
            }
            toggle_alert(true, "执行成功");
            $("#implementModal").modal("hide");
        }
    });
});


/*
* 添加
* */
$("#inner_label").on("click", ".dropdown .dropdown-menu a", function (e) {
    let task_id = $(this).parent().attr("task_id");
    let $tr = $(this).parents("tr");
    // 修改
    if($(this).hasClass("modify-menu")){
        fill_server2modal(SERVER_LIST);
        fill_target2modal(TARGET_LIST);
        let tds = $tr.children();
        $("#task-name").val($(tds[1]).text());
        $("#task-goal").val($(tds[2]).text());
        $("#deadline").val($(tds[4]).text());
        $("#principal").val($(tds[5]).text());
        $("#task-id").val(task_id);
        $("#implementModal").modal();
        let charger_id = $(tds[5]).data("id");
        $("#server-name").val(charger_id);
    }
    // 删除
    else if($(this).hasClass("delete-menu")){
        $.ajax({
            url: "/delete_server_task",
            type: "POST",
            data: {"id": task_id},
            dataType: "json",
            success: function (json_data) {
                if(json_data.error){
                    toggle_alert(false, "删除失败，请稍后再试");
                    return false;
                }
                toggle_alert(true, "删除成功");
                $tr.remove();
            },
            error: function (error) {
                console.log(error)
                toggle_alert(false, "网络问题，请稍后再试");
            }
        });
    }
});


/*
* 获取服务商列表
* */
function get_server() {
    let list = [];
    $.ajax({
        url:"/get_server_list",
        dataType:"json",
        success: function (json_data) {
            if (json_data.error){
                toggle_alert(false, json_data.errorMsg);
                return false;
            }
            //json_data: {name:{id, principal}}
            for (let server_name in json_data){
                list.push({name: server_name, id: json_data[server_name].id, principal: json_data[server_name].principal})
            }
            // 重置服务商列表
            SERVER_LIST = list;
            if (0 == list.length){
                fill_server2modal([{isEmtpty:true}]);
            }
            fill_server2modal(list);
        },
        error: function (error) {
            toggle_alert(false, )
        }
    })
}

/*
* TODO
* */
function get_target() {
    $.ajax({
        url: "/get_target",
        dataType: "json",
        success:function (json_data) {
            if (json_data.error){

            }
        }
    })
}


function fill_server2modal(server_list) {
    let  html= [`<option value="">--选择服务商--</option><option id="add-server" value=""><i class="fe fe-plus-circle"></i>添加服务商</option>>`];
    if(server_list.length == 0){
        get_server();
    }
    //无服务商
    else if(1 == server_list.length && server_list[0].isEmtpty){
        $("#server-name").html(html[0]);
    }
    else{
        for (let i = 0; i < server_list.length; i++){
            html.push(`<option value="${server_list[i].id}" data-principal="${server_list[i].principal}">${server_list[i].name}</option>`);
        }
        $("#server-name").html(html.join(""));
    }
}

function fill_target2modal(list) {
    let  html= [`<option value="">--选择任务--</option>`];
    if(list.length == 0){
        get_target();
    }
    //无任务
    else if(1 == list.length && list[0] == false){
        $("#task-name").html(html[0]);
    }
    else{
        for (let i = 0; i < list.length; i++){
            html.push(`<option value="${list[i]}">${list[i]}</option>`);
        }
        $("#task-name").html(html.join(""));
    }
}