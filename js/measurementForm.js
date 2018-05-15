var FimageContainer = $("#image-container-front")
var FpointContainer = $("#point-container-front")
var Fimage = $("#sample-image-front")
var Ffield = $("#click-field-front")

var SimageContainer = $("#image-container-side")
var SpointContainer = $("#point-container-side")
var Simage = $("#sample-image-side")
var Sfield = $("#click-field-side")

initializeArrays()

FimageContainer.height(Fimage.outerHeight() + "px")
FimageContainer.width(Fimage.outerWidth() + "px")

SimageContainer.height(Simage.outerHeight() + "px")
SimageContainer.width(Simage.outerWidth() + "px")

Ffield.click(function(e){
	saveCoordinate(e, "front", target("front"))
})

Sfield.click(function(e){
	saveCoordinate(e, "side", target("side"))
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

function target(view){
	return $("#" + view + "-view-image-div .toolbar .left input[name='" + view + "-target']:checked").eq(0).val()
}

function index(view, target){
	var selected = $("input[value='" + target + "']")
	return $("#" + view + "-view-image-div .toolbar .left input[name='" + view + "-target']").index(selected)
}

function next(target){

}

function clear(view, target){
	var elements = $("#point-container-" + view + " ." + target)

	elements.each(function(){
		$(this).remove()
	})

	$("#" + target).val("")

	if (view == "front") {
		frontArray[index(view, target)] = []
	} else {
		sideArray[index(view, target)] = []
	}
}

function undoTarget(view, target){
	var elements = $("#point-container-" + view + " ." + target)
	if (elements.length % 3 == 0) {
		elements.eq(elements.length - 1).remove()
		elements.eq(elements.length - 2).remove()
	} else {
		elements.eq(elements.length - 1).remove()
	}

	if (view == "front") {
		frontArray[index(view, target)].pop()
	} else {
		sideArray[index(view, target)].pop()
	}
}

function initializeArrays(){
	var frontVariables = $("#front-view-image-div .toolbar .left input[name='front-target']")
	var sideVariables = $("#side-view-image-div .toolbar .left input[name='side-target']")

	frontArray = new Array(frontVariables.length)
	sideArray = new Array(sideVariables.length)

	for (var i = 0; i < frontArray.length; i++) {
		frontArray[i] = []
	}

	for (var i = 0; i < sideArray.length; i++) {
		sideArray[i] = []
	}
}





