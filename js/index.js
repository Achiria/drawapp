window.onload = function () {
	window.globals = {function: "circle"};
}

function changeFunction(newFunction) {
	window.globals = {function: newFunction};
	$(".function-button").removeClass("active");
	switch (newFunction) {
		case "select":
			$("#select-select-button").addClass("active");
			break;
		case "pencil":
			$("#pencil-select-button").addClass("active");
			break;
		case "line":
			$("#line-select-button").addClass("active");
			break;
		case "circle":
			$("#circle-select-button").addClass("active");
			break;
		case "rectangle":
			$("#rectangle-select-button").addClass("active");
			break;
		default:
			break;
	}
}