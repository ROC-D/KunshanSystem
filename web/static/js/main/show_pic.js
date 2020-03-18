let myChart = echarts.init(document.getElementById("main"));
myChart.showLoading();
//获取当前选中的ipc
let data = {
    "area": "昆山",
    "school": "东南大学",
    };
if (typeof $('#cur_ipc').val() != "undefined"){
    data['parent_id'] = parseInt($('#cur_ipc').val());
}
//发送请求
$.ajax({
    type: "get",
    url: "/ajax/area_school_info",
    data: data,
    dataType: "json",
    success: function (json_data) {
        if (json_data['status'] != 'ok') {
            console.log('获取数据失败');
            return false;
        }
        setOption(json_data);
    },
    error: function (error) {
    }
});

function setOption(json_data) {
    let patents = json_data.patents;
    let legendData = [];
    let seriesData = [];
    for (let index = 0; index < patents.length; index++){
        let patent = patents[index];
        legendData.push(patent.code);
        seriesData.push({
            "name": patent.code,
            "value": patent.amount,
            "id": patent.id,
            "is_down": patent.is_down,
        });
        $('#description').append(`<li class="list-group-item">
                    ${patent.code}:${patent.title}
                    <span class="badge badge-primary float-right">${patent.amount}</span>
               </li>`)
    }
    option.legend.data = legendData;
    option.series[0].data = seriesData;
    myChart.hideLoading();
    myChart.setOption(option);
}

option = {
    title: {
        text: '昆山开发区专利数量统计',
        subtext: '统计',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        //right: 10,
        left: '5%',
        top: 20,
        bottom: 20,
        //data: data.legendData,
        //selected: data.selected
    },
    series: [
        {
            name: '专利',
            type: 'pie',
            radius: '55%',
            center: ['55%', '50%'],
            //data: data.seriesData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

//添加事件
m=myChart.on('click', function (params) {
    console.log(params);
    //获取到绑定的数据
    let data = params.data;
    if (data.is_down == false){
        console.log(data);
        toggle_alert(false, "不能继续下钻");
    }else{
        //TODO:加载URL
        window.location = '/pie/' + data.id;
    }
});
