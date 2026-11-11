var values = {};

var hitOptions = {
	segments: true,
	handles: true,
	stroke: true,
	fill: true,
	tolerance: 2
}

globals.project = project;

var segment, path, copied;

function onMouseDown(event) {
	project.deselectAll();
	segment = path = null;
	handle = point = null;
	var hitResult = project.hitTest(event.point, hitOptions);

	//if it's a mouse event
	if (!!event.event.buttons) {
		switch (event.event.buttons) {
			//left click
			case 1:
				leftClickDown(hitResult, event);
				break;
			//right click
			case 2:
				break;
			//middle click
			case 4:
				break;
		}
	}

	//if it's a touch event
	if (event.event.type === "touchstart") {
		leftClickDown(hitResult, event);
	}
}

function leftClickDown(hitResult, event) {
	if (hitResult) {
		path = hitResult.item;
		switch (hitResult.type) {
			case 'segment':
				segment = hitResult.segment;
				break;
			case 'handle-in':
				handle = hitResult.segment.handleIn;
				break;
			case 'handle-out':
				handle = hitResult.segment.handleOut;
				break;
			case 'stroke':
				if (globals.function == "select") {
					var location = hitResult.location;
					// segment = path.insert(location.index + 1, event.point);
				}
				break;
			case 'fill':
				break;
			default:
				break;
		}
	}

	switch (globals.function) {
		case "select":
			if (event.item != null)
				event.item.set({
					selected: true
				});
			if (segment != null)
				segment.set({selected: true});
			if (handle != null)
				handle.set({selected: true});
			break;
		case "pen":
			penPath = new Path();
			penPath.strokeCap = 'round';
			penPath.strokeJoin = 'round';
			penPath.strokeColor = globals.strokeColor;
			penPath.strokeWidth = globals.strokeWidth;
			break;
		case "brush":
			brushPath = new Path();
			brushPath.fillColor = globals.strokeColor;
            brushPath.strokeColor = globals.strokeColor;
            brushPath.strokeWidth = globals.strokeWidth;
            brushPath.opacity = globals.opacity;
			brushPath.add(event.point);
			break;
		case "circle":
			centerEvent = event.point;
			newCircle = new Path.Circle({
				center: event.point,
				radius: 0
			});
			newCircle.strokeColor = globals.strokeColor;
			newCircle.fillColor = globals.fillColor;
			newCircle.strokeWidth = globals.strokeWidth;
            newCircle.opacity = globals.opacity;
			break;
		case "rectangle":
			break;
		default:
			break;
	}
}

function onMouseDrag(event) {
	//if it's a click event
	if (!!event.event.buttons) {
		switch (event.event.buttons) {
			//left drag
			case 1:
				leftDrag(event);
				break;
			//right drag
			case 2:
				break;
			//middle drag
			case 4:
				moveCenter(event);
				$("#myCanvas").addClass("grabby");
				break;
		}
	}

	//if it's a touch event
	if (event.event.type === "touchmove") {
		leftDrag(event);
	}
}

function leftDrag(event) {
	switch (globals.function) {
		case "pan":
			moveCenter(event);
			break;
		case "select":
			if (segment) {
				segment.point += event.delta;
			} else if (handle) {
				// handle.point = event.point.subtract(handle.point);
				handle.point += event.delta;
			} else if (path) {
				path.position += event.delta;
			}
			break;
		case "pen":
			penPath.add(event.point);
			break;
		case "brush":
			var step = event.delta;
			step.angle += 90;

			var top = event.middlePoint + (step * (globals.strokeWidth / 30) + 1);
			var bottom = event.middlePoint - (step * (globals.strokeWidth / 30) + 1);

			// var line = new Path();
			// line.strokeColor = globals.strokeColor;;
			// line.add(top);
			// line.add(bottom);

			brushPath.add(top);
			brushPath.insert(0, bottom);
			brushPath.smooth();
			break;
		case "circle":
			// newCircle.set({radius: event.delta.length / 2});
			newCircle.remove();
			newCenter = centerEvent + (centerEvent.getDistance(event.point) / 3);
			// newCenter = centerEvent.getDistance(event.middlePoint);
			// newRadius = centerEvent - event.point;
			newRadius = centerEvent.getDistance(event.point) / 2;
			newCircle = new Path.Circle({
				center: newCenter,
				radius: newRadius
			});
			newCircle.strokeColor = globals.strokeColor;
			newCircle.fillColor = globals.fillColor;
			newCircle.strokeWidth = globals.strokeWidth;
            newCircle.opacity = globals.opacity;
			break;
		default:
			break;
	}
}

