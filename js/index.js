var image = document.getElementById("sample-image")
var body = document.getElementsByTagName("body")[0]
var undo = document.getElementById("undo")
undo.addEventListener("click", undoFunc)
var pointContainer = document.getElementById("point-container")
var canvas = document.getElementById("canvas")
canvas.addEventListener("click", saveCoordinate)

var previousPoint = null
var plottedPoints = []
// var pointContainer = document.getElementById("point-container");

// console.log(image.offsetHeight)
// console.log(image.offsetHeight);
// console.log(image.scrollHeight);
positionResizePointContainer()
positionPoints()
positionResizeCanvas()

window.addEventListener("resize", function(){
	positionResizeCanvas()
	positionResizePointContainer()
})

function positionResizePointContainer(){
	// console.log("Positioning point container...")

	pointContainer.style.height = image.offsetHeight + "px"
	pointContainer.style.width = image.offsetWidth + "px"
	pointContainer.style.top = (body.offsetHeight - image.offsetHeight) / 2
	pointContainer.style.left = (body.offsetWidth - image.offsetWidth) / 2

	// console.log("Positioned the point container!")
}

function positionResizeCanvas(){
	// console.log("Resizing canvas...")

	canvas.style.height = image.offsetHeight + "px"
	canvas.style.width = image.offsetWidth + "px"
	canvas.style.top = (body.offsetHeight - image.offsetHeight) / 2
	canvas.style.left = (body.offsetWidth - image.offsetWidth) / 2

	// console.log("Resized canvas!")
}

function saveCoordinate(e){
	// console.log(e)

		var point = document.createElement("span")
		point.className = "point"
		point.setAttribute("data-x", e.offsetX / image.offsetWidth)
		point.setAttribute("data-y", e.offsetY / image.offsetHeight)
		point.style.left = ((e.offsetX / image.offsetWidth) * 100) + "%"
		point.style.top = ((e.offsetY / image.offsetHeight) * 100) + "%"

		var newPoint = {
			x: (e.offsetX / image.offsetWidth) * 100,
			y: (e.offsetY / image.offsetHeight) * 100
		}

		if (previousPoint == null) {
			previousPoint = newPoint
			plottedPoints.push(newPoint)
		} else {
			plotPoints(previousPoint, newPoint)
			plottedPoints.push(newPoint)
		}

		pointContainer.appendChild(point)
	

	// console.log("x: " + e.offsetX / image.offsetWidth)
	// console.log("y: " + e.offsetY / image.offsetHeight)

}

function positionPoints(){
	// console.log("Positioning points...")

	var points = document.getElementsByClassName("point")

	for (var i = points.length - 1; i >= 0; i--) {
		points[i].style.left = points[i].dataset.x + "%"
		points[i].style.top = points[i].dataset.y + "%"
	}


	// console.log("Positioned points!")
}

function plotPoints(point1, point2){
	// Create line on the canvas

	// console.log((point1.x / 100) * image.offsetWidth, (point1.y / 100) * image.offsetHeight)
	// console.log((point2.x / 100) * image.offsetWidth, (point2.y / 100) * image.offsetHeight)

	var p1 = (point1.x / 100) * image.offsetWidth,
		p2 = (point1.y / 100) * image.offsetHeight,
		q1 = (point2.x / 100) * image.offsetWidth,
		q2 = (point2.y / 100) * image.offsetHeight

	pointContainer.appendChild(createLine(p1, p2, q1, q2));

	var euclideanMeasurement = euclidean(p1, p2, q1, q2)
	var actualMeasurement = convertToActual(euclideanMeasurement)

	// console.log("Euclidean: " + euclideanMeasurement)
	// console.log("Actual: " + actualMeasurement)

	previousPoint = null
}

function undoFunc(){

	if (pointContainer.children.length > 0) {
		if (previousPoint == null) {
			plottedPoints.pop()
			previousPoint = plottedPoints[plottedPoints.length - 1]
			pointContainer.removeChild(pointContainer.lastChild)
			pointContainer.removeChild(pointContainer.lastChild)
		} else {
			plottedPoints.pop()
			previousPoint = null
			pointContainer.removeChild(pointContainer.lastChild)
		}
	}

}

function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    var styles = 'border: 1px solid white; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + (y + 1) + 'px; '
               + 'left: ' + (x + 2) + 'px; ';
    line.setAttribute('style', styles);  
    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}

function euclidean(p1, p2, q1, q2){
	// console.log("Solving for euclidean(" + p1 + ", " + p2 + ", " + q1 + ", " + q2 + ")")

	var v1 = (q1 - p1) * (q1 - p1)
	var v2 = (q2 - p2) * (q2 - p2)

	// console.log("v1: " + v1 + ", v2: " + v2)

	var euclideanDist = Math.sqrt(v1 + v2)

	// console.log(euclideanDist)

	if (euclideanDist == NaN) {
		console.log("Euclidean distance is NaN!!!")
	}

	return euclideanDist
}

function convertToActual(euclidean){
	var pixelsPerMetric = 3

	var measurement = euclidean / 3

	return measurement
}

