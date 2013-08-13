$(document).ready(function(){
	var index = 0,
		articles = new Array(),
		width = $(document).width(),
		height = $(document).height(),
		left = -width + 'px',
		right = width + 'px',
		szld = [],
		szlCount = 0;
	articles.push(
		"<b>article1 article1 article1 </b>article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1",
		"article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 <i>article#2 article#2 article#2 article#2 article#2  article#2 </i>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 ",
		"article3 article3 <h1>article3 article3 article3 </h1>article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 ",
		"<p>article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>article#4 article#4 article#4 article#4 article#4 <p>article#4 article#4 article#4 article#4 article#4 article#4</p> article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 ",
		"article5 <p>article5 article5 article5 article5 article5<p> article5 article5 article5 article5 article5 article5 article5 article5"
	);

	szl= function(e){
		//.log('szled it');
		$('#topArticle').css("background", "#FF5555");
		$('#topArticle').animate({left: '+'+width+"px"}, 500, 'swing', function(){
			$(this).remove();
			$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
			$('#bottomArticle').attr('id', 'middleArticle').draggable(newArticle);
				//firstDrag = true;
		});
		createArticle();
	}

	fzl = function(e){
		//.log('fzled it');
		$('#topArticle').css("background", "#00CCFF");
		$('#topArticle').animate({left: '-'+width+"px"}, 500,'swing', function(){
			$(this).remove();
			$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
			$('#bottomArticle').attr('id', 'middleArticle').draggable(newArticle);
			//firstDrag = true;
		});
		createArticle();
	}	

	createArticle = function(){
		var newCont = $("<div></div").attr('id', 'bottomArticle');//container for next article
		$('#stream').append(newCont);
		$('#bottomArticle').addClass('article').text(index);
		index += 1;
		if (index > 10){ index = 0;}
		//firstDrag = false;		
	}	

	var initial = parseInt($('#topArticle').css('left'));
	var firstDrag = true;
	var newArticle = {
		axis: 'x',
		start: function(ui, event){
			//firstDrag = true;	
		},
		drag: function(ui,event){
			console.log(firstDrag);
			/*if (parseInt($('#topArticle').css('left')) < initial + 1 && firstDrag == true){
				var newCont = $("<div></div").attr('id', 'nextArticle');//container for next article
				$('#stream').append(newCont);
				$('#nextArticle').addClass('article').text('next');
				firstDrag = false;
			}*/
			/*if (parseInt($('#topArticle').css('left')) > $(window).width() * .65){//make szl and fzl functions that removes previous article
				//.log('true');
				$('#topArticle').css("background", "#FF5555");
				$('#topArticle').animate({left: '+'+width+"px"}, 500, 'swing', function(){
					$(this).remove();
					$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
					$('#bottomArticle').attr('id', 'middleArticle').draggable(newArticle);
				//firstDrag = true;
				}).trigger('mouseup');
				//firstDrag = true;
			}*/
		},
		stop: function(ui, event){
			console.log("stop");
		}
	}
	$('.article').draggable(newArticle);

	////
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
		////.log(startPos.x)
		////.log(start_time + ', ' + startPos.x);
	}
	function end(e) {
	    var now = new Date();
	    swipeTime = (now - start_time)/1000;
		distance.x = e.pageX - startPos.x;
		distance.y = e.pageY - startPos.y;
		angle = Math.atan(distance.y / distance.x) * (180 / Math.PI);

		scaledDistance = Math.sqrt((distance.x / width)^2 + (distance.y / height)^2);
	    ////.log((now-start_time)/1000+', '+endPos.x);
	}

	$(document).mousedown(function(e){
		start(e);
	}).mouseup(function(e){
		end(e);
		//.log("Swiped ",distance.x,"px at an angle of ", angle, "in ",swipeTime, " milliseconds");
		checkForSwipe();
	});	

	checkForSwipe = function(){
		if (Math.abs(angle) <= 45){
			////.log(scaledDistance, swipeTime);
			if (scaledDistance / swipeTime > 3){
				if (distance.x > 0){
					szl();
					//.log("szl");
				}
				else if (distance.x < 0){
					fzl();
					//.log("fzl");
				}
				else{
					//.log("back");
					$('#topArticle').animate({'left':'10%'},300);
				}
			}
			else if (Math.abs(distance.x / width) > 0.3) {
				if (distance.x > 0) {
					szl();
					//.log("szl");
				}
				else if (distance.x < 0){
					fzl();
					//.log("fzl");
				}
			}
			else{
				$('#topArticle').animate({'left':'10%'},300);
				//.log("back");
				firstDrag = false;
			}
		}
		else{
			$('#topArticle').animate({'left':'10%'},300);
			//.log("do nothing");
		}
	}
});
