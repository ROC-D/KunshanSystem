$('#departments').change(function () {
    let department_id = parseInt(this.value);
    $('#tasks').find('option').remove();
    //从任务中筛选
    for (let i = 0; i < TASKS.length; i++){
        let task = TASKS[i];
        if (task.department_id == department_id){
            $('#tasks').append(`<option ${task.type}>${task.type}</option>`);
        }
    }
});
//dropzone配置信息
Dropzone.options.myDropzone = {
    init: function() {
        // redirect after queue complete
        // upload queue when button click
        // custom init code
        //上传成功后的回调函数
        this.on("success", function (file, response) {
            let newFilename = response['filename'];
            let oldValue = $('#uploads').val();
            if (oldValue.length == 0)
                $('#uploads').val(newFilename);
            else
                $('#uploads').val(oldValue + "|" + newFilename);
        })
    },
    // click upload options
    uploadMultiple: false,
    parallelUploads: 2,
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 3, // MB
    acceptedFiles: "image/*, audio/*, video/*, text/*, application/*",
    maxFiles: null,
    dictDefaultMessage: `上传附件`, // message display on drop area
    dictFallbackMessage: "您的浏览器不支持拖拽上传",
    dictInvalidFileType: "不支持的文件格式",
    dictFileTooBig: "文件太大{{filesize}}. 最大: {{maxFilesize}}MiB.",
    dictResponseError: "服务器错误: {{statusCode}}",
    dictMaxFilesExceeded: "超出上传上限",
    dictCancelUpload: "取消上传",
    dictRemoveFile: "移除文件",
    dictCancelUploadConfirmation: "确定删除文件?",
    dictUploadCanceled: "已取消上传",
    // custom options code
};
