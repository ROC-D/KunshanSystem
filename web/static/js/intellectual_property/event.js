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


/*
* 执行各类异步请求
* */
get_different_patent_type_count()


/*
* 定义各类异步请求
* */

function get_different_patent_type_count() {
	$.ajax({
		url: "/get_different_patent_type_count",
		dataType: "json",
		success: function (data) {
			if(data.error){
				console.log(data.errorMsg);
			}
			//	渲染到页面
			for(let key in data){
				//
				$("#count_of_".concat(key)).text(data[key]);
			}
		},
		error: function (error) {
			console.error("get_different_patent_type_count error", error);
		}
	})
}

//为显示IPC下的专利的饼图添加事件
$("a[data-toggle='tab']").on("click", function (e) {
	console.log(e.target);
	let ancestors = ['部', '大类', '小类'];
	let text = $.trim($(e.target).text());
	let depth = ancestors.indexOf(text);

	getStatisticalDataOfPatent(depth);
});

function getStatisticalDataOfPatent(depth) {
	//发送请求
	$.ajax({
		type: "get",
		url: "/count_patents_with_ipc/" + depth,
		dataType: "json",
		success: function (json_data) {
			if (json_data['status'] != 'ok') {
				toggle_alert(false, json_data['msg']);
				return false;
			}
			//转换数据格式
			let data = json_data['data'];
			let series = [];
			let legend = [];
			for (let i = 0;i < data.length; i++){
				let datum = data[i];
				series.push({"value": datum.amount, "name": datum.code});
				legend.push(datum.code);
			}
			setPieOption(patentDistributionChart, pieOption, {"seriesName": "专利分布", "series": series, "legend": legend});
		},
		error: function (error) {
			console.error(error);
		}
	});
}
getStatisticalDataOfPatent(0);
