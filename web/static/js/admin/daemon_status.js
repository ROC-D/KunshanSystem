$.ajax({
    type: "get",
    url: "/spider/daemon_status",
    dataType: "json",
    success: function (array) {
        $('#count').text(array.length);
        for (let i = 0; i < array.length; i++){
            insert_daemon_status(i + 1, array[i]);
        }
    },
    error: function (error) {
    }
});


/**
 * 在table中添加记录
 * @param number 序号
 * @param datum 单个服务器名称
 */
function insert_daemon_status(number, datum) {
    let _class = null;
    let pending = 0;
    let running = 0;
    let finished = 0;
    if (datum.status == "ok"){
        _class = "text-success";
        pending = datum.pending;
        running = datum.running;
        finished = datum.finished;
    }else {
        _class = "text-danger";
    }
    let insert_html =
        `<tr>
            <td>${number}</td>
            <td><a href="${datum.server}">${datum.server}</a></td>
            <td>${pending}</td>
            <td>${running}</td>
            <td>${finished}</td>
            <td class="${_class}">${datum.status}</td>
         </tr>`;
    let $tbody = $('#status');
    $tbody.append(insert_html);
}
