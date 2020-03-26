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