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


function get_patent_number_by_type_year(){

	$.ajax({
		datatype: "json",
		type: "get",
		url: '/get_patent_number_by_type_year',
		success: function (data) {
			let year_list = data["year_list"];
			let patent_dict = data["patent_dict"];

			construct_patent_type(year_list, patent_dict);
			let BAR_DATA = { series: [
					{   name:"发明专利",
						data: patent_dict["发明专利"], type: 'bar',barWidth: 10,
					},{ name: "实用新型",
						data: patent_dict["实用新型"], type: 'bar',
						barWidth: 10,
					},{ name: "外观设计",
						data: patent_dict["外观设计"], type: 'bar',
						barWidth: 10,
					},{
						name: "其他专利",
						data: patent_dict["其他专利"], type: 'bar',
						barWidth: 10,
					}
				],
				xAxis: year_list,
				yAxis: "数量",
				legend: ["发明专利", "实用新型专利",  "外观设计", "其他"]
			};

			setOption(conversionsChart, barOption, BAR_DATA);
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

let conversionsChart = getEchartObj("conversionsChart");


let patentDistributionChart = getEchartObj("patentDistributionChart");
setPieOption(patentDistributionChart, pieOption, TEST_PIE_DATA);


let completionRateChart = getEchartObj("completionRateChart");
gaugeOption.series[0].data = TEST_GAUGE_DATA.series;
completionRateChart.setOption(gaugeOption);


let propertyChart = getEchartObj("propertyChart");
setOption(propertyChart, lineOption, TEST_LINE_DATA);



/*
* 执行各类异步请求
* */
get_different_patent_type_count();
get_patent_number_by_type_year();
