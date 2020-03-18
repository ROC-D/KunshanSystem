//为select绑定事件
$('#server').change(changeServer);
$('#project').change(changeProject);
$('#version').change(changeVersion);
//第一次进入时先请求一次
changeServer();

/**
 * 改变projects的option
 * @param projects
 */
function setProjects(projects) {
    //先移除所有的选项
    $('#project option').remove();

    for (let index = 0; index < projects.length; index++){
        let project_name = projects[index];
        $('#project').append(`<option value="${project_name}">${project_name}</option>`)
    }
    //默认不选中
    if (projects.length > 0){
        $('#project').val("");
    }
}

function setVersions(versions) {
    //先移除所有的选项
    $('#version option').remove();

    for (let index = 0; index < versions.length; index++){
        let version = versions[index];
        $('#version').append(`<option value="${version}">${version}</option>`)
    }
    //默认不选中
    if (versions.length > 0){
        $('#version').val("");
    }
}

function setSpiders(spiders) {
    //先移除所有的选项
    $('#spider option').remove();

    for (let index = 0; index < spiders.length; index++){
        let spider = spiders[index];
        $('#spider').append(`<option value="${spider}">${spider}</option>`)
    }
    //默认不选中
    if (spiders.length > 0){
        $('#spider').val("");
    }
}

function changeServer() {
    let value=$(this).children('option:selected').val();
    if (typeof(value) == "undefined")
        value = 0;
    //清空其他select的选中
    $('#project option').remove();
    $('#version option').remove();
    $('#spider option').remove();

    $.ajax({
        type: "get",
        url: "/spider/list_projects/" + value,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'ok') {
                console.log(json_data['msg']);
                return false;
            }
            setProjects(json_data['projects']);
        },
        error: function (error) {
        }
    });
}

function changeProject() {
    //获取选中的服务器
    let selectedServer = $('#server option:selected').val();
    let selectedProject=$(this).children('option:selected').val();
    //清空其他select的选中
    $('#version option').remove();
    $('#spider option').remove();

    $.ajax({
        type: "get",
        url: "/spider/list_versions/" + selectedServer + "/" + selectedProject,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'ok') {
                console.log(json_data['msg']);
                return false;
            }
            setVersions(json_data['versions']);
        },
        error: function (error) {
        }
    });
}

function changeVersion() {
    //获取选中的服务器
    let selectedServer = $('#server option:selected').val();
    let selectedProject = $('#project option:selected').val();
    let selectedVersion = $(this).children('option:selected').val();

    //清空其他select的选中
    $('#spider option').remove();

    $.ajax({
        type: "get",
        url: "/spider/list_spiders/" + selectedServer + "/" + selectedProject + "/" + selectedVersion,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'ok') {
                console.log(json_data['msg']);
                return false;
            }
            setSpiders(json_data['spiders']);
        },
        error: function (error) {
        }
    });
}