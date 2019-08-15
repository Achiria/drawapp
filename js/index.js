function onMouseUp(event) {
	var circle = new Path.Circle({
		center: event.middlePoint,
		radius: event.delta.length / 2
	});
	circle.strokeColor = 'black';
	circle.fillColor = 'white';
}