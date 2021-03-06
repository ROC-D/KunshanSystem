myChart = echarts.init(document.getElementById("main"));
myChart.showLoading();

//获取当前选中的层级
let data = {
    "town": "开发区",
    "level" : 0
}

if (typeof $('#cur_level').val() != "undefined"){
    data['level'] = parseInt($('#cur_level').attr("value"));
    // data['type'] = $('#cur_level').text().trim();
    data['type'] = $('li.dropdown>a').text().trim();
}

if (typeof $('#cur_level').data("id") != "undefined"){
    data['id'] = parseInt($('#cur_level').data("id"));
}

//发送请求
$.ajax({
    type: "get",
    url: "/pie_data",
    data: data,
    dataType: "json",
    success: function (json_data) {
        console.log(data);
        if (json_data['status'] != 'ok') {
            console.log('获取数据失败', json_data);
            return false;
        }
        if(json_data['bar_graph'] === true){
            setBarOption(json_data);
        }else{
            setPieOption(json_data);
        }
    },
    error: function (error) {
        console.error(error)
    }
});

function setPieOption(json_data) {
    console.log(json_data);
    let pie_data = json_data.pie_data;

    let legendData = [];
    let seriesData = [];

    for (let i = 0; i < pie_data.length; i++){
        let item = pie_data[i];
        legendData.push(item.key);
        seriesData.push({
            "name": item.key,
            "value": item.value,
            "click2": item.click2,
            "property_type": item.key
        });
        $('#description').append(`<li class="list-group-item">
                    ${item.key}
                    <span class="badge badge-primary float-right">${item.value}</span>
               </li>`)
    }
    pieOption.legend.data = legendData;
    pieOption.series[0].data = seriesData;
    console.log(seriesData);
    myChart.hideLoading();
    myChart.setOption(pieOption);
}

let pieOption = {
    title: {
        text: '',
        subtext:"",
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

//---------------
NAME_ID_MAPPING = []
seriesLabel = {
    normal: {
        show: true,
        textBorderColor: '#333',
        textBorderWidth: 2
    }
};
function setBarOption(json_data){

    //分开类型和数字
    let xAxis = [];
    let data = [];
    let bar_info = json_data.data;
    // console.log(json_data)
    for (let i = 0; i < bar_info.length; i++){
        let datum = bar_info[i];
        xAxis.push(datum.name);
        data.push(datum.num);
        NAME_ID_MAPPING[datum.name] = datum.id;
    }
    barOption.xAxis.data = xAxis;
    barOption.series[0].data = data;
    barOption.legend.data = xAxis;

    // 横纵坐标名称
    barOption.xAxis.name = json_data.xAxis_name;
    barOption.yAxis.name = json_data.yAxis_name;
    // 正副标题
    barOption.title.text = json_data.title;
    barOption.title.subtext = json_data.subtext;

    myChart.hideLoading();
    myChart.setOption(barOption);
}

barOption = {
    title: {
      left: "center"
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (params) {
            let param = params[0];
            if (param.seriesType != "bar")
                return;

            return `${param.name}<br/>数量：${param.data}`;
        },
    },
    legend: {
        type: 'plain',
        // orient: 'horizontal',
        //right: 10,
        left: '5%',
        top: 20,
        bottom: 20,
        data: [],
        show: true,
        //selected: data.selected
    },
    xAxis: {
        type: 'category',
        data: null,
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        label: seriesLabel,
        data: null,
        type: 'bar'
    }]
};

//添加事件
myChart.on('click', function (params) {
    // console.log(params);
    //获取到绑定的数据
    if(params.seriesType == "bar"){
        let com_id = NAME_ID_MAPPING[params.name];

        let url = `/pie?level=3&id=${com_id}&name=${params.name}`;

        // console.log(url);
        window.location = url;
    }
});
