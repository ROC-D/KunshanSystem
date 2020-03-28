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
* 处理各类响应事件
* */
$("#edit-year-goal").on("click", function(e){

	$("#propertyModal").modal();

	 for(let id in YEAR_GOAL){
         let value = YEAR_GOAL[id]?YEAR_GOAL[id]: 0;
         $("#".concat(id)).val(value);
 	}
});

$("#add-task").on("click", function(e){
	$("#implementModal").modal();
});

//为显示IPC下的专利的饼图添加事件
$("#patent_distribution_pie .nav-link").on("click", function (e) {
	depth = $(this).data("depth");
	get_statistical_data_of_patent(depth);
});

//为某一任务类型下的服务商完成数量对比的饼图添加事件
$("#service_completion_comparison .nav-link").on("click", function (e) {
	text = $.trim($(this).text());
	get_service_completion(text);
});

$("#submit-year-target").on("click", function (e) {
	let data = {}, $target;
	for(let k in YEAR_GOAL){
		$target = $("#".concat(k));
		let value = $target.val();
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
		},
		error:function (error) {
			toggle_alert(false, error);
		}
	})
});

/*
* 定义各类异步请求
* */

function get_different_patent_type_count() {
	$.ajax({
		url: "/get_different_patent_type_count",
		dataType: "json",
		success: function (data) {
			if(data.error){
				toggle_alert(false, data.errorMsg);
				return false;
			}
			//	渲染到页面
			for(let key in data){
				// key ==> 'patent'
				//标签id => 'count_of_patent'
				$("#count_of_".concat(key)).text(data[key]);
			}
		},
		error: function (error) {
			console.error("get_different_patent_type_count error", error);
		}
	})
}


function get_patent_number_by_type_year() {
	conversionsChart.showLoading();
	$.ajax({
		datatype: "json",
		type: "get",
		url: '/get_patent_number_by_type_year',
		success: function (data) {
			let year_list = data["year_list"];
			let patent_dict = data["patent_dict"];
			add_this_year_target(year_list, patent_dict);
			let serise = [], legend = [];
			for(let typeName in patent_dict){
				serise.push({
					name: typeName,data: patent_dict[typeName], type: 'bar', barWidth: 10
				});
				legend.push(typeName);
			}
			let BAR_DATA = {
				series: serise,
				xAxis: year_list,
				yAxis: "数量",
				legend: legend
			};

			set_option(conversionsChart, barOption, BAR_DATA);
		}
	});
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
				let id = dict[json_data[i]["name"]];
				YEAR_GOAL[id] = json_data[i]["numbers"];
				if(json_data[i].hasOwnProperty("id")){
					$("#".concat(id)).attr("data-id", json_data[i]["id"]);
				}
			}
		}
	})
}

function get_statistical_data_of_patent(depth) {
	//发送请求
	$.ajax({
		type: "get",
		url: "/count_patents_with_ipc/" + depth,
		dataType: "json",
		success: function (json_data) {
			if (json_data.error) {
				toggle_alert(false, json_data['errorMsg']);
				return false;
			}
			//转换数据格式
			let series = [];
			let legend = [];
			for (let i = 0;i < json_data.length; i++){
				let datum = json_data[i];
				series.push({"value": datum.amount, "name": datum.code, 'title': datum.title});
				legend.push(datum.code);
			}
			set_pie_option(patentDistributionChart, pieOption, {"seriesName": "专利分布", "series": series, "legend": legend});
		},
		error: function (error) {
			console.error(error);
		}
	})

}


/*
今年的目标
 */
function add_this_year_target(year_list, patent_dict){
	//TODO 获取今年年份
    year_list.push(2020);
    for(let k in dict){
    	if (patent_dict.hasOwnProperty(k)){
    		patent_dict[k].push(YEAR_GOAL[dict[k]]);
		}
    	else{console.log(k)}
	}
}

/*
获取今年的完成率
 */
function get_completion_rate(){
	let department_id = 1
	//发送请求
	$.ajax({
		type: "get",
		url: "/get_completion_rate/" + department_id,
		dataType: "json",
		success: function (json_data) {
			if (json_data.error) {
				toggle_alert(false, json_data['errorMsg']);
				return false;
			}
			// 显示该部门总的任务完成率
			gaugeOption.series[0].data = [json_data];
			completionRateChart.setOption(gaugeOption);
		},
		error: function (error) {
			console.error(error);
		}
	})

}

/*
根据某一部门的id和任务类型找出各个服务商的任务完成情况
 */