function onMouseUp(event) {
	//if it's a mouse event
	if (!!event.event.buttons || event.event.buttons === 0) {
		switch (event.event.button) {
			//left up
			case 0:
				leftClickUp(event);
				break;
			//right up
			case 2:
				break;
			//middle up
			case 1:
				if (globals.function != "pan")
					$("#myCanvas").removeClass("grabby");
				break;
			//back up
			case 3:
				window.history.back();
				break;
			//forward up
			case 4:
				window.history.forward();
				break;
		}
	}

	//if it's a touch event
	if (event.event.type === "touchend") {
		leftClickUp(event);
	}
}

function leftClickUp(event) {
	updateHistory = true;
	switch (globals.function) {
		case "line":
			var linePath = new Path();
			linePath.strokeColor = globals.strokeColor;
			linePath.strokeWidth = globals.strokeWidth;
            linePath.opacity = globals.opacity;
			linePath.add(event.downPoint);
			linePath.add(event.point);
			break;
		case "pen":
			penPath.simplify();
			if (penPath.segments.length <= 1) {
				var circle = new Path.Circle({
					center: event.point,
					radius: globals.strokeWidth / 2
				});
				circle.strokeColor = globals.strokeColor;
				circle.fillColor = globals.strokeColor;
                circle.opacity = globals.opacity;
			}
			break;
		case "brush":
			brushPath.simplify(1);
			brushPath.add(event.point);
			brushPath.closed = true;
			// brushPath.smooth(5);
			break;
		case "circle":
			var circle = new Path.Circle({
				center: event.middlePoint,
				radius: event.delta.length / 2
			});
			circle.strokeColor = globals.strokeColor;
			circle.fillColor = globals.fillColor;
			circle.strokeWidth = globals.strokeWidth;
            circle.opacity = globals.opacity;
			break;
		case "ellipse":
			var rectangle = new Rectangle({
				x: event.point.x - event.delta.x,
				y: event.point.y - event.delta.y,
				height: event.delta.y,
				width: event.delta.x
			});
			var ellipse = new Path.Ellipse(
				rectangle
			);
			ellipse.strokeColor = globals.strokeColor;
			ellipse.fillColor = globals.fillColor;
			ellipse.strokeWidth = globals.strokeWidth;
            ellipse.opacity = globals.opacity;
			break;
		case "rectangle":
			var rectangle = new Path.Rectangle({
				x: event.point.x - event.delta.x,
				y: event.point.y - event.delta.y,
				height: event.delta.y,
				width: event.delta.x
			});
			rectangle.strokeColor = globals.strokeColor;
			rectangle.fillColor = globals.fillColor;
			rectangle.strokeWidth = globals.strokeWidth;
            rectangle.opacity = globals.opacity;
			break;
		default:
			updateHistory = false;
			break;
	}
	if (updateHistory) {
		// debugger;
		window.globals.futureHistory = [];
		window.globals.previousHistory.push(project.exportSVG());
		$("#undo-button").removeClass("disabled");
		$("#redo-button").addClass("disabled");
	}
}

function onKeyUp(event) {
	switch (event.key) {
		case "delete":
			var selectedItems = project.selectedItems;
			for (var i = 0; i < selectedItems.length; i++) {
				selectedItems[i].remove();
			}
			break;
		case "c": {
			if (event.modifiers.control) {
				copied = project.selectedItems;
			}
			break;
		}
		case "v": {
			if (event.modifiers.control) {
				for (var i = 0; i < copied.length; i++) {
					copied[i].copyTo(project).transform;
				}
				project.deselectAll();
			}
			break;
		}
		default:
			break;
	}
}

$('#myCanvas').mousewheel(function (event) {
	console.log(event.deltaX, event.deltaY, event.deltaFactor);
	project.view.zoom = changeZoom(project.view.zoom, event.deltaY);
});

function changeZoom(oldZoom, delta) {
	factor = 1.05
	if (delta < 0)
		return oldZoom / factor
	if (delta > 0)
		return oldZoom * factor
	return oldZoom
}

function moveCenter(event) {
	requestAnimationFrame(function() {
		project.view.translate(event.delta);
	});
}