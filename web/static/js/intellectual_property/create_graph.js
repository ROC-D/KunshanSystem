COLOR_LIST = ["#2c7be5","#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b",
            "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", 
            "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];

YEAR_GOAL = {
	"patent": 150,
	"t2": 180,
	"t3": 130,
	"t4": 130
};

barOption = {
    title:{
        left: "center",
        show: true
    },
    legend:{
        type: "scroll",
        data:[],
        left:"center",
        itemGap: 20,
        bottom: 10
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function (param) {

            result = `${param[0].name}年`;
            for(let i = 0; i < param.length; i++){
                result += `<br>${param[i].seriesName}: ${param[i].data}件`;
            }

            return result;
        }
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    itemStyle:{
        barBorderRadius: 5,
    },
    series: [],
    color: COLOR_LIST,
    dataZoom: [{
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        left: '9%',
        minSpan: 30,
        bottom: 5,
        height: 10,
        start: 80,
        end: 100 //初始化滚动条
    }],
};


lineOption = {
    title:{
        left: "center",
        show: true
    },
    legend:{
        type: "scroll",
        data:[],
        left:"center",
        itemGap: 20,
        bottom: 10
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        boundaryGap: true
    },
    yAxis: {
        type: 'value'
    },
    itemStyle:{
        barBorderRadius: 5,
    },
    series: [],
    color: COLOR_LIST
};



pieOption = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        type: "scroll",
        bottom: 10,
        data: []
    },
    // color:["#2c7be5","#a6c5f7","#d2ddec"],
    color: COLOR_LIST,

    series: [
        {
            name: "",
            type: 'pie',
            radius: ['60%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '20',
                    fontWeight: 'bold'
                }                 
            },
            labelLine: {
                show: false
            },
            data: []
        }
    ]
};


gaugeOption = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
        {
            name: '业务指标',
            type: 'gauge',
            detail: {formatter: '{value}%'},
            data: [{value: 10.5, name: '完成率'}],
            axisLine:{
                lineStyle:{
                    color: [[0.2, "#fdae6b"], [0.8, "#2c7be5"], [1, '#31a354']],
                    width: 10,
                    shadowColor: '#fff', //默认透明: 10
                }
            },
            splitLine: {           // 分隔线
                length: 10,         // 属性length控制线长
            }
        }
    ],

};

function setOption(chart, option, data={}){
    chart.showLoading();
    option.title.text=data.title;
    option.legend.data=data.legend;
    option.xAxis.data=data.xAxis;
    option.yAxis.name=data.yAxis;
    option.series=data.series;

    chart.hideLoading();
    chart.setOption(option);
}


function setPieOption(chart, option, data={}) {
    chart.showLoading();
    option.legend.data = data.legend;

    if(data.seriesName){
        option.series[0].name = data.seriesName;
    }
    option.series[0].data = data.series;
    if(data.color){
        option.color = data.color;
    }
    chart.hideLoading();
    chart.setOption(option);
}


function setEchartsW_H(id) {
    let elem = document.getElementById(id);
    elem.style.width = elem.parentElement.clientWidth + "px";
    elem.style.height = elem.parentElement.clientHeight + "px";
    return elem;
}


function getEchartObj(id) {
    let elem = setEchartsW_H(id);
    return echarts.init(elem);
}
