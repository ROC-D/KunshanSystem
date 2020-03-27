
TEST_LINE_DATA = {
    series: [
        {   name:"三螺旋大数据科技(昆山)有限公司",
            data: [23, 24, 25, 26, 27, 28, 29], type: 'line',
            smooth: true, show:true,
            lineStyle:{width:3}
        },
        {   name:"三螺旋大数据科技(华南)有限公司",
            data: [33, 33, 33, 35, 37, 39, 40], type: 'line', 
            smooth: true, show:true,
            lineStyle:{width:3}
        },
        {   name:"三螺旋大数据科技(华北)有限公司",
            data: [13, 15, 18, 18, 19, 21, 22], type: 'line', 
            smooth: true, show:true,
            lineStyle:{width:3}
        },
        {   name:"三螺旋大数据科技(四川)有限公司",
            data: [3, 4, 4, 5, 7, 8, 9], type: 'line', 
            smooth: true, show:true,
            lineStyle:{width:3}
        },
        {   name:"三螺旋大数据科技(陕西)有限公司",
            data: [21, 23, 26, 29, 31, 38, 49], type: 'line', 
            smooth: true, show:true,
            lineStyle:{width:3}
        },
    ],
    legend:["三螺旋大数据科技(昆山)有限公司", "三螺旋大数据科技(华南)有限公司","三螺旋大数据科技(华北)有限公司","三螺旋大数据科技(四川)有限公司", "三螺旋大数据科技(陕西)有限公司"],
    xAxis: ["3/20", "3/21", "3/22", "3/23", "3/24", "3/25", "3/26"],
    yAxis: "百分比",
};


TEST_PIE_DATA = {
    seriesName: "专利分布",
    series: [
        {value: 335, name: 'H'},
        {value: 310, name: 'B'},
        {value: 310, name: 'D'},
        {value: 310, name: 'C'},
        {value: 310, name: 'A'},
        {value: 310, name: 'E'},
        {value: 310, name: 'F'},
        {value: 310, name: 'G'},
        {value: 135, name: '其他'}
    ],
    legend:["H", "B", "D", "C", "A", "E", "F", "G", "其他" ]
};

TEST_PIE_DATA_2 = {
    seriesName: "知识产权类型",
    series: [
        {value: 11774, name: '发明专利'},
        {value: 11514, name: '实用新型专利'},
        {value: 6584, name: "外观设计"},
        {value: 13500, name: '其他'}
    ],
    legend:["发明专利", "实用新型专利", "外观设计", "其他" ]
};


TEST_BAR_DATA = { series: [
        {   name:"发明专利",
            data: [82, 120, 132, 141, 150], type: 'bar', 
            barWidth: 10,
        },{ name: "实用新型专利",
            data: [93, 130, 163,134, 180], type: 'bar', 
            barWidth: 10,
        },{ name: "外观设计",
            data: [91, 101, 111, 124, 130], type: 'bar', 
            barWidth: 10,
        },{
            name: "其他",
            data: [102, 112, 115, 125, 130], type: 'bar', 
            barWidth: 10,
        }
    ],
    xAxis: [ 2016, 2017, 2018, 2019, 2020],
    yAxisName: "数量",
    legend: ["发明专利", "实用新型专利",  "外观设计", "其他"]
};


TEST_BAR_DATA_2  = {
    series: [
        {   name:"2019",
            data: [50, 93, 56, 65], type: 'bar',
            barWidth: 10,
        },
        {   name:"2020",
            data: [42, 52, 62, 11], type: 'bar',
            barWidth: 10,
        },
    ],
    legend: [ "2019", "2020"],
    xAxis: ["1月", "2月", "3月", "4月"],
    yAxis: "数量",
};



TEST_GAUGE_DATA = {
    series: [{value: 10.5, name: "完成率"}]
}