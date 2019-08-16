var values = {};

var hitOptions = {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 5
}


globals.newProject = function () {
	project.clear();
}

globals.saveProject = function () {
	var svg = project.exportSVG({ asString: true });
	downloadDataUri({
		data: 'data:image/svg+xml;base64,' + btoa(svg),
		filename: 'export.svg'
	});
}

var segment, path;

function onMouseDown(event) {
	project.deselectAll();
	segment = path = null;
	var hitResult = project.hitTest(event.point, hitOptions);

	if (hitResult) {
		path = hitResult.item;
		switch (hitResult.type) {
			case 'segment':
				segment = hitResult.segment;
				break;
			case 'stroke':
				if (globals.function == "select") {
					var location = hitResult.location;
					segment = path.insert(location.index + 1, event.point);
				}
				break;
			default:
				break;
		}
	}

	switch (globals.function) {
		case "select":
			if (event.item != null)
				event.item.set({ selected: true });
			break;
		case "pencil":
			myPath = new Path();
			myPath.strokeColor = globals.strokeColor;
			myPath.strokeWidth = globals.strokeWidth;
			break;
		case "circle":
			break;
		default:
			break;
	}
}

function onMouseDrag(event) {
	switch (globals.function) {
		case "select":
			if (segment) {
				segment.point += event.delta;
			}
			else if (path) {
				path.position += event.delta;
			}
			break;
		case "pencil":
			myPath.add(event.point);
			break;
		case "circle":
			break;
		default:
			break;
	}
}

function onMouseUp(event) {
	switch (globals.function) {
		case "line":
			var myPath = new Path();
			myPath.strokeColor = globals.strokeColor;
			myPath.strokeWidth = globals.strokeWidth;
			myPath.add(event.downPoint);
			myPath.add(event.point);
			break;
		case "circle":
			var circle = new Path.Circle({
				center: event.middlePoint,
				radius: event.delta.length / 2
			});
			circle.strokeColor = globals.strokeColor;
			circle.fillColor = globals.fillColor;
			circle.strokeWidth = globals.strokeWidth;
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
			break;
		default:
			break;
	}
}

function downloadDataUri(options) {
	if (!options.url)
		options.url = "http://download-data-uri.appspot.com/";
	$('<form method="post" action="' + options.url
		+ '" style="display:none"><input type="hidden" name="filename" value="'
		+ options.filename + '"/><input type="hidden" name="data" value="'
		+ options.data + '"/></form>').appendTo('body').submit().remove();
}