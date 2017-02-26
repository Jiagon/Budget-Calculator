/* Click on day 1 */
$(".Day1").on("click", function() {
	console.log("Days");
	});

/* Click on prev button */
$(".prev").on("click", function() {
	console.log("Previous");
	});

/* Click on next button */
$(".next").on("click", function() {
	console.log("Next");
	});

/* Click on Days Button */
$(".Days-Button").on("click", function() {
	console.log("clicked days button");
    $("#that-weeks-list").css("display","none");
	$("#that-days-list").css("display","block");	
	
})

/* Click on Weeks Button */
$(".Weeks-Button").on("click", function() {
	console.log("clicked weeks button");
	$("#that-weeks-list").css("display","block");
	$("#that-days-list").css("display","none");
})