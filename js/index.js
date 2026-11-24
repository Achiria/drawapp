// import * as historyEvent from './historyEvent.js';

document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
	new bootstrap.Tooltip(element);
});

document.querySelectorAll('[data-bs-toggle="popover"]').forEach((element) => {
	new bootstrap.Popover(element);
});

window.globals = {
	previousHistory: [],
	futureHistory: [],
	strokeColor: "black",
	fillColor: "white",
    opacity: 1,
	strokeWidth: 3,
	function: "circle",
	fullScreen: false
};

window.onload = function () {
	var strokeColorSelector = document.querySelector("#stroke-color-selector");
	var fillColorSelector = document.querySelector("#fill-color-selector");
	var opacitySelector = document.querySelector("#opacity-selector");
	var strokeWidthSelector = document.querySelector("#stroke-width-selector");
	strokeColorSelector.addEventListener("change", colorSelected, false);
	fillColorSelector.addEventListener("change", colorSelected, false);
	opacitySelector.addEventListener("change", opacitySelected, false);
	strokeWidthSelector.addEventListener("change", widthSelected, false);

	window.globals.previousHistory.push(window.globals.project.exportSVG());
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

function opacitySelected(event) {
	window.globals['opacity'] = (document.querySelector("#opacity-selector").value) / 10;
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
            $("#shape-select-button").text("Line");
			break;
		case "circle":
			$("#circle-select-button").addClass("active");
			$("#shape-select-button").addClass("active");
            $("#shape-select-button").text("Circle");
			break;
		case "ellipse":
			$("#ellipse-select-button").addClass("active");
			$("#shape-select-button").addClass("active");
            $("#shape-select-button").text("Ellipse");
			break;
		case "rectangle":
			$("#rectangle-select-button").addClass("active");
			$("#shape-select-button").addClass("active");
            $("#shape-select-button").text("Rectangle");
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
	var blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
	var url = URL.createObjectURL(blob);
	var link = document.createElement("a");
	link.href = url;
	link.download = "export.svg";
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(function () {
		URL.revokeObjectURL(url);
	}, 0);
}

function loadCanvas() {
	var project = window.globals.project;
	$('#file-input').trigger('click');

}

function newCanvas() {
	window.globals.project.clear();
}

function undoAction() {
	// debugger;
	var project = window.globals.project;
	if (window.globals.previousHistory.length > 0) {
		var redoProject = window.globals.previousHistory.pop();
		var nowProject = peek(window.globals.previousHistory);
		window.globals.futureHistory.push(redoProject);
		project.clear();
		project.importSVG(nowProject);
        $("#redo-button").removeClass("disabled");
	}
	if (window.globals.previousHistory.length <= 1) {
        $("#undo-button").addClass("disabled");
    }
}

function redoAction() {
	// debugger;
	var project = window.globals.project;
	if (window.globals.futureHistory.length > 0) {		
		var nowProject = window.globals.futureHistory.pop();
		window.globals.previousHistory.push(nowProject);
		project.clear();
		project.importSVG(nowProject);
        $("#undo-button").removeClass("disabled");
	}
    else{
        $("#undo-button").addClass("disabled");
    }if (window.globals.futureHistory.length <= 0) {
        $("#redo-button").addClass("disabled");
    }
}

function toggleFullScreen() {
	var element = document.documentElement;
	if (globals.fullScreen == false) {
		document.getElementById("fullscreen-button").attributes.d.value = 'M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z';
		if (element.requestFullscreen)
			element.requestFullscreen();
		else if (element.mozRequestFullScreen)
			element.mozRequestFullScreen();
		else if (element.webkitRequestFullscreen)
			element.webkitRequestFullscreen();
		else if (element.msRequestFullscreen)
			element.msRequestFullscreen();
		globals.fullScreen = true;
	} else {
		document.getElementById("fullscreen-button").attributes.d.value = 'M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5';
		if (document.exitFullscreen)
			document.exitFullscreen();
		else if (document.mozCancelFullScreen)  /* Firefox */
			document.mozCancelFullScreen();
		else if (document.webkitExitFullscreen)  /* Chrome, Safari and Opera */
			document.webkitExitFullscreen();
		else if (document.msExitFullscreen)  /* IE/Edge */
			document.msExitFullscreen();
		globals.fullScreen = false;
	}
}

document.addEventListener("fullscreenchange", (event) => {
	if (!document.fullscreenElement) {
		document.getElementById("fullscreen-button").attributes.d.value = 'M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5';	
		globals.fullScreen = false; 
	}
});



dragElement(document.getElementById("toolbar"));

function dragElement(elmnt) {
	var dragHandle = document.getElementById(elmnt.id + "header") || elmnt;
	var activePointerId = null;
	var previousX, previousY;

	dragHandle.style.touchAction = "none";
	dragHandle.addEventListener("pointerdown", startDragging);

	function startDragging(event) {
		if (!event.isPrimary || event.button !== 0)
			return;

		event.preventDefault();
		activePointerId = event.pointerId;
		previousX = event.clientX;
		previousY = event.clientY;
		document.addEventListener("pointermove", drag);
		document.addEventListener("pointerup", stopDragging);
		document.addEventListener("pointercancel", stopDragging);
	}

	function drag(event) {
		if (event.pointerId !== activePointerId)
			return;

		event.preventDefault();
		elmnt.style.top = (elmnt.offsetTop + event.clientY - previousY) + "px";
		elmnt.style.left = (elmnt.offsetLeft + event.clientX - previousX) + "px";
		previousX = event.clientX;
		previousY = event.clientY;
	}

	function stopDragging(event) {
		if (event.pointerId !== activePointerId)
			return;

		activePointerId = null;
		document.removeEventListener("pointermove", drag);
		document.removeEventListener("pointerup", stopDragging);
		document.removeEventListener("pointercancel", stopDragging);
	}
}

function peek(list) {
    return list[list.length - 1];
  }