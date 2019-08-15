function onMouseDown(event) {
	switch (globals.function) {
		case "pencil":
			myPath = new Path();
			myPath.strokeColor = 'black';
			break;
		default:
			break;
	}
}

function onMouseDrag(event) {
	switch (globals.function) {
		case "pencil":
			myPath.add(event.point);
			break;
		default:
			break;
	}
}

function onMouseUp(event) {
	switch (globals.function) {
		case "line":
			var myPath = new Path();
			myPath.strokeColor = 'black';
			myPath.add(event.downPoint);
			myPath.add(event.point);
			break;
		case "circle":
			var circle = new Path.Circle({
				center: event.middlePoint,
				radius: event.delta.length / 2
			});
			circle.strokeColor = 'black';
			circle.fillColor = 'white';
			break;
		case "rectangle":
			var rectangle = new Path.Rectangle({
				x: event.point.x - event.delta.x,
				y: event.point.y - event.delta.y,
				height: event.delta.y,
				width: event.delta.x
			});
			rectangle.strokeColor = 'black';
			rectangle.fillColor = 'white';
			break;
		default:
			break;
	}
}