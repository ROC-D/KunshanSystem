/*
* 保存服务商列表： [{name, id, principal},...]
* */
SERVER_LIST = [];
serverCompare = {};

/*
* 保存任务列表：[{name, id}, ...]
* TODO 请求该部门的任务列表
* */
TARGET_LIST = ["发明专利","实用新型", "外观设计", "其他知识产权"];

/*
* 定义全局变量
* */
YEAR_GOAL = {
	"target-of-patent": 0,
	"target-of-utility-model-patent": 0,
	"target-of-design-patent": 0,
	"target-of-other_patent": 0
};
let dict = {"发明专利": "target-of-patent", "实用新型": "target-of-utility-model-patent",
	"外观设计": "target-of-design-patent", "其他知识产权": "target-of-other_patent"}


/*
* 提交年度计划
* */
$("#submit-year-target").on("click", function (e) {
	let data = format_year_target_form();
	$.ajax({
		type: "POST",
		url: "/update_year_target",
		data: {"department_id": 1, "data": JSON.stringify(data)},
		dataType:"json",
		success: function (json_data) {
			if(json_data.error){
				toggle_alert(false, json_data.errorMsg);
				return false;
			}
			toggle_alert(true, "修改成功");
			get_patent_number_by_type_year();
			$("#propertyModal").modal("hide");
		},
		error:function (error) {
			toggle_alert(false, error);
		}
	})
});


/*
* 添加任务
* */
$("#add-task").on("click", function(e){
	$("#implementModal").modal();
	$("#task-id").val(-1);
	fill_server2modal(SERVER_LIST);
	fill_target2modal(TARGET_LIST);
});

/*
* 更换服务商
* */
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
            get_service_situation();
        }
    });
});


/*
* 对一条任务的操作
* */
$("#inner_label").on("click", ".dropdown .dropdown-menu a", function (e) {
    let task_id = $(this).parent().attr("task_id");
    let $tr = $(this).parents("tr");
    // 修改
    if($(this).hasClass("modify-menu")){
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
* 获取 目标编辑页面中填写的数据
* 返回json: {"发明专利":{value,id}}
* */
function format_year_target_form(){
	let data = {}, $target;
	for(let k in YEAR_GOAL){
		$target = $("#".concat(k));
		let value = $target.val();
		//未修改
		if(YEAR_GOAL[k] == value){
			continue;
		}else{
			YEAR_GOAL[k] = value;
		}

		let id = $target.data("id");
		let name = $target.attr("data-name");
		data[name] = {"value": YEAR_GOAL[k]};
		if(id){
			data[name]["id"] = id;
		}
	}
	return data;
}

/*
* 获取今年任务目标
* */
function get_this_year_target() {
	$.ajax({
		url: "/this_year_target",
		data:{"department":1},
		dataType:"json",
		success:function (json_data) {
			if(json_data.error){
				toggle_alert(false, json_data.errorMsg);
				return false;
			}
			for(let i = 0; i < json_data.length; i++){
				let key = json_data[i]["name"];
				if(!dict.hasOwnProperty(key)){
					console.error("invalid key", key);
					continue;
				}
				let id = dict[key];
				YEAR_GOAL[id] = json_data[i]["numbers"];

				// 保存已有的目标id
				if(json_data[i].hasOwnProperty("id")){
					$("#".concat(id)).attr("data-id", json_data[i]["id"]);
				}
			}
		}
	})
}


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
    let  html= [`<option value="">--选择服务商--</option><option id="add-server" value=""><i class="fe fe-plus"></i>添加服务商</option>>`];
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


//获取服务商列表
fill_server2modal(SERVER_LIST);
fill_target2modal(TARGET_LIST);
