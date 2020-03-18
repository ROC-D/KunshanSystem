let lineChart = echarts.init(document.getElementById("line"));
let barChart = echarts.init(document.getElementById("bar"));
lineChart.showLoading();

lineOption = {
    title: {
        text: '专利申请数量-年份折线图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: null,
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: null,
    },
    yAxis: {
        type: 'value'
    },
    series: [
    ]
};

//柱状图
barOption = {
    legend: {
        data: null
    },
    xAxis: {
        type: 'category',
        data: null,
    },
    yAxis: {
        type: 'value'
    },
    series: [
    ]
};

//TODO:发送请求 暂时指定数据
$.ajax({
    type: "get",
    url: "/ajax/count_patent_year",
    data: {
        'applicant': ['三一矿机有限公司', '三一重机有限公司']
    },
    dataType: "json",
    success: function (json_data) {
        lineChart.hideLoading();
        setLineOption(json_data);
    },
    error: function (error) {
    }
});
//TODO:发送请求 暂时指定数据
$.ajax({
    type: "get",
    url: "/ajax/count_patent_ipc",
    data: {
        'applicant': ['三一矿机有限公司', '三一重机有限公司']
    },
    dataType: "json",
    success: function (json_data) {
        barChart.hideLoading();
        setBarOption(json_data);
    },
    error: function (error) {
    }
});

function setLineOption(json_data) {
    //横轴数据
    let years = json_data.years;
    let data = json_data.data;
    let legends = [];
    lineOption.xAxis.data = years;

    for (let index = 0; index < data.length; index++){
        let applicant = data[index];
        lineOption.series.push({
            'name': applicant.name,
            'type': 'line',
            'stack': '总量',
            'data': applicant.data,
        });
        legends.push(applicant.name);
    }
    lineOption.legend.data = legends;
    lineChart.setOption(lineOption);
}

function setBarOption(json_data) {
    //横轴数据
    let xAxis = json_data.applicant;
    let cls_numbers = json_data.cls_number;
    let data = json_data.data;

    for (let i = 0; i < cls_numbers.length; i++){
        let cls_number = cls_numbers[i];
        let array = [];
        for (let j = 0; j < data.length; j++){
            let applicant = data[j];
            if (applicant.data.hasOwnProperty(cls_number))
                array.push(applicant.data[cls_number]);
            else
                array.push(0);
        }
        barOption.series.push({
            name: cls_number,
            data: array,
            type: "bar",
        });
    }
    barOption.legend.data = cls_numbers;
    barOption.xAxis.data = xAxis;
    debugger
    barChart.setOption(barOption);
}

