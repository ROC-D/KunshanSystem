var seriesLabel = {
    normal: {
        show: true,
        textBorderColor: '#333',
        textBorderWidth: 2
    }
};
//记录
CODE_TITLE_MAPPING = {};

option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (params) {
            let param = params[0];
            if (param.seriesType != "bar")
                return;
            //TODO:
            let code = param.name;
            let title = CODE_TITLE_MAPPING[code];
            if (title.length > 30){
                title = title.substring(0, 30) + "...";
            }
            let number = param.data;

            return `${code}：${title}<br/>数量：${number}`;
        },
    },
    legend: {
        type: 'plain',
        orient: 'horizontal',
        //right: 10,
        left: '5%',
        top: 20,
        bottom: 20,
        data: ["A", "B", "C", "D", "E", "F", "G", "H"],
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
let myChart = echarts.init(document.getElementById("main"));


function setOption(counter) {
    //分开类型和数字
    let xAxis = [];
    let data = [];
    for (let index = 0; index < counter.length; index++){
        let datum = counter[index];
        xAxis.push(datum.code);
        data.push(datum.amount);
        CODE_TITLE_MAPPING[datum.code] = datum.title;
    }
    option.xAxis.data = xAxis;
    option.series[0].data = data;
    myChart.hideLoading();
    myChart.setOption(option);
}
