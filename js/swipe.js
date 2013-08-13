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
	
	/* = function(e){
		console.log('szled it');
		$("#article" + index).css("background-color", "#FF5555");
		$("#article" + index).animate({left: '+'+width+"px"},{
			duration: 500, 
			queue: false, 
			easing: 'swing', 
			complete: function(){
				var newDiv = document.createElement('div');
				szld.push($(this).contents());
				$('#header-container').append($(newDiv).attr('id', 'newSzl' + szlCount));
				$('#newSzl' + szlCount).css({
					'position':'absolute',
					'width':'20%',
					'height':'100%',
					'left': $(document).width(),
					'overflow':'auto',
					'background':'white',
					'transition':'1s',
					'overflow':'hidden',
					'left': szlCount * 20 + '%'
				}).append(szld[szld.length - 1]);
				szlCount += 1;
			}
		});
		nextArticle(left)
	}

	fzl = function(e){
		console.log('fzled it');
		$("#article" + index).css("background-color", "#00CCFF");
		$("#article" + index).animate({left: '-'+width+"px"}, 500,'swing');
		if (index === articles.length - 1){
			setTimeout(function(){$('#article' + (articles.length - 1)).remove()},500);
		}
		nextArticle(right);
	}	

	nextArticle = function(direction){
		var clearOld = setTimeout(function(){
			$('#article'+(index - 1)).remove();
		},500);
		console.log(direction);
		index += 1;
		if (index >= articles.length){ index = 0;}
		var newarticle = document.createElement("div");
		$(newarticle).addClass('article').attr("id","article" + index);
		$('.article-container').append(newarticle);
		$(newarticle).css("left", direction );
		document.getElementById('article' + index).innerHTML = articles[index];	
		$(newarticle).animate({"left": '10%'},{duration: 500, queue: false}, function(){});		
	}
	
	$("#content").not('#header-container').on({//need to prevent swipe on header articles from calling function
		'swiperight': szl,
		'swipeleft': fzl
	});*/

	//var newarticle = document.createElement("div");
	var start = parseInt($('#currentArticle').css('left'));
	var newArticle = {
		axis: 'x',
		start: function(ui, event){},
		drag: function(ui,event){
			console.log(event.pageX)
			if (parseInt($('#currentArticle').css('left')) < start + 1){
				console.log('true');
				var newCont = $("<div></div").attr('id', 'nextArticle');//container for next article
				$('#stream').append(newCont);
				$('#nextArticle').addClass('article').text('next');
			}
			if (parseInt($('#currentArticle').css('left')) > $(window).width() * .65){
				console.log('true');
				$('#currentArticle').animate({left: '+'+width+"px"}, 
					{duration: 500, queue: false, 
						complete: function(){
							$(this).remove()
						}
				}).trigger('mouseup');
				$('#nextArticle').animate({'left':'10%'}, {duration: 500, complete: function(){
					$('#nextArticle').attr('id','currentArticle').draggable(newArticle)}
				});
			}
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
		console.log(startPos.x)
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
					$('#currentArticle').animate({left: width+"px"}, 500,'swing');
					console.log("szl");
				}
				else if (distance.x < 0){
					$('#currentArticle').animate({left: '-'+width+"px"}, 500,'swing');
					console.log("fzl");
				}
				else{
					console.log("back");
					$('#currentArticle').animate({'left':'10%'},300);
				}
			}
			else if (Math.abs(distance.x / width) > 0.3) {
				if (distance.x > 0) {
					$('#currentArticle').animate({left: width +"px"}, 500,'swing');
					console.log("szl");
				}
				else if (distance.x < 0){
					$('#currentArticle').animate({left: '-'+width+"px"}, 500,'swing');
					console.log("fzl");
				}
			}
			else{
				$('#currentArticle').animate({'left':'10%'},300);
				console.log("back");
			}
		}
		else{
			console.log("do nothing");
		}
	}
});

