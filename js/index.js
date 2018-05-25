var body = document.getElementsByTagName("body")[0]

var previousPoint = null
var plottedPoints = []
var plots = []

updateInformation()

// Creates and plots the points when user clicks on the click-field
function saveCoordinate(event, view, target){
	var height = $("#sample-image-" + view).outerHeight()
	var width = $("#sample-image-" + view).outerWidth()
	var clickX = event.offsetX
	var clickY = event.offsetY

	if (view == "front") {
		var plottedPointsOnTarget = frontArray[index(view, target)]
	} else {
		var plottedPointsOnTarget = sideArray[index(view, target)]
	}

	if (plottedPointsOnTarget.length == 0 || plottedPointsOnTarget.length == 2) {
		var newPoint = {
			x: (clickX / width) * 100,
			y: (clickY / height) * 100
		}

		if($("#point-container-" + view + " ." + target).length % 3 == 0){
			console.log($("#point-container-" + view + " ." + target).length)
			clear(view, target)
		}

		if (view == "front") {
			frontArray[index(view, target)].push(newPoint)
		} else {
			sideArray[index(view, target)].push(newPoint)
		}

		createPoint(view, newPoint.x, newPoint.y, target)
		previousPoint = newPoint
		plottedPoints.push(newPoint)
	} else if (plottedPointsOnTarget.length == 1) {

		if (view == "front") {
			var previousPoint = frontArray[index(view, target)][0]
		} else {
			var previousPoint = sideArray[index(view, target)][0]
		}

		if (!(target == "inseam-f" || target == "sleeve-f" || target == "height-f")) {
			var newPoint = {
				x: (clickX / width) * 100,
				y: previousPoint.y
			}
		} else {
			var newPoint = {
				x: previousPoint.x,
				y: (clickY / height) * 100
			}
		}

		if (view == "front") {
			frontArray[index(view, target)].push(newPoint)
		} else {
			sideArray[index(view, target)].push(newPoint)
		}

		createPoint(view, newPoint.x, newPoint.y, target)
		plotPoints(previousPoint, newPoint, view)

		let p1 = convertPercentToPx(newPoint.x, width) 
		let p2 = convertPercentToPx(newPoint.y, height) 
		let q1 = convertPercentToPx(previousPoint.x, width) 
		let q2 = convertPercentToPx(previousPoint.y, height) 
		var euclideanValue = euclidean(p1, p2, q1, q2)

		$("#" + target).val(convertToActual(euclideanValue, pixelsPerMetric).toFixed(2))

		var newMeasurement = {
			euclidean: euclideanValue,
			actual: convertToActual(euclideanValue),
			percentLength: convertPxToPercent(euclideanValue, view),
			points: {
				point_i: {
					x: convertPercentToPx(previousPoint.x, width),
					y: convertPercentToPx(previousPoint.y, height)
				},
				point_f: {
					x: convertPercentToPx(newPoint.x, width),
					y: convertPercentToPx(newPoint.y, height)
				}
			}
		}

		plots.push(newMeasurement)

		updateInformation()

		plottedPoints.push(newPoint)
		previousPoint = null
	}

}

function createPoint(view, x, y, target){
	console.log(x)
	console.log(y)

	var height = $("#sample-image-" + view).outerHeight()
	var width = $("#sample-image-" + view).outerWidth()
	var point = document.createElement("span")

	point.className = "point " + target
	point.setAttribute("data-x", x / width)
	point.setAttribute("data-y", y / height)
	point.style.left = x + "%"
	point.style.top = y + "%"

	console.log(point.style.left)
	console.log(point.style.top)

	$("#point-container-" + view).append(point)
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
				   + '<span class="label">Euclidean</span>: ' + plot.euclidean.toFixed(2) + '</br>'
	               + '<span class="label">Actual</span>: ' + plot.actual.toFixed(2) + '</br>'
	               + '<span class="label">Points</span>: ' + '</br>'
	               + '&nbsp;&nbsp;&nbsp;<span class="label">Initial</span>: { ' + plot.points.point_i.x.toFixed(0) + "px, " + plot.points.point_i.y.toFixed(0) + 'px }</br>'
	               + '&nbsp;&nbsp;&nbsp;<span class="label">Final</span>: { ' + plot.points.point_f.x.toFixed(0) + "px, " + plot.points.point_f.y.toFixed(0) + 'px }</br>'
	               + '</p>'
		}
	}

	plotContainerLarge.innerHTML = content
	plotContainer.innerHTML = content
}

// Calls the create line and plots two points
function plotPoints(point1, point2, view){
	var p1 = (point1.x / 100) * $("#sample-image-" + view).outerWidth(),
		p2 = (point1.y / 100) * $("#sample-image-" + view).outerHeight(),
		q1 = (point2.x / 100) * $("#sample-image-" + view).outerWidth(),
		q2 = (point2.y / 100) * $("#sample-image-" + view).outerHeight()

	$("#point-container-" + view).append(createLine(p1, p2, q1, q2, view));
}


// Calculates the line's postion, length, and angle
function createLine(x1, y1, x2, y2, view) {

    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha, view);
}

// Creates the line based on the given postion, length, and angle
function createLineElement(x, y, length, angle, view) {
    var line = document.createElement("div");

    var width = $("#sample-image-" + view).outerWidth()
    var height = $("#sample-image-" + view).outerHeight()

  	length = (length / width) * 100 
  	x = (x / width) * 100 
  	y = ((y-0.5) / height) * 100 

    var styles = 'border: 0.5px solid white; '
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
    line.className = target(view)

    return line;
}

// Returns a euclidean value given two points.
function euclidean(p1, p2, q1, q2){

	var v1 = (q1 - p1) * (q1 - p1)
	var v2 = (q2 - p2) * (q2 - p2)

	var euclideanDist = Math.sqrt(v1 + v2)

	return euclideanDist
}

// Returns a measurement by converting a euclidean value.
function convertToActual(euclidean, pixelsPerMetric){
	var measurement = euclidean / pixelsPerMetric

	return measurement
}

// Conversion function
function convertPxToPercent(pixel, view){
  	return (pixel / $("#sample-image-" + view).outerWidth()) * 100 
}

// Conversion function
function convertPercentToPx(percent, dimension){
	return (percent / 100) * dimension
}
