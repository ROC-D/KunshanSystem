$('#departments').change(function () {
    let department_id = parseInt(this.value);
    $('#tasks').find('option').remove();
    //从任务中筛选
    for (let i = 0; i < TASKS.length; i++){
        let task = TASKS[i];
        if (task.department_id == department_id){
            $('#tasks').append(`<option ${task.type}>${task.type}</option>`);
        }
    }
});