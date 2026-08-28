jQuery(document).ready(function($) {
	console.log('test');

	var activeSelectors={"topic":"","role":""}

	function toggle_interviews() {
		$('.card-container .card').hide();
		if (activeSelectors.topic) {
			var topicSelector = ".excerpt-codes-" + activeSelectors.topic;
		} else var topicSelector = "";
		if (activeSelectors.role) {
			var roleSelector = ".excerpt-codes-" + activeSelectors.role;
		} else var roleSelector = "";

		var selected = ".card-container .card" + topicSelector + roleSelector;


		console.log(selected);

		$(selected).show();
	}

	$("#interview-codes input").change(function(){
			var name = $(this).attr("name");
			var value = $(this).attr("id");

			if (name=="topic") {
				activeSelectors.topic = value;
			}
			if (name=="role") {
				activeSelectors.role = value;
			}
			toggle_interviews();
	});

	$("#interview-codes #show-all").click(function() {
		$(".card-container .card").show();
	})

	//allows users to unselect radio buttons


});
