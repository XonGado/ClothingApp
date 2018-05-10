var body = document.getElementsByTagName("body")[0]
var imageContainer = document.getElementById("image-container")
var pointContainer = document.getElementById("point-container")
var image = document.getElementById("sample-image")
var field = document.getElementById("click-field")
var undo = document.getElementById("undo")

undo.addEventListener("click", undoFunc)
field.addEventListener("click", saveCoordinate)

var previousPoint = null
var plottedPoints = []
var plots = []

positionPoints()
updateInformation()

// var newMeasurement = {
// 	points: {
// 		point_i: {
// 			x: null,
// 			y: null
// 		}
// 		point_f: {
// 			x: null,
// 			y: null
// 		}
// 	}
// 	percentLength: {
// 		height: null,
// 		weight: null
// 	}
// 	euclidean: null,
// 	actual: null
// }

// function setImageContainerDimensions(){
// 	imageContainer.style.height = image.offsetHeight
// 	imageContainer.style.width = image.offsetWidth
// }

// Creates and plots the points when user clicks on the click-field
function saveCoordinate(e){
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

		var euclideanValue = euclidean(newPoint.x, newPoint.y, previousPoint.x, previousPoint.y)

		var newMeasurement = {
			euclidean: euclideanValue,
			actual: convertToActual(euclideanValue),
			percentLength: convertPxToPercent(euclideanValue),
			points: {
				point_i: {
					x: previousPoint.x,
					y: previousPoint.y
				},
				point_f: {
					x: newPoint.x,
					y: newPoint.y
				}
			}
		}

		plots.push(newMeasurement)

		updateInformation()

		console.log(plots)

		plottedPoints.push(newPoint)
		previousPoint = null

	}

	pointContainer.appendChild(point)
}

function updateInformation(){
	var plotContainer = document.getElementById("plot-container")
	var plotContainerLarge = document.getElementById("plot-container-lg-screen")

	plotContainer.innerHTML = ""
	plotContainerLarge.innerHTML = ""
	var content = "<h5>Plotted Lines</h5>"

	if (plots.length == 0) {
		content += "<p>Click on the image to plot some lines.</p>"
	} else {
		for (var i = plots.length - 1; i >= 0; i--) {
			let plot = plots[i] 

			content += '<p>' 
				   + '<span class="label">Euclidean</span>: ' + plot.euclidean + '</br>'
	               + '<span class="label">Actual</span>: ' + plot.actual + '</br>'
	               + '<span class="label">Percent length</span>: ' + plot.percentLength + '</br>'
	               + '<span class="label">Points</span>: ' + '</br>'
	               + '&nbsp;&nbsp;&nbsp;<span class="label">Initial</span>: { ' + plot.points.point_i.x + ", " + plot.points.point_i.y + ' }</br>'
	               + '&nbsp;&nbsp;&nbsp;<span class="label">Final</span>: { ' + plot.points.point_f.x + ", " + plot.points.point_f.y + ' }</br>'
	               + '</p>'
		}
	}


	plotContainerLarge.innerHTML = content
	plotContainer.innerHTML = content
}

function convertPxToPercent(pixel){
  	return (pixel / image.offsetWidth) * 100 
}

// Plots the points that are declared initially
function positionPoints(){
	var points = document.getElementsByClassName("point")

	for (var i = points.length - 1; i >= 0; i--) {
		points[i].style.left = points[i].dataset.x + "%"
		points[i].style.top = points[i].dataset.y + "%"
	}
}

// Calls the create line and plots two points
function plotPoints(point1, point2){
	var p1 = (point1.x / 100) * image.offsetWidth,
		p2 = (point1.y / 100) * image.offsetHeight,
		q1 = (point2.x / 100) * image.offsetWidth,
		q2 = (point2.y / 100) * image.offsetHeight

	pointContainer.appendChild(createLine(p1, p2, q1, q2));

	var euclideanMeasurement = euclidean(p1, p2, q1, q2)
	var actualMeasurement = convertToActual(euclideanMeasurement)

}

// Undos previous plotted points and lines
function undoFunc(){
	if (pointContainer.children.length > 0) {
		if (previousPoint == null) {
			plottedPoints.pop()
			previousPoint = plottedPoints[plottedPoints.length - 1]
			pointContainer.removeChild(pointContainer.lastChild)
			pointContainer.removeChild(pointContainer.lastChild)
			plots.pop()
			updateInformation()
		} else {
			plottedPoints.pop()
			previousPoint = null
			pointContainer.removeChild(pointContainer.lastChild)
		}
	}
}

// Calculates the line's postion, length, and angle
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

// Creates the line based on the given postion, length, and angle
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");

  	length = (length / image.offsetWidth) * 100 
  	x = ((x + 2) / image.offsetWidth) * 100 
  	y = ((y + 1) / image.offsetHeight) * 100 

    var styles = 'border: 1px solid white; '
               + 'width: ' + length + '%; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + '%; '
               + 'left: ' + x + '%; ';
    line.setAttribute('style', styles);  

    return line;
}

// Returns a euclidean value given two points.
function euclidean(p1, p2, q1, q2){
	var v1 = (q1 - p1) * (q1 - p1)
	var v2 = (q2 - p2) * (q2 - p2)

	var euclideanDist = Math.sqrt(v1 + v2)

	if (euclideanDist == NaN) {
		console.log("Euclidean distance is NaN!!!")
	}

	return euclideanDist
}

// Returns a measurement by converting a euclidean value.
function convertToActual(euclidean){
	var pixelsPerMetric = 25.873015873015877

	var measurement = euclidean / pixelsPerMetric

	return measurement
}

