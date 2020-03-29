/*
* 处理各类响应事件
* */
/*
* 编辑年度目标
* */
$("#edit-year-goal").on("click", function(e){

	$("#propertyModal").modal();

	 for(let id in YEAR_GOAL){
         let value = YEAR_GOAL[id]?YEAR_GOAL[id]: 0;
         $("#".concat(id)).val(value);
 	}
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
	$.ajax({
		datatype: "json",
		type: "get",
		url: '/get_patent_number_by_type_year',
		success: function (data) {
			if (data.error){
				toggle_alert(false, data.errorMsg);
				return false;
			}
			add_this_year_target(data["year_list"], data["patent_dict"]);
			updateConversionsChart(data["year_list"], data["patent_dict"]);
		},
		error: function (error) {
			toggle_alert(false, "网络出现问题，请稍后再试");
		}
	});
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
* 根据数据更新图
* */
function updateConversionsChart(year_list, data_dict) {
	let serise = [], legend = [];
	for(let type_name in data_dict){
		serise.push({
			name: type_name,data: data_dict[type_name], type: 'bar', barWidth: 10
		});
		legend.push(type_name);
	}
	let BAR_DATA = {
		series: serise,
		xAxis: year_list,
		yAxis: "数量",
		legend: legend
	};
	set_option(conversionsChart, barOption, BAR_DATA);
}

/*
* 添加今年目标
* */
function add_this_year_target(year_list, data_dict){
    year_list.push(new Date().getFullYear());
    for(let k in dict){
    	if (data_dict.hasOwnProperty(k)){
    		data_dict[k].push(YEAR_GOAL[dict[k]]);
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
	let department_id = 1;
	if(serverCompare.hasOwnProperty(mission_type)){
		fill_data4server_compare(serverCompare[mission_type]);
		return true;
	}
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
			fill_data4server_compare(json_data["data"]);
			serverCompare[mission_type] = json_data["data"];
		},
		error: function (error) {
			console.error(error);
		}
	})
}


function fill_data4server_compare(data) {
	// 转换数据格式
	let series = [];
	let legend = [];
	for (let i = 0;i < data.length; i++){
		let datum = data[i];
		series.push({"value": datum.progress, "name": datum.company, 'title': datum.charger_name});
		legend.push(datum.company);
	}
	set_pie_option(serverCompareChart, pieOption, {"seriesName": "专利分布", "series": series, "legend": legend});
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
			let data = json_data["data"];
			//拼接执行情况中的html
			let inner_html = join_html_str(data);
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
	let inner_html = [];
	for(let i = 0; i < data.length; i++){
		let company = data[i]["company"];
		let charger_name = data[i]["charger_name"];
		let deadline = data[i]["deadline"];
		let percent = data[i]["percent"];
		let task_target = data[i]["task_target"];
		let task_id = data[i]["task_id"];
		let type = data[i]["type"];

		inner_html.push(
			`<tr><td>${company}</td><td>${type}</td><td>${task_target}</td><td>${percent}</td><td>${deadline}</td>
				<td class="charger" data-id="${data[i]['charger_id']}">${charger_name}</td>
				<td class="text-right">
				   <div class="dropdown">
						<a href="#" class="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<i class="fe fe-more-vertical"></i>
						</a>
						<div class="dropdown-menu dropdown-menu-right" task_id="${task_id}">
							<a href="#!" class="dropdown-item">
								查看
							</a>
							<a href="#!" class="dropdown-item modify-menu">
								修改
							</a>
							<a href="#!" class="dropdown-item text-danger delete-menu">
								删除
							</a>
						</div>
					</div>
				</td>
			</tr>
`);
	}
	return inner_html.join("");
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

get_this_year_target();

get_patent_number_by_type_year();

get_statistical_data_of_patent(0);

get_completion_rate();

get_service_completion();

get_service_situation();
