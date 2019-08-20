$(function () {
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover();
})

window.globals = {
	strokeColor: "black",
	fillColor: "white",
	strokeWidth: 3,
	function: "circle"
};

window.onload = function () {
	var strokeColorSelector = document.querySelector("#stroke-color-selector");
	var fillColorSelector = document.querySelector("#fill-color-selector");
	var strokeWidthSelector = document.querySelector("#stroke-width-selector");
	strokeColorSelector.addEventListener("change", colorSelected, false);
	fillColorSelector.addEventListener("change", colorSelected, false);
	strokeWidthSelector.addEventListener("change", widthSelected, false);
}

function colorSelected(event) {
	window.globals['strokeColor'] = document.querySelector("#stroke-color-selector").value;
	window.globals['fillColor'] = document.querySelector("#fill-color-selector").value;

	var selectedItems = window.globals.project.selectedItems;
	for (var i = 0; i < selectedItems.length; i++) {
		selectedItems[i].set({
			strokeColor: globals.strokeColor,
			fillColor: globals.fillColor
		});
	}
}

function widthSelected(event) {
	window.globals['strokeWidth'] = document.querySelector("#stroke-width-selector").value;
}

function changeFunction(newFunction) {
	window.globals['function'] = newFunction;
	$(".function-button").removeClass("active");
	$("#myCanvas").removeClass("grabby");
	switch (newFunction) {
		case "pan":
			$("#pan-select-button").addClass("active");
			$("#myCanvas").addClass("grabby");
			break;
		case "select":
			$("#select-select-button").addClass("active");
			break;
		case "pen":
			$("#pen-select-button").addClass("active");
			break;
		case "brush":
			$("#brush-select-button").addClass("active");
			break;
		case "line":
			$("#line-select-button").addClass("active");
			$("#shape-select-button").addClass("active");
			break;
		case "circle":
			$("#circle-select-button").addClass("active");
			$("#shape-select-button").addClass("active");
			break;
		case "ellipse":
			$("#ellipse-select-button").addClass("active");
			$("#shape-select-button").addClass("active");
			break;
		case "rectangle":
			$("#rectangle-select-button").addClass("active");
			$("#shape-select-button").addClass("active");
			break;
		case "text":
			$("#text-select-button").addClass("active");
			break;
		default:
			break;
	}
}

function saveCanvas() {
	var svg = window.globals.project.exportSVG({ asString: true });
	downloadDataUri({
		data: 'data:image/svg+xml;base64,' + btoa(svg),
		filename: 'export.svg'
	});
}

function newCanvas() {
	window.globals.project.clear();
}



function downloadDataUri(options) {
	if (!options.url)
		options.url = "http://download-data-uri.appspot.com/";
	$('<form method="post" action="' + options.url
		+ '" style="display:none"><input type="hidden" name="filename" value="'
		+ options.filename + '"/><input type="hidden" name="data" value="'
		+ options.data + '"/></form>').appendTo('body').submit().remove();
}


dragElement(document.getElementById("toolbar"));

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV: 
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		elmnt.style.right = (elmnt.offsetRight - pos1) + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}