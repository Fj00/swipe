$(document).ready(function(){
	var index = 0,
		articles = new Array(),
		width = $(document).width(),
		height = $(document).height(),
		left = -width + 'px',
		right = width + 'px',
		szld,
		szlCount = 0,
		isRunning = false;
	articles.push(
		"<p class='articleText'><b>article1 article1 article1 </b>article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1</p>",
		"<p class='articleText'>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 <i>article#2 article#2 article#2 article#2 article#2  article#2 </i>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2</p>",
		"<p class='articleText'>article3 article3 <h1>article3 article3 article3 </h1>article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 </p>",
		"<p class='articleText'>article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>article#4 article#4 article#4 article#4 article#4 <p>article#4 article#4 article#4 article#4 article#4 article#4</p> article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>",
		"<p class='articleText'>article5 <p>article5 article5 article5 article5 article5<p> article5 article5 article5 article5 article5 article5 article5 article5<p>",
		"<h1><a href=''target=''>Giant microwave blaster lets bread stay fresh-ish for over 60 days</a></h1><h2><a href='https://dvice.com/' target='_blank'>DVICE</a> November 30th, 2012 16:46 EST</h2><div id='szzzl-story-long-wrapper'><p><div><div><p class='articleText'>About a third of the bread that consumers buy gets tossed out or fed to ducks who don't know any better after it goes stale or gets moldy. You just cant win with bread- either you keep it moist and gross stuff grows on it, or you dry it out and it turns into a rock. A Texas company says it has a solution, in the form of a huge homogenized microwave cannon.</p><p class='articleText'>Microwaves, being radiation, work quite well at killing things like fungi. The reason that you cant use your microwave to kill fungi is that your microwave sucks, and due to the wavelength of the microwaves used in microwave ovens (just under five inches), you get hot spots and cold spots that show up at half of that wavelength. Microzap's microwave chamber, on the other hand, works differently, and much better. CEO Don Stull explains:</p><div>For the latest tech stories, follow DVICE on Twitter at @dvice or find us on Facebook</div></div></div></p><p><a href='https://dvice.com/archives/2012/11/giant-microwave.php' target='_blank'>Read more</a></p></div>"
	);
	var artPos,
		artLeft;
	$(window).on('resize load', function(){//adjust elements for different screen sizes
		//alert(window.devicePixelRatio);
		var w_box = $(window).width(),
			h_box = $('#stream').height(),	
			w_total = ((w_box - $('.article').width())/2) - 2, //400
			h_total = (h_box - $('.article').height())/2,
			css = {"position": 'absolute',"margin-left": w_total +"px"};
		$('.article').css(css);
		$('#paper0').css('margin-left', w_total + 2 + 'px');
		$('#paper1').css('margin-left', w_total + 4 + 'px');
		$('#paper2').css('margin-left', w_total + 6 + 'px');
		$('#username').css('margin-left', parseInt($('.article').css('margin-left')) + 'px');
		$('#share p').css('margin-right', $('#topArticle').css('margin-left'));
		$('#shareMenu').css('margin-left', '-' + ($('#share p').css('margin-right')))
		artPos = $('#topArticle').css('margin-left');
		artLeft = $('#topArticle').css('left');
		width = $(window).width();
		height = $(window).height();
	});

	console.log($('#content').height())
	console.log($('#stream').height());
	console.log($('.article').height());
	console.log('total: '+ $(document).height());
	console.log('colorbar: '+ $('.colorbar').height());
	console.log('queue: ' + $('#header-container').height());

	$('#topArticle').html(articles[5]);
	$('#queue').on('click','div', function(){//switch top article content with queued content
		$('#queue div').removeClass('rerate');
		$(this).addClass('rerate');
		var contCopy = $(this).contents().clone();
		$('#holder').append(contCopy);
		$('#middleArticle').addClass('requeue').empty().append($('#topArticle').contents());
		$('#topArticle').addClass('rerate').empty().append($('#holder').contents());
		$('#holder').empty();
	});

	szl = function(e){
		if (!isRunning){
			isRunning = true;
			szld = $('#topArticle').contents().clone();
			$('#topArticle').animate({left: '+'+width+"px"},{queue: false,duration: 500, easing: 'swing', complete: function(){
				$(this).remove();
				$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
				$('#bottomArticle').attr('id', 'middleArticle');
				isRunning = false;
				}
			}).css({'box-shadow': '0 0 1em red'});
			createArticle();
			$('#queue div').each(function(){
				$(this).animate({left: parseInt($(this).css('left')) + ($(window).width() * .15) + 'px'},{duration: 500});
			});
			var newDiv = document.createElement('div');
			$('#queue').append($(newDiv).attr('id', 'newSzl' + szlCount).css({
				'position':'absolute', 'width':'20%', 'height':'100%',
				//'left': -($(document).width()),
				'background':'white',
				//'transition':'1s', 'overflow':'hidden',
				'box-shadow':'0 0 .5em black',
				'z-index': szlCount,
				//'transform':'rotateY(-45deg)',
				'left': 0
			}).addClass('szld').css('overflow','hidden').append(szld));
			szlCount += 1;
		}
	}

	fzl = function(e){
		if (!isRunning){
			isRunning = true;
			//$('#topArticle').css('box-shadow', '0 0 1em blue');
			
			$('#topArticle').animate({left: '-'+width+"px"}, {queue: false, duration: 500, easing: 'swing', complete: function(){
				if($(this).hasClass('rerate')) {
					var rerateID = $('#queue .rerate').next('.szld').attr('id');
					$('#queue .rerate').remove();
					$('.szld').each(function(){
					   	var current = $(this).index();
					   	if(current < $("#" + rerateID).index() || rerateID == undefined) {
					     	$(this).animate({left: parseInt($(this).css('left')) - ($(window).width() * .15) + 'px'},{duration: 500});
					   	}
					});
				}
				$(this).remove();
				$('#middleArticle').attr('id', 'topArticle').css('margin-left', artPos).draggable(newArticle);
				$('#bottomArticle').attr('id', 'middleArticle').css('margin-left', artPos);
				isRunning = false;
				}
			}).css({'box-shadow': '0 0 1em blue'});
			createArticle();
		}
	}	
	$('#shareText').click(function(){
		console.log($('#shareMenu').css("height"));
		if ($('#shareMenu').css('display') == 'block'){
			$('#shareMenu').animate({height: 0},500).hide('slow');
		}
		else {

			$('#shareMenu').css("left", ($(window).width() - parseInt($('#shareMenu').css('width')) + 'px'))
			$('#shareMenu').show().animate({height: '938px'}, 500);
		}
	});
	$('#shareMenu a').click(function(){
		$('#shareMenu').animate({height: 0},500).hide();
	});

	createArticle = function(){
		console.log(index);
		var newCont = $("<div id='bottomArticle'></div");//.attr('id', 'bottomArticle');//container for next article
		var contents = $("<div class='articleContent'></div>");
		$('#stream').append(newCont);
		//$('#bottomArticle').addClass('article').html(articles[index]).css('margin-left', artPos);
		if ($('#middleArticle').hasClass('requeue')){
			if(index == 0){
				$('#bottomArticle').addClass('article').html(articles[index + 5]).css('margin-left', artPos);
			} else {
				$('#bottomArticle').addClass('article').html(articles[index-1]).css('margin-left', artPos);
			}
		}
		else {
			$('#bottomArticle').addClass('article').html(articles[index]).css('margin-left', artPos);
			index += 1;
		}
		if (index > 5){ index = 0;}
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
				else {
					$('#topArticle').animate({left: 0 },300);
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
				$('#topArticle').animate({left: 0 },300);
				firstDrag = false;
			}
		}
		else{
			$('#topArticle').animate({left: 0 },300);
		}
	}
	var orig;
	$('#queue').on('mouseenter', 'div', function(event){
		orig = $(this).css('z-index');
		$(this).css('z-index', '100');//.css('transform','rotateY(0deg)').css('z-index', '100');
	}).on('mouseleave', 'div', function(event){
		$(this).css('z-index', orig);//.css('transform','rotateY(-45deg)')
	});

	var windowWidth = $(window).width();
	var rightEdge = (windowWidth - (windowWidth * .10));
	$('#stream').click(function(e){
		e.stopPropagation();
			if (e.pageX < $(document).width() * .10){//within 10% of left edge
				fzl();

			} else if (e.pageX > $(document).width() - ($(document).width() * .10)){//right edge
				szl();
			}
	});

	/////
	var sidevalue = .10;
	$('.arrows').mouseup(function(e){
		if (e.pageX < $(document).width() * sidevalue){//within 10% of left edge
			fzl();

		} else if (e.pageX > $(document).width() - ($(document).width() * sidevalue)){//right edge
			szl();
		}
	});
	var arrows = true;
	$('#content, .arrows').on('mousedown', function(e){
		if (e.pageX > $(document).width() * sidevalue & e.pageX < $(document).width() - ($(document).width() * sidevalue)){
			if (arrows) {
				$('.arrows').fadeIn();
				arrows = false;
				setTimeout(function(){
	                arrows = true;
	            }, 800);
			}
		}
	}).on('mouseup', function(){
		$('.arrows').fadeOut();
	});
});
