//记录值
var SERVERS = new Map();
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
    $('#projects tr').remove();
    //获取当前选中的select的值
    let value = $('#servers').val();
    if (value in SERVERS)
    {
        changeProject(SERVERS[value]);
        return
    }
    $.ajax({
        type: "get",
        url: "/spider/list_projects/" + value,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'ok'){
                console.log(json_data['msg']);
                return false;
            }
            let projects = json_data.projects;
            SERVERS[value] = projects;
            changeProject(projects);
        },
        error: function (error) {
        }
    });
}

/**
 * 在table中添加记录
 * @param projects 服务器的名称
 */
function changeProject(projects) {
    $('#count').text(projects.length);

    for (let i = 0; i < projects.length; i++){
        let project_name = projects[i];
        let number = i + 1;

        let insert_html =
            `<tr id="${project_name}">
            <td>${number}</td>
            <td>${project_name}</td>
            <td>
                <button type="submit" class="btn btn-danger" onclick="deleteProject(${project_name});">删除</button>
            </td>
         </trid>`;
        let $tbody = $('#projects');
        $tbody.append(insert_html);
    }
}

function deleteProject($tr) {
    if (confirm('确定删除?')){
        let selectedValue = $('#servers').val();
        let project_name = $tr.id;
        $.ajax({
            type: "post",
            url: "/spider/del_project/" + selectedValue + "/" + project_name,
            dataType: "json",
            success: function (json_data) {
                if (json_data['status'] != 'ok'){
                    console.log(json_data['msg']);
                    return false;
                }
                //TODO: 改为js弹出框
                console.log('删除成功');
                delete SERVERS[selectedValue];
                $tr.remove();
                $('#count').text(parseInt($('#count').text()) - 1);
            },
            error: function (error) {
            }
        });
    }
}