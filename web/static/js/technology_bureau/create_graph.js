COLOR_LIST = ["#2c7be5","#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", 
            "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", 
            "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];

YEAR_GOAL = {
	"patent": 150,
	"t2": 180,
	"t3": 130,
	"t4": 130
}

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
    color: COLOR_LIST
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
        },
        // formatter: function (param) {
        //     // console.log(param);
        //     result = `${param[0].name}`;
        //     for(let i = 0; i < param.length; i++){
        //         result += `<br>${param[i].seriesName}, 完成度: ${param[i].data}%`;
        //     }
        //     return result;
        // }
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


function setOption(chart, option, data={}){
    option.title.text=data.title;
    option.legend.data=data.legend;
    option.xAxis.data=data.xAxis;
    option.yAxis.name=data.yAxis;
    option.series=data.series;

    chart.setOption(option);
}


function setPieOption(chart, option, data={}) {
    option.legend.data = data.legend;

    if(data.seriesName){
        option.series[0].name = data.seriesName;
    }
    option.series[0].data = data.series;
    if(data.color){
        option.color = data.color;
    }

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



let conversionsChart = getEchartObj("conversionsChart");
setOption(conversionsChart, barOption, TEST_BAR_DATA);


let trafficChart = getEchartObj("trafficChart");
setPieOption(trafficChart, pieOption, TEST_PIE_DATA);


let propertyTypeChart = getEchartObj("propertyTypeChart");
setPieOption(propertyTypeChart, pieOption, TEST_PIE_DATA_2);



let propertyChart = getEchartObj("propertyChart");
setOption(propertyChart, lineOption, TEST_LINE_DATA);