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
		$('#topArticle').css("background", "#FF5555");
		$('#topArticle').animate({left: '+'+width+"px"}, 500, 'swing', function(){
			$(this).remove();
			$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
			$('#bottomArticle').attr('id', 'middleArticle');
		});
		createArticle();
		$('#szl-stack div').each(function(){
			$(this).animate({top: parseInt($(this).css('top')) + ($(window).height() * .15) + 'px'}, 500);
		});
		var newDiv = document.createElement('div');
		$('#szl-stack').append($(newDiv).attr('id', 'newSzl' + szlCount));

		$('#newSzl' + szlCount).css({
			'position':'absolute', 'width':'100%', 'height':'20%',
			//'left': -($(document).width()),
			'background':'white',
			//'transition':'1s', 'overflow':'hidden',
			'box-shadow':'0 0 .5em black',
			'z-index': szlCount,
			//'transform':'rotateY(-45deg)',
			'top': 0
		}).addClass('hello');
		szlCount += 1;
	}

	fzl = function(e){
		$('#topArticle').css("background", "#00CCFF").animate({left: '-'+width+"px"}, 500,'swing', function(){
			$(this).remove();
			$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
			$('#bottomArticle').attr('id', 'middleArticle');
		});
		createArticle();
	}	

	createArticle = function(){
		var newCont = $("<div></div").attr('id', 'bottomArticle');//container for next article
		$('#stream').append(newCont);
		$('#bottomArticle').addClass('article').text(index);
		index += 1;
		if (index > 10){ index = 0;}
	}	

	var initial = parseInt($('#topArticle').css('left'));
	var firstDrag = true;
	var newArticle = {
		axis: 'x',
		start: function(ui, event){},
		drag: function(ui,event){},
		stop: function(ui, event){}
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
	}
	function end(e) {
	    var now = new Date();
	    swipeTime = (now - start_time)/1000;
		distance.x = e.pageX - startPos.x;
		distance.y = e.pageY - startPos.y;
		angle = Math.atan(distance.y / distance.x) * (180 / Math.PI);

		scaledDistance = Math.sqrt((distance.x / width)^2 + (distance.y / height)^2);
	}

	$('#content').mousedown(function(e){
		start(e);
	}).mouseup(function(e){
		end(e);
		checkForSwipe();
	});	

	checkForSwipe = function(){
		if (Math.abs(angle) <= 45){
			if (scaledDistance / swipeTime > 3){
				if (distance.x > 0){
					szl();
				}
				else if (distance.x < 0){
					fzl();
				}
				else{
					$('#topArticle').animate({'left': '18%'},300);
				}
			}
			else if (Math.abs(distance.x / width) > 0.25) {
				if (distance.x > 0) {
					szl();
				}
				else if (distance.x < 0){
					fzl();
				}
			}
			else{
				$('#topArticle').animate({'left': '18%'},300);
				firstDrag = false;
			}
		}
		else{
			$('#topArticle').animate({'left': '18%'},300);
		}
	}
	var orig;
	$('#szl-stack').on('mouseenter', '.hello', function(event){
		orig = $(this).css('z-index');
		$(this).css('z-index', '100');//.css('transform','rotateY(0deg)').css('z-index', '100');
	}).on('mouseleave', '.hello', function(event){
		$(this).css('z-index', orig);//.css('transform','rotateY(-45deg)')
	});
});