function get_service_completion(mission_type="发明专利"){
	let department_id = 1
	//发送请求
	$.ajax({
		type: "post",
		url: "/get_service_completion/",
		data:{
			"department_id": department_id,
			"mission_type": mission_type
		},
		dataType: "json",
		success: function (json_data) {
			if (json_data.error) {
				toggle_alert(false, json_data['errorMsg']);
				return false;
			}
			data = json_data["data"]
			// 转换数据格式
			let series = []
			let legend = []
			for (let i = 0;i < data.length; i++){
				let datum = data[i];
				series.push({"value": datum.progress, "name": datum.company, 'title': datum.charger_name});
				legend.push(datum.company);
			}
			set_pie_option(serverCompareChart, pieOption, {"seriesName": "专利分布", "series": series, "legend": legend});
		},
		error: function (error) {
			console.error(error);
		}
	})
}

/*
获得某部门中各服务商的任务执行情况
 */
function get_service_situation(){
	let department_id = 1;
	$.ajax({
		type: "get",
		url: "/get_service_situation/" + department_id,
		dataType: "json",
		success: function (json_data) {
			if (json_data.error) {
				toggle_alert(false, json_data['errorMsg']);
				return false;
			}
			data = json_data["data"];
			//拼接执行情况中的html
			inner_html = join_html_str(data);
			$("#inner_label").html(inner_html);
		},
		error: function (error) {
			console.error(error);
		}
	})
}

/*
拼接执行情况中的html
 */
function join_html_str(data){
	inner_html = "";
	for(var i = 0; i < data.length; i++){
		company = data[i]["company"]
		charger_name = data[i]["charger_name"]
		deadline = data[i]["deadline"]
		percent = data[i]["percent"]
		task_target = data[i]["task_target"]
		task_id = data[i]["task_id"]
		type = data[i]["type"]

		inner_html += "<tr>\n" +
		"                                        <td class=\"goal-project\">\n" +
		"                                            "+ company +"\n" +
		"                                        </td>\n" +
		"                                        <td class=\"goal-type\">\n" +
		"                                            "+ type +"\n" +
		"                                        </td>\n" +
		"                                        <td class=\"goal-date\">\n" +
		"                                            "+ task_target +"\n" +
		"                                        </td>\n" +
		"                                        <td class=\"goal-progress\">\n" +
		"                                            "+ percent +"\n" +
		"                                        </td>\n" +
		"                                        <td class=\"goal-date\">\n" +
		"                                            <time datetime=\"2020-10-24\">"+ deadline +"</time>\n" +
		"                                        </td>\n" +
		"                                        <td>"+ charger_name +"</td>\n" +
		"                                        <td class=\"text-right\">\n" +
		"                                            <div class=\"dropdown\">\n" +
		"                                                <a href=\"#\" class=\"dropdown-ellipses dropdown-toggle\" role=\"button\"\n" +
		"                                                    data-toggle=\"dropdown\" task_id="+ task_id +" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
		"                                                    <i class=\"fe fe-more-vertical\"></i>\n" +
		"                                                </a>\n" +
		"                                                <div class=\"dropdown-menu dropdown-menu-right\">\n" +
		"                                                    <a href=\"#!\" class=\"dropdown-item\">\n" +
		"                                                        查看\n" +
		"                                                    </a>\n" +
		"                                                    <a href=\"#!\" class=\"dropdown-item\">\n" +
		"                                                        修改\n" +
		"                                                    </a>\n" +
		"                                                    <a href=\"#!\" class=\"dropdown-item text-danger\">\n" +
		"                                                        删除\n" +
		"                                                    </a>\n" +
		"                                                </div>\n" +
		"                                            </div>\n" +
		"                                        </td>\n" +
		"                                    </tr>\n"
	}
	return inner_html;
}


let conversionsChart = get_echart_object("conversionsChart");


let patentDistributionChart = get_echart_object("patentDistributionChart");
//set_pie_option(patentDistributionChart, pieOption, TEST_PIE_DATA);


let completionRateChart = get_echart_object("completionRateChart");



let taskCompareChart = get_echart_object("taskCompareChart");
// set_option(taskCompareChart, lineOption, TEST_LINE_DATA);

let compareBarOption = JSON.parse(JSON.stringify(barOption));

let serverCompareChart = get_echart_object("serverCompareChart");


let length = TEST_BAR_DATA_2.series.length;
if(length <= 6){
	compareBarOption.dataZoom=undefined;
}else{
	compareBarOption.dataZoom[0].start = (6/length) * 100;
}
set_option(taskCompareChart, compareBarOption, TEST_BAR_DATA_2);



/*
* 执行各类异步请求
* */
get_different_patent_type_count();

get_this_year_target()

get_patent_number_by_type_year();

get_statistical_data_of_patent(0);

get_completion_rate()

get_service_completion()

get_service_situation()
