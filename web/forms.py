from flask_wtf import FlaskForm
from wtforms import SelectField, SubmitField, IntegerField, HiddenField
from wtforms.validators import DataRequired


class ProcessForm(FlaskForm):
    departments = SelectField('科室', choices=[(0, '知识产权科'), (1, '交流合作科')], coerce=int)
    tasks = SelectField('任务', choices=[(0, '发明专利')])
    numbers = IntegerField('数量')
    uploads = HiddenField()
    submit = SubmitField('提交')

    def __init__(self, departments, tasks):
        super(ProcessForm, self).__init__()
        self.departments.choices = [(department['id'], department['department']) for department in departments]
        # 设置默认选中
        selected = self.departments.data if self.departments.data is not None else departments[0]['id']
        self.tasks.choices = [(task['type'], task['type']) for task in tasks if selected == task['department_id']]

    def get_upload_filenames(self):
        text = self.uploads.data
        return [] if len(text) == 0 else text.split('|')
