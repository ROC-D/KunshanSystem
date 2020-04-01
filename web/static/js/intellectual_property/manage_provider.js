
/*
点击修改按钮，显示模态框， 并将参数charger_id传入标签内
 */
$(".modify_provider").click(function () {
    $("#modify_provider_modal").modal();
    //获取本行服务商的原始信息
    let ancestor = $(this).parents("tr");
    ancestor.children();
    let company = ancestor.children().eq(0).html();
    let charger_name = ancestor.children().eq(1).html();
    let charger_tel = ancestor.children().eq(2).html();
    let charger_id = ancestor.children().eq(3).children().eq(0).attr("id");
    $("#company_modal").parent().attr("id", charger_id);
    $("#company_modal").val(company);
    $("#charger_name_modal").val(charger_name);
    $("#charger_tel_modal").val(charger_tel);
});

/*
删除服务商
 */
$(".delete_provider").click(function () {
    //获取本行服务商的原始信息
    let ancestor = $(this).parents("tr");
    let charger_id = ancestor.children().eq(3).children().eq(0).attr("id");
    data = {
        "charger_id": charger_id
    };
    delete_provider(data);
})

function delete_provider(data){
    $.ajax({
        url:'/delete_providers',
        type: 'POST',
        data: data,
        dataType:'json',
        success: function (json_data) {
            if(json_data.error){
                toggle_alert(false, json_data.errorMsg);
                return false;
            }
            toggle_alert(true, "执行成功");
        }
    })
}


$("#submit_modify_provider").click(function () {
    let company = $("#company_modal").val();
    let charger_name = $("#charger_name_modal").val();
    let charger_tel = $("#charger_tel_modal").val();
    let charger_id = $("#company_modal").parent().attr("id");
    console.log(company)
    console.log(charger_name)
    console.log(charger_tel)
    console.log(charger_id)
    data = {
        "charger_id": charger_id,
        "company": company,
        "charger_name": charger_name,
        "charger_tel": charger_tel
    };
    modify_provider(data);
    $("#modify_provider_modal").modal("hide");
});

function modify_provider(data) {
    $.ajax({
        url:'/modify_providers',
        type: 'POST',
        data: data,
        dataType:'json',
        success: function (json_data) {
            if(json_data.error){
                toggle_alert(false, json_data.errorMsg);
                return false;
            }
            toggle_alert(true, "执行成功");
        }
    })
}

