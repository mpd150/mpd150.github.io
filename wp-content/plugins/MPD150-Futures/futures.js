jQuery(document).ready(function($){
	$('.modal').on('shown.bs.modal', function (e) {
		var modal = $(this);
		var topicID = $(this).attr("id");
		var list = $(".acf-field-taxonomy .acf-checkbox-list", this);
		list.children("li").each(function(){
			var labelText = $("label span", this).html();
			if (labelText.toLowerCase()==topicID) {
				$("input", this).prop("checked",true);
			}
		});

		$(".acf-field-textarea", this).keyup(function(){
			var postTitle = modal.find(".acf-field--post-title input");
			var contentInput = $("textarea",this).val();
			console.log(contentInput);
			console.log('change');
			postTitle.val(contentInput);
		})

		


	});
});