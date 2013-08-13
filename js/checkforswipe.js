$(document).ready(function(){
	width = $(document).width();
	height = $(document).height();

	startPos = {x:0, y:0}
	distance = {x:0, y:0}
	scaledDistance = 0

	swipeTime = 0;

	angle = 0;

	var start_time;
	function start(e) {
	    start_time = new Date();
		startPos.x = e.pageX;
		startPos.y = e.pageY;
		//console.log(start_time + ', ' + startPos.x);
	}
	function end(e) {
	    var now = new Date();
	    swipeTime = (now - start_time)/1000;
		distance.x = e.pageX - startPos.x;
		distance.y = e.pageY - startPos.y;
		angle = Math.atan(distance.y / distance.x) * (180 / Math.PI);

		scaledDistance = Math.sqrt((distance.x / width)^2 + (distance.y / height)^2);
	    //console.log((now-start_time)/1000+', '+endPos.x);
	}

	$(document).mousedown(function(e){
		start(e);
	}).mouseup(function(e){
		end(e);
		console.log("Swiped ",distance.x,"px at an angle of ", angle, "in ",swipeTime, " milliseconds");
		checkForSwipe();
	});	

	checkForSwipe = function(){
		if (Math.abs(angle) <= 45){
			console.log(scaledDistance, swipeTime);
			if (scaledDistance / swipeTime > 100){
				if (distance.x > 0){
					console.log("szl");
				}
				else if (distance.x < 0){
					console.log("fzl");
				}
				else{
					console.log("back");
				}
			}
			else if (Math.abs(distance.x / width) > 0.3) {
				if (distance.x > 0) {
					console.log("szl");
				}
				else if (distance.x < 0){
					console.log("fzl");
				}
			}
			else{
				console.log("back");
			}
		}
		else{
			console.log("do nothing");
		}
	}
});