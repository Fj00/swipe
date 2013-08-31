document.write('<style type="text/css">body{display:none}</style>');//hide content while jquery sets css
$(document).ready(function(){
	var index = 0,
		articles = [],
		width = $(document).width(),
		height = $(document).height(),
		left = -width + 'px',
		right = width + 'px',
		szld,
		szlCount = 0,
		artPos,
		artLeft,
		duplicate,
		isRunning = false;
	articles.push(
		"<p class='articleText'><b>article1 article1 article1 </b>article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1</p>",
		"<p class='articleText'>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 <i>article#2 article#2 article#2 article#2 article#2  article#2 </i>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2</p>",
		"<p class='articleText'>article3 article3 <h1>article3 article3 article3 </h1>article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 </p>",
		"<p class='articleText'>article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>article#4 article#4 article#4 article#4 article#4 <p>article#4 article#4 article#4 article#4 article#4 article#4</p> article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>",
		"<p class='articleText'>article5 <p>article5 article5 article5 article5 article5<p> article5 article5 article5 article5 article5 article5 article5 article5<p>",
		"<h1><a href=''target=''>Giant microwave blaster lets bread stay fresh-ish for over 60 days</a></h1><h2><a href='https://dvice.com/' target='_blank'>DVICE</a> November 30th, 2012 16:46 EST</h2><div id='szzzl-story-long-wrapper'><p><div><div><p class='articleText'>About a third of the bread that consumers buy gets tossed out or fed to ducks who don't know any better after it goes stale or gets moldy. You just cant win with bread- either you keep it moist and gross stuff grows on it, or you dry it out and it turns into a rock. A Texas company says it has a solution, in the form of a huge homogenized microwave cannon.</p><p class='articleText'>Microwaves, being radiation, work quite well at killing things like fungi. The reason that you cant use your microwave to kill fungi is that your microwave sucks, and due to the wavelength of the microwaves used in microwave ovens (just under five inches), you get hot spots and cold spots that show up at half of that wavelength. Microzap's microwave chamber, on the other hand, works differently, and much better. CEO Don Stull explains:</p><div>For the latest tech stories, follow DVICE on Twitter at @dvice or find us on Facebook</div></div></div></p><p><a href='https://dvice.com/archives/2012/11/giant-microwave.php' target='_blank'>Read more</a></p></div>"
	);
	//could put this in self-executing function
	startSize = $(window).width();
	$(window).on('resize load', function(){//adjust elements for different screen sizes
		//alert(window.devicePixelRatio);
		$('body').show();
		var difference = Math.abs($(window).width() - startSize);

		var adjust = difference / startSize * $(window).width();
		console.log(adjust);
		//console.log(difference);
		var w_box = $(window).width(),
			h_box = $('#stream').height(),
			w_total = ((w_box - $('.article').width())/2) - 2, //400
			h_total = (h_box - $('.article').height())/2,
			css = {"position": 'absolute',"margin-left": w_total +"px"};
		$('.article').css(css);
		$('#paper0').css('margin-left', w_total + 2 + 'px');
		$('#paper1').css('margin-left', w_total + 4 + 'px');
		$('#paper2').css('margin-left', w_total + 6 + 'px');
		$('#username').css('margin-left', parseInt($('.article').css('margin-left'), 10) + 'px');
		$('#share p').css('margin-right', $('#topArticle').css('margin-left'));
		$('#shareMenu').css('margin-left', '-' + ($('#share p').css('margin-right')));
		$('.szld').css('width', '10%');
		$('.szld:last').prevAll().each(function(){
			$(this).css('left', parseInt($(this).css('left'), 10) - 0.10 + 'px');
		});
		artPos = $('#topArticle').css('margin-left');
		artLeft = $('#topArticle').css('left');
		width = $(window).width();
		height = $(window).height();
	});
	//console.log($('#content').height())
	//console.log($('#stream').height());
	//console.log($('.article').height());
	//console.log('total: '+ $(document).height());
	//console.log('colorbar: '+ $('.colorbar').height());
	//console.log('queue: ' + $('#header-container').height());

	$('#topArticle').html(articles[5]);
	$('#queue').on('click','div', function(){//switch top article content with queued content
		//duplicate = true;
		var closestLeft = $(this).next().attr('id');//article to the left of the clicked one
		$(this).remove();
		$('#' + closestLeft).prevAll().each(function(){
			$(this).animate({left: parseInt($(this).css('left'), 10) - ($(window).width() * 0.10) + 'px'},{duration: 500});
		});
		$('#queue div').removeClass('rerate');
		$(this).addClass('rerate');
		var contCopy = $(this).contents().clone();
		//$('#holder').append(contCopy);
		$('#middleArticle').addClass('requeue').empty().append($('#topArticle').contents());
		$('#topArticle').addClass('rerate').empty().append(contCopy);
		//$('#holder').empty();
	});
	var dragged = false;
	szl = function(e){
		//console.log(duplicate);
		if (!isRunning){
			isRunning = true;
			szld = $('#topArticle').contents().clone();
			artText = $('#topArticle').text();
			$('#topArticle').stop(false,false).animate({left: '+'+width+"px"},{queue: false,duration: 500, easing: 'swing', complete: function(){
				$(this).remove();
				$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
				$('#bottomArticle').attr('id', 'middleArticle');
				isRunning = false;
				$('#stream').bind('click');
				}
			}).css({'box-shadow': '0 0 .5em red'});
			createArticle();
			/*$('#queue .szld').each(function(){//loop through szld list
				if ($(this).text() == artText) {//compare text inside topArticle and queue div
					//////console.log('match');
					duplicate = true;
				}
			});*/

			if (duplicate){//if article already in queue, don't add it
				duplicate = false;//next article will be different, so this allows the else block to run
			} else {
				////console.log('add')//if not in queue, add it
			$('#queue').scrollLeft(0);
				$('#queue div').each(function(){
					$(this).animate({left: parseInt($(this).css('left'), 10) + ($(window).width() * 0.10) + 'px'},{duration: 500});
				});
				var newDiv = document.createElement('div');
				$('#queue').append($(newDiv).attr('id', 'newSzl' + szlCount).css({
					'position':'absolute', 'width':'20%', 'height': '90%',
					'background':'white',
					'box-shadow':'0 0 .5em black',
					'z-index': szlCount + 1,
					'top':'10%',
					'left': 0
				}).addClass('szld').css('overflow','hidden').append(szld).scrollLeft(0));
				console.log($('.szld:last').attr('id'));
				$('.szld:last').prevAll().each(function(index){
					$(this).css('top', parseInt($(this).next().css('top'), 10) + (parseInt($(this).next().css('top'), 10) * 0.15) + 'px');
				});
				/*if (dragged) {
				$('#queue').animate({
					left: 0
				}, 500).find('div').css({'box-shadow':'0 0 .8em black', 'z-index':'100'}).end()
					.find('.szld').each(function(){
						$(this).css('z-index', $(this).prev().css('z-index') + 1);
					});
				}*/
				$('#queue, footer').scrollLeft(0);
				$('#queue').animate({left: 0}, 500);
				szlCount += 1;
			}
		}
	};
	fzl = function(e){
		if (!isRunning){
			isRunning = true;
			$('#topArticle').animate({left: '-'+width+"px"}, {queue: false, duration: 500, easing: 'swing', complete: function(){
				if($(this).hasClass('rerate')) {
					var rerateID = $('#queue .rerate').next('.szld').attr('id');
					$('#queue .rerate').remove();
					$('.szld').each(function(){
						var current = $(this).index();
						if(current < $("#" + rerateID).index() || rerateID === undefined) {
							//$(this).animate({left: parseInt($(this).css('left')) - ($(window).width() * .15) + 'px'},{duration: 500});
						}
					});
				}
				$(this).remove();
				$('#middleArticle').attr('id', 'topArticle').css('margin-left', artPos).draggable(newArticle);
				$('#bottomArticle').attr('id', 'middleArticle').css('margin-left', artPos);
				isRunning = false;
				}
			}).css({'box-shadow': '0 0 .5em blue'});
			createArticle();
		}
	};

	//share menu
	$('#shareText').click(function(){
		////console.log($('#shareMenu').css("height"));
		if (parseInt($('#shareMenu').css('height'), 10) > 0){
			$('#shareMenu').animate({height: 0},500);
		}
		else {
			$('#shareMenu').css("left", ($(window).width() - parseInt($('#shareMenu').css('width'), 10) + 'px'));
			$('#shareMenu').animate({height: '938px'}, 500);
		}
	});

	createArticle = function(){
		var newCont = $("<div id='bottomArticle'></div");//.attr('id', 'bottomArticle');//container for next article
		var contents = $("<div class='articleContent'></div>");
		$('#stream').append(newCont);
		//$('#bottomArticle').addClass('article').html(articles[index]).css('margin-left', artPos);
		if ($('#middleArticle').hasClass('requeue')){
			if(index === 0){
				//console.log('its 0');
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
	};

	//var initial = parseInt($('#topArticle').css('left'));
	//var firstDrag = true;
	var newArticle = {
		axis: 'x',
		//start: function(ui, event){},
		//drag: function(ui,event){},
		//stop: function(ui, event){}
	};
	$('.article').draggable(newArticle);

	////
	var start_time,
		startPos = {x:0, y:0},
		distance = {x:0, y:0},
		scaledDistance, swipeTime, swipeAngle = 0;
		//swipeTime = 0,
		//swipeAngle = 0;

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
		swipeAngle = Math.atan(distance.y / distance.x) * (180 / Math.PI);
		scaledDistance = Math.sqrt((distance.x / width)^2 + (distance.y / height)^2);
	}

	$('#content').mousedown(function(e){
		start(e);
	}).mouseup(function(e){
		end(e);
		if (!isRunning) checkForSwipe();
	});

	checkForSwipe = function(){
		if (Math.abs(swipeAngle) <= 45){
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
			else if (Math.abs(distance.x / width) > 0.25){
				if (distance.x > 0) {
					szl();
				}
				else if (distance.x < 0){
					fzl();
				}
			}
			else {
				$('#topArticle').animate({left: 0 },300);
			}
		}
		else {
			$('#topArticle').animate({left: 0 },300);
		}
	};

	$('#queue').on('mouseenter', 'div', function(event){
		//orig = $(this).css('z-index');
		//$(this).css('z-index', '100');//.css('transform','rotateY(0deg)').css('z-index', '100');
	}).on('mouseleave', 'div', function(event){
		//$(this).css('z-index', orig);//.css('transform','rotateY(-45deg)')
	});

	var zCount = {left: 1000, right: 1000};
	var orig;
	$('#queue').draggable({
		axis: "x",
		scroll: false,

		start: function(){
			dragged = true;
		},

		drag: function(){
			/*if ($('.szld:last').offset().left > $(window).width() - ($(window).width() * .10)){
			//return false;
			}*/
			$('.szld').each(function(){
				var szldItem = $(this).offset().left / $(window).width() * 100;
				if (szldItem < 38) {
					$(this).css({//adjust z-index for elements left of center & set top
						"z-index": $(this).prev().css("z-index") - 1, "top": 55 - szldItem + '%'
					});//.css('width', 60 - szldItem + '%');
				} else if (szldItem > 38) {
					//console.log($(this).offset().left / $(window).width() * 100);
					$(this).css('top', -35 + szldItem + '%');
					//console.log('> 39: ', $(this).css('z-index'));
				}

				//set border shadow for central item
				if (szldItem > 38 &&  szldItem < 45) {
					console.log('true');
					console.log($(this).offset().left / $(window).width() * 100);
					//console.log($(this).css('z-index'));
					$(this).css({'z-index' : '200000' , 'box-shadow':'0 0 1em red'});
				}

				//set shadow for peripheral items
				if (szldItem > 45 & szldItem < 55) {
					$(this).css({'z-index' : zCount.right, 'box-shadow':'0 0 .8em black'});
					zCount.right = zCount.right + 1;
				} else if (szldItem < 38 & szldItem > 35) {
					$(this).css({'z-index' : zCount.left, 'box-shadow':'0 0 .8em black'});
					zCount.left = zCount.left + 1;
				}

				/*if (szldItem > -6 & szldItem < 5) {
					$(this).css({'z-index' : '1', 'box-shadow':'0 0 .8em black'});
				}
				if (szldItem > 5 & szldItem < 15) {
					$(this).css({'z-index' : '2', 'box-shadow':'0 0 .8em black'});
				}
				if (szldItem > 15 & szldItem < 25) {
					$(this).css({'z-index' : '3', 'box-shadow':'0 0 .8em black'});
				}
				if (szldItem > 25 & szldItem < 35) {
					$(this).css({'z-index' : '4', 'box-shadow':'0 0 .8em black'});
				}
				if (szldItem > 35 & szldItem < 45) {
					$(this).css({'z-index' : '5', 'box-shadow':'0 0 .8em black'});
				}*/
				/*if (szldItem < 50){
					$(this).css('top', parseInt($(this).next().css('top')) + (parseInt($(this).next().css('top')) * szldItem) + 'px');
				}
				if (szldItem > 49 && szldItem < 51){
					console.log('true');
					$(this).css('top', '10%').css('box-shadow','0 0 .8em red').css('z-index','100').nextAll().each(function(){
					$(this).css('top', parseInt($(this).prev().css('top')) + (parseInt($(this).prev().css('top')) * szldItem / 100) + 'px');
				}).end().prevAll().each(function(){
					$(this).css('top', parseInt($(this).next().css('top')) + (parseInt($(this).next().css('top')) * szldItem / 100) + 'px');
				});
				} else {
					$(this).css('box-shadow','0 0 .5em black');
				}*/
			});
		}
	});


	$('#stream').click(function(e){
		e.stopPropagation();
		if (!isRunning){
			if (e.pageX < $(document).width() * 0.10){//within 10% of left edge
				console.log('fzl');
				fzl();
			} else if (e.pageX > $(document).width() - ($(document).width() * 0.10)){//right edge
				console.log('szl');
				szl();
			}
		}
	});

	/////
	var sidevalue = 0.15,
		arrows = true;
	$('.arrows').mouseup(function(e){
		if (e.pageX < $(document).width() * sidevalue){//within 10% of left edge
			fzl();
		} else if (e.pageX > $(document).width() - ($(document).width() * sidevalue)){//right edge
			szl();
		}
	});
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
