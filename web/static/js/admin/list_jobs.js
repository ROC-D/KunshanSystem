//第一次直接请求
changeSelectCallback();

//为Scrapyd服务器单选框绑定事件: 发送请求给服务器，并获取项目
$('#servers').change(function () {
    let value=$(this).children('option:selected').val();
    //发送请求
    $.ajax({
        type: "post",
        url: "/spider/set_server_index",
        data: {'index': value},
        dataType: "json",
        success: function (json_data) {
            changeSelectCallback();
        },
        error: function (error) {
        }
    });
});

function changeSelectCallback() {
    $('#jobs tr').remove();
    //获取当前选中的select的值
    let selectValue = $('#servers').val();
    $.ajax({
        type: "get",
        url: "/spider/list_projects/" + selectValue,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'ok'){
                console.log(json_data['msg']);
                return false;
            }
            let projects = json_data['projects'];
            changeJobs(projects);
        },
        error: function (error) {
        }
    });
}

/**
 * 在table中添加记录
 * @param projects 服务器的名称
 */
function changeJobs(projects) {
    let jobs = [];
    let selectedValue = $('#servers').val();
    for (let i = 0 ; i < projects.length; i++){
        let project_name = projects[i];

        $.ajax({
            type: "get",
            url: "/spider/list_jobs/" + selectedValue + "/" + project_name,
            dataType: "json",
            success: function (json_data) {
                if (json_data['status'] != 'ok'){
                    console.log(json_data['msg']);
                    return false;
                }
                let keys = ["pending", "running", "finished"];
                for (let j = 0; j < keys.length; j++){
                    let key = keys[j];
                    let array = json_data[key];

                    for (let k = 0; k < array.length; k++){
                        let job = array[k];
                        job['project'] = project_name;
                        job['status'] = key;
                        jobs.push(job);
                    }
                }
                //是否请求完成
                if (i == projects.length - 1){
                    setJobs(jobs);
                }
            },
            error: function (error) {
            }
        });
    }
}

function setJobs(jobs) {
    $('#jobs tr').remove();
    $('#count').text(jobs.length);
    for (let i = 0; i < jobs.length; i++){
        let job = jobs[i];
        let number = i + 1;
        let job_id = job['id'];
        let project = job['project'];
        let spider = job['spider'];
        let status = job['status'];
        //获取日志的URL
        let scrapyd_url = $('#servers option[value="0"]').text();
        let log_url = `${scrapyd_url}logs/${project}/${spider}/${job_id}.log`;
        //确定颜色
        let color = 'info';
        if (status == 'running')
            color = 'primary';
        else if (status == 'pending')
            color = 'warning';

        //TODO: 缺少start_time和end_time
        let insert_html =
            `<tr id="${job_id}">
            <td>${number}</td>
            <td>${project}</td>
            <td>${spider}</td>
            <td><span class="badge badge-${color}">${status}</span></td>
            <td><a href="${log_url}">Logs</a> </td>
            <td>
                <button type="button" class="btn btn-danger" onclick="">TODO</button>
            </td>
         </tr>`;
        let $tbody = $('#jobs');
        $tbody.append(insert_html);
    }
}

