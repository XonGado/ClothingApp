var FimageContainer = $("#image-container-front")
var FpointContainer = $("#point-container-front")
var Fimage = $("#sample-image-front")
var Ffield = $("#click-field-front")

var SimageContainer = $("#image-container-side")
var SpointContainer = $("#point-container-side")
var Simage = $("#sample-image-side")
var Sfield = $("#click-field-side")

FimageContainer.height(Fimage.outerHeight() + "px")
FimageContainer.width(Fimage.outerWidth() + "px")

SimageContainer.height(Simage.outerHeight() + "px")
SimageContainer.width(Simage.outerWidth() + "px")

Ffield.click(function(e){
	saveCoordinate(e, "front")
})

Sfield.click(function(e){
	saveCoordinate(e, "side")
})

$("#undo-front").click(function(){
	undoTarget("front", target("front"))
})

$("#clear-front").click(function(){
	clear("front", target("front"))
})

$("#undo-side").click(function(){
	undoTarget("side", target("side"))
})

$("#clear-side").click(function(){
	clear("side", target("side"))
})

var selectedFront = target("front")
var selectedSide = target("side")

var frontPlots = {
	chest: {point_i: null, point_f: null},
	waist: {point_i: null, point_f: null},
	hips: {point_i: null, point_f: null},
	inseam: {point_i: null, point_f: null},
	neck: {point_i: null, point_f: null},
	sleeve: {point_i: null, point_f: null},
	height: {point_i: null, point_f: null}
}

var sidePlots = {
	chest: {point_i: null, point_f: null},
	waist: {point_i: null, point_f: null},
	hips: {point_i: null, point_f: null},
	neck: {point_i: null, point_f: null}
}

function target(view){
	return $("#" + view + "-view-image-div .toolbar .left input[name='" + view + "-target']:checked").eq(0).val()
}

function next(target){

}

function clear(view, target){
	var elements = $("#point-container-" + view + " ." + target)

	elements.each(function(){
		$(this).remove()
	})

	$("#" + target).val("")
}

function undoTarget(view, target){
	var elements = $("#point-container-" + view + " ." + target)
	if (elements.length % 3 == 0) {
		elements.eq(elements.length - 1).remove()
		elements.eq(elements.length - 2).remove()
	} else {
		elements.eq(elements.length - 1).remove()
	}
}

managePlot(target("front"))

function managePlot(target){
	view = target.split("-")[1]
	target = target.split("-")[0]

	if (view == "f") {

	} else {

	}
}



