/*
* 定义全局变量
* */
YEAR_GOAL = {
	"patent": 150,
	"t2": 180,
	"t3": 130,
	"t4": 130
};

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
$("a[data-toggle='tab']").on("click", function (e) {
	// console.log(e.target);
	let ancestors = ['部', '大类', '小类'];
	let text = $.trim($(e.target).text());
	let depth = ancestors.indexOf(text);

	get_statistical_data_of_patent(depth);
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
			let year_list = data["year_list"];
			let patent_dict = data["patent_dict"];

			construct_patent_type(year_list, patent_dict);
			let BAR_DATA = {
				series: [
					{
						name: "发明专利",
						data: patent_dict["发明专利"], type: 'bar', barWidth: 10,
					}, {
						name: "实用新型",
						data: patent_dict["实用新型"], type: 'bar',
						barWidth: 10,
					}, {
						name: "外观设计",
						data: patent_dict["外观设计"], type: 'bar',
						barWidth: 10,
					}, {
						name: "其他专利",
						data: patent_dict["其他专利"], type: 'bar',
						barWidth: 10,
					}
				],
				xAxis: year_list,
				yAxis: "数量",
				legend: ["发明专利", "实用新型专利", "外观设计", "其他"]
			};

			set_option(conversionsChart, barOption, BAR_DATA);
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
				series.push({"value": datum.amount, "name": datum.code});
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
判断用户是否已经添加今年的目标
 */
function construct_patent_type(year_list, patent_dict){
    if(year_list[year_list.length - 1] == 2020){
        return;
    }else{
        year_list.push(2020);
        patent_dict["发明专利"].push(0);
        patent_dict["实用新型"].push(0);
        patent_dict["外观设计"].push(0);
        patent_dict["其他专利"].push(0);
    }
}

let conversionsChart = get_echart_object("conversionsChart");


let patentDistributionChart = get_echart_object("patentDistributionChart");
//set_pie_option(patentDistributionChart, pieOption, TEST_PIE_DATA);


let completionRateChart = get_echart_object("completionRateChart");
gaugeOption.series[0].data = TEST_GAUGE_DATA.series;
completionRateChart.setOption(gaugeOption);


let propertyChart = get_echart_object("propertyChart");
set_option(propertyChart, lineOption, TEST_LINE_DATA);



/*
* 执行各类异步请求
* */
get_different_patent_type_count();

get_patent_number_by_type_year();

get_statistical_data_of_patent(0);
