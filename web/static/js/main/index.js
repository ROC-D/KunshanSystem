let myChart = echarts.init(document.getElementById("main"));

option = {
    title: {
        text: "TSNE降维到2的结果"
    },
    tooltip: {},
    toolbox: {
        left: 'center',
        feature: {
            dataZoom: {}
        }
    },
    legend: {
        orient: 'vertical',
        right: 10
    },
    xAxis: [{
    }],
    yAxis: [{
    }],
    dataZoom: [{
        type: 'inside'
    },{
        type: 'inside',
        orient: 'vertical',
    }],
    animation: false,
    series: []
};

myChart.showLoading();

$.ajax({
        type: "get",
        url: "/ajax/get_data",
        dataType: "json",
        success: function (array) {
            myChart.hideLoading();
            for (let i = 0; i < array.length; i++){
                console.log(array[i]);
                option.series.push({
                    //name: 'A' + i,
                    type: 'scatter',
                    data: array[i],
                    dimensions: ['x', 'y'],
                    symbolSize: 5,
                    large: true
                })
            }
            myChart.setOption(option);
        },
        error: function (error) {
            myChart.hideLoading();
        }
    });