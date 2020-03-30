$(".review-btn").on("click", function (e) {
   let status = $(this).data("status");
   let id = $(this).parent().data("id");
   if(!id || !status){
       toggle_alert(false, "参数有误！");
       return false;
   }
   let parent = $(this).parents(".col-auto");
   $.ajax({
       url:"/review/operate",
       type:"POST",
       dataType:"json",
       data: {"status": status, "id": id},
       success: function (json_data) {
            if (json_data.error){
                toggle_alert(false, json_data.errorMsg);
                return false;
            }
            toggle_alert(true, "操作成功");
            parent.remove();
       }
   });
});
console.log("this is review.js")