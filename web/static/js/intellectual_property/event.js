
$("#edit-year-goal").on("click", function(e){

	$("#propertyModal").modal();

	for(let id in YEAR_GOAL){
		let value = YEAR_GOAL[id]?YEAR_GOAL[id]: 0;
		$("#".concat(id)).val(value);
	}
});

$("#add-task").on("click", function(e){
	$("#implementModal").modal();
})