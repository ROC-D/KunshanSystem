import unittest
from web import create_app
from web.extensions import db


class TestCaseBase(unittest.TestCase):
    def setUp(self) -> None:
        app = create_app('testing')
        self.context = app.test_request_context()
        self.context.push()
        self.client = app.test_client()
        self.runner = app.test_cli_runner()

        db.create_all()

    def tearDown(self) -> None:
        db.drop_all()
        self.context.pop()


# 添加一些测试用数据
CATEGORIES = [
    {
        "code": "A",
        "title": "农业",
        "children": [
            {
                "code": "A01",
                "title": "农业；林业；畜牧业；狩猎；诱捕；捕鱼"
            }
        ],
        "ancestors": []
    },
    {
        "code": "A01",
        "title": "农业；林业；畜牧业；狩猎；诱捕；捕鱼",
        "ancestors": [
            {
                "code": "A",
                "title": "农业"
            }
        ]
    }
]
# 添加测试专利文件
PATENT = {
    "title": "一种枯草芽孢杆菌变异菌株的批量培养方法",
    "application_number": "CN01112787.2",
    "application_date": "2001-04-27",
    "publication_number": "CN1384187",
    "publication_date": "2002-12-11",
    "applicant": [
        "华东师范大学",
        "昆山科新环境生物工程有限公司"
    ],
    "address": "200062上海市中山北路3663号",
    "joint_applicant": [],
    "inventor": [
        "吴自荣",
        "郭大磊",
        "黄静"
    ],
    "agency": "上海德昭专利事务所",
    "agent": [
        "程宗德"
    ],
    "code": "31",
    "summary": "一种枯草芽孢杆菌变异菌株的批量培养方法,属微生物菌体培养技术领域,操作包括配制液体培养基、来菌、菌体培养和获得活菌四个步骤,有成本低廉、获得的活菌数多和便于推广使用的优点,适于用来批量培养枯草芽孢杆菌变异菌株菌体,为工业化生产复合型活菌生物净水剂提供活菌原料,是一项能促进水产养殖的新技术。",
    "sovereignty": "权利要求书1.一种枯草芽孢杆菌变异菌株的培养方法,其特征在于,操作步骤：第1步  配制液体培养基,为四个1吨的发酵罐配制液体培养\r\r\r\r\n基,向每罐投入原料700Kg,该原料配方为黄豆并粉7～56Kg,玉米\r\r\r\r\n粉14～49Kg,麸皮3.5～35Kg,工业级硫酸铵2.8～4.9Kg,工业级氯\r\r\r\r\n化铵0.7～2.1Kg,水553～672Kg,混和搅拌均匀,制成相同的液体培\r\r\r\r\n养基四罐；\r\r\r\r\n第2步  灭菌,在压力为1.1～1.4Kg/cm2的的条件下,对罐内\r\r\r\r\n的液体培养基进行高压灭菌处理,处理时间为30～40分钟；\r\r\r\r\n第3步  菌体培养,待罐内的液体培养基冷却到30～50℃时,按\r\r\r\r\n5～10∶95～90的重量比率把预先经二级培养成的处于对数生长期的\r\r\r\r\n枯草芽孢杆菌变异菌株1#、2#、3#和4#的细菌种子分别接入上述的\r\r\r\r\n四个发酵罐,在罐压、通风量、转速和罐温分别为0.4～0.6Kg/cm2、\r\r\r\r\n0.5～1.0∶0.6～1.2V/V、200～300rpm和20～50℃的条件下,连续\r\r\r\r\n培养20～72小时；\r\r\r\r\n第4步  获得活菌,经上步发酵的液体培养液,用转速为\r\r\r\r\n3000～10000rpm的离心机离心20～30分钟,从四个发酵罐分\r\r\r\r\n别得到60～70Kg的枯草芽孢杆菌变异菌株1#、2#、3#和4#的湿菌体,\r\r\r\r\n以每克湿菌体含活菌20亿～50亿个计,从每罐获得的活菌数为\r\r\r\r\n1200000亿～3500000亿个。",
    "page_number": 5,
    "main_cls_number": "A01",
    "patent_cls_number": [
        "A01",
    ]
}
