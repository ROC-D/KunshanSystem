from flask_wtf import FlaskForm
from wtforms import SelectField, SubmitField, IntegerField, HiddenField, StringField
from wtforms.validators import DataRequired, Length,InputRequired


class ProcessForm(FlaskForm):
    title = StringField('标题', validators=[DataRequired(), Length(2, 255)])
    # departments = SelectField('科室', choices=[(0, '知识产权科'), (1, '交流合作科')], coerce=int)
    assignments = SelectField('任务', choices=[(0, '发明专利')], coerce=int)
    numbers = IntegerField('数量')
    uploads = HiddenField()
    submit = SubmitField('提交')

    def __init__(self, departments, tasks):
        super(ProcessForm, self).__init__()
        # self.departments.choices = [(department['id'], department['department']) for department in departments]
        # 设置默认选中
        # selected = self.departments.data if self.departments.data is not None else departments[0]['id']
        # self.tasks.choices = [(task['task_id'], task['type']) for task in tasks if selected == task['department_id']]
        # 展示出所有的分配任务
        self.assignments.choices = [(task['task_id'], task['type']) for task in tasks]
        self.departments = departments
        self.tasks = tasks

    def get_upload_filenames(self):
        text = self.uploads.data
        return [] if len(text) == 0 else text.split('|')

    def get_mission(self):
        # 获取到任务的id
        task_id = self.assignments.data
        # 根据id找到对应的任务
        task = None
        for t in self.tasks:
            if t['task_id'] == task_id:
                task = t
                break
        return task['department_id'], task['type']


class AddProvidersForm(FlaskForm):
    company = StringField("服务商名", validators=[InputRequired()])
    charger = StringField("负责人名", validators=[InputRequired()])
    charger_tel = StringField("负责人电话", validators=[InputRequired()])
    submit = SubmitField('提交')
