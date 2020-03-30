/*
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
 */
//绑定提交记录
$('#submit').on("click", function () {
    //点击提交按钮后提交表单数据
    $('#submit-record').submit();
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
    dictDefaultMessage: `Drop files here or click to upload.`, // message display on drop area
    dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
    dictInvalidFileType: "You can't upload files of this type.",
    dictFileTooBig: "File is too big {{filesize}}. Max filesize: {{maxFilesize}}MiB.",
    dictResponseError: "Server error: {{statusCode}}",
    dictMaxFilesExceeded: "You can't upload any more files.",
    dictCancelUpload: "Cancel upload",
    dictRemoveFile: "Remove file",
    dictCancelUploadConfirmation: "You really want to delete this file?",
    dictUploadCanceled: "Upload canceled",
    // custom options code
};
