let myChart = echarts.init(document.getElementById("main"));

option = {
    title: {
        text: '技术生命周期',
        left: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    xAxis: {
        type: 'category',
        data: null,
    },
    yAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
        name: 'scatter',
        type: 'scatter',
        emphasis: {
            label: {
                show: true,
                position: 'left',
                color: 'blue',
                fontSize: 16
            }
        },
        data: null
    }, {
        name: 'line',
        type: 'line',
        showSymbol: false,
        smooth: true,
        data: null,
        markPoint: {
            itemStyle: {
                color: 'transparent'
            },
            label: {
                show: true,
                position: 'left',
                formatter: "hello world",
                color: '#333',
                fontSize: 14
            },
            /*
            data: [{
                coord: myRegression.points[myRegression.points.length - 1]
            }]
             */
        }
    }]
};

//为按钮绑定事件
$('#tech-btn').click(function () {
    //获取当前输入框的数据
    let keyword = $('#tech-name').val();
    if (keyword.length == 0){
        toggle_alert(false, "输入不能为空");
        return;
    }
    myChart.showLoading();
    //发起请求
    $.ajax({
        type: "get",
        url: "/ajax/estimate_tech/" + keyword,
        dataType: "json",
        success: function (json_data) {
            if (json_data['status'] != 'ok') {
                console.log('获取数据失败');
                return false;
            }
            myChart.hideLoading();
            option.title.text = keyword + '-技术生命周期';
            /*
            //添加预测
            let beginIndex = Math.round(json_data['begin']);
            let midIndex = Math.round(json_data['mid']);
            let endIndex = Math.round(json_data['end']);
            let years = json_data['years'];
            let beginYear = years[beginIndex];
            let midYear = years[midIndex];
            let endYear = years[endIndex];
            $('#desc').empty();
            $('#desc').append(`<b>${keyword}</b>技术在<b>${beginYear}</b>年进入成长期`);
            $('#desc').append(`，在<b>${midYear}</b>年进入成熟期`);
            $('#desc').append(`，在<b>${endYear}</b>年进入衰弱期`);
             */
            setOption(json_data);
        },
        error: function (error) {
        }
    });
});

function setOption(json_data) {
    //先清除原先的数据
    option.xAxis.data = null;
    //0是散点图，1是折线图
    option.series[0].data = null;
    option.series[1].data = null;

    let years = json_data['years'];
    let real_counts = json_data['real_counts'];
    let counts = json_data['counts'];
    //组合数据
    let scatter_data = [];
    let line_data = [];
    for (let index = 0; index < years.length; index++){
        scatter_data.push([index + 1, real_counts[index]]);
        line_data.push([index + 1, counts[index]]);
    }
    option.xAxis.data = years;
    option.series[0].data = scatter_data;
    option.series[1].data = line_data;

    myChart.setOption(option);
}