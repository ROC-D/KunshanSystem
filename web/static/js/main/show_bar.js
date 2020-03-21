let seriesLabel = {
    normal: {
        show: true,
        textBorderColor: '#333',
        textBorderWidth: 2
    }
};
//记录
CODE_TITLE_MAPPING = {};

option = {
    title:{
        show: true,
        text: undefined,
        fontSize: 18,
        fontWeight: 'bold',
        left: "center",
        //主副标题间距
        itemGap: 10,

        subtext: undefined,
        subtextStyle:{
            align: "center",
            fontSize: 14
        }
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
            //TODO:
            let code = param.name;
            let title = CODE_TITLE_MAPPING[code];
            if (title.length > 30){
                if(title.length > 300){
                    title = title.substring(0, 300) + "...";
                }

                let title_list = title.split("；");
                title = "<ul>"
                for(let i = 0; i < title_list.length; i++){
                    title += `<li>${title_list[i]}</li>`;
                }
                title += "</ul>";
            }
            else{
                title += "<br>";
            }
            let number = param.data;

            return `${code}：${title}数量：${number}`;
        },
    },
    legend: {
        type: 'plain',
        orient: 'horizontal',
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
        name: undefined
    },
    yAxis: {
        type: 'value',
        name: undefined,
    },
    series: [{
        name: undefined,
        label: seriesLabel,
        data: null,
        type: 'bar'
    }]
};
let myChart = echarts.init(document.getElementById("main"));


function setOption(json_data) {
    let counter = json_data.data
    //分开类型和数字
    let xAxis_data = [];
    let show_data = [];
    for (let index = 0; index < counter.length; index++){
        let datum = counter[index];
        xAxis_data.push(datum.code);
        show_data.push(datum.amount);
        CODE_TITLE_MAPPING[datum.code] = datum.title;
    }
    //
    option.xAxis.data = xAxis_data;
    option.series[0].data = show_data;

    if(json_data.legend !== undefined){
        // 显示图例，series[i].name 要与 legend.data 完全对应才能显示
        for(let i = 0; i < json_data.legend.length; i++){
            option.series[i].name = json_data.legend[i];
        }
        option.legend.data=json_data.legend;
        //-----
    }

    // 横纵坐标名称
    option.xAxis.name = json_data.xAxis_name;
    option.yAxis.name = json_data.yAxis_name;
    // 正副标题
    option.title.text = json_data.title;
    option.title.subtext = json_data.subtext;

    myChart.hideLoading();
    myChart.setOption(option);
}
