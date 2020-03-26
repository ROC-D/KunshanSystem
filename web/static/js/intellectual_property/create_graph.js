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

/*
用户提交知识产权目标更改时触发该点击事件
 */
//TODO:
// var submit_update = document.getElementById("submit_update");
// submit_update.addEventListener('click', function () {
//         t1_number = document.getElementById("patent");
//         t2_number = document.getElementById("t2");
//         t3_number = document.getElementById("t3");
//         t4_number = document.getElementById("t4");
//         // TODO: 将用户更新的目标数据写回数据库
//         len = patent_dict["发明专利"];
//         patent_dict["发明专利"][len-1] = t1_number;
//         patent_dict["实用新型"][len-1] = t1_number;
//         patent_dict["外观设计"][len-1] = t1_number;
//         patent_dict["其他专利"][len-1] = t1_number;
//
//         //重新加载Bar的数据
//         setOption(conversionsChart, barOption, BAR_DATA);
//
//     }
//
// )




let year_list;
let patent_dict;
let BAR_DATA;
console.log("ready");

$.ajax({
    datatype: "json",
    type: "get",
    url: '/get_patent_number_by_type_year',
    success: function (data) {
        year_list = data["year_list"];
        patent_dict = data["patent_dict"];


        console.log();
        construct_patent_type(year_list, patent_dict);
        BAR_DATA = { series: [
                {   name:"发明专利",
                    data: patent_dict["发明专利"], type: 'bar',
                    barWidth: 10,
                },{ name: "实用新型",
                    data: patent_dict["实用新型"], type: 'bar',
                    barWidth: 10,
                },{ name: "外观设计",
                    data: patent_dict["外观设计"], type: 'bar',
                    barWidth: 10,
                },{
                    name: "其他专利",
                    data: patent_dict["其他专利"], type: 'bar',
                    barWidth: 10,
                }
            ],
            xAxis: year_list,
            yAxis: "数量",
            legend: ["发明专利", "实用新型专利",  "外观设计", "其他"]
        };

        setOption(conversionsChart, barOption, BAR_DATA);
    }
})



/*
判断用户是否已经添加今年的目标
 */
function construct_patent_type(year_list, patent_dict){
    if(year_list[year_list.length - 1] == 2020){
        return;
    }else{
        year_list.push(2020);
        patent_dict["发明专利"].push(0);
        patent_dict["实用新型"].push(0);
        patent_dict["外观设计"].push(0);
        patent_dict["其他专利"].push(0);
    }
}

let conversionsChart = getEchartObj("conversionsChart");


let patentDistributionChart = getEchartObj("patentDistributionChart");
//setPieOption(patentDistributionChart, pieOption, TEST_PIE_DATA);


let completionRateChart = getEchartObj("completionRateChart");
gaugeOption.series[0].data = TEST_GAUGE_DATA.series;
completionRateChart.setOption(gaugeOption);



let propertyChart = getEchartObj("propertyChart");
setOption(propertyChart, lineOption, TEST_LINE_DATA);