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
            let code = param.name;
            let title = CODE_TITLE_MAPPING[code];
            if (title.length > 50){

                let title_list = title.split("；");
                title = "<ul>";
                for(let i = 0; i < title_list.length; i++){
                    if(title_list[i].length > 30){
                        title_list[i] = title_list[i].substring(0, 30) + "...";
                    }
                    title += `<li>${title_list[i]}</li>`;
                }
                title += "</ul>";
            }
            else{
                title += "<br>";
            }
            let number = param.data;
            let enterprise_number = params[1].data;

            return `${code}：${title}工程师数量：${number}<br/>企业数量：${enterprise_number}`;
        },
    },
    legend: {
        type: 'plain',
        orient: 'horizontal',
        //right: 10,
        left: '5%',
        top: 0,
        bottom: 20,
        data: ['工程师', '企业'],
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
    series: [
        {
            name: '工程师',
            label: seriesLabel,
            data: null,
            type: 'bar'
        },
        {
            name: '企业',
            label: seriesLabel,
            data: null,
            type: 'bar'
        },
    ]
};
let myChart = echarts.init(document.getElementById("main"));


function setOption(json_data) {
    //分开类型和数字
    let xAxis_data = [];
    let enterprises = [];
    let engineers = [];
    for (let index = 0; index < json_data.enterprises.length; index++){
        let enterprise = json_data.enterprises[index];
        xAxis_data.push(enterprise.code);
        enterprises.push(enterprise.number);
        engineers.push(json_data.engineers[index].number);
        CODE_TITLE_MAPPING[enterprise.code] = enterprise.title;
    }
    //
    option.xAxis.data = xAxis_data;
    option.series[0].data = engineers;
    option.series[1].data = enterprises;
    /*
    if(json_data.legend !== undefined){
        // 显示图例，series[i].name 要与 legend.data 完全对应才能显示
        for(let i = 0; i < json_data.legend.length; i++){
            option.series[i].name = json_data.legend[i];
        }
        option.legend.data=json_data.legend;
        //-----
    }
     */

    // 横纵坐标名称
    option.xAxis.name = json_data.xAxis_name;
    option.yAxis.name = json_data.yAxis_name;
    // 正副标题
    option.title.text = json_data.title;
    option.title.subtext = json_data.subtext;
    myChart.hideLoading();
    myChart.setOption(option);
}
