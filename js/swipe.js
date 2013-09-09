document.write('<style type="text/css">body{display:none}</style>');//hide content while jquery sets some css
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
	//could put this in self-executing function?
	startSize = $(window).width();
	$(window).on('resize load', function(){//adjust elements for different screen sizes
		//alert(window.devicePixelRatio);
		$('body').show();
		var difference = Math.abs($(window).width() - startSize);

		var adjust = difference / startSize * $(window).width();
		//console.log(adjust);
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
		$('#share').css('margin-left', parseInt($('#topArticle').css('margin-left'), 10) * -1 + 'px' );
		//$('#shareMenu').css('margin-left', '-' + ($('#share').css('margin-left')));
		$('#shareMenu').css("left", ($(window).width() - parseInt($('#shareMenu').css('width'), 10) + 'px'));
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

	//$('#topArticle').html(articles[5]);
	var dragged = false;
	$('#queue').on('click','div', function(){//switch top article content with queued content
		var closestLeft = $(this).next().attr('id');//article to the left of the clicked one
		$(this).remove();
		//if leftmost one clicked
		if(closestLeft == undefined){
			console.log('true');
			$('.szld').each(function() {
				$(this).animate({left: parseInt($(this).css('left'), 10) - ($(window).width() * 0.10) + 'px'},{duration: 300, complete: function(){
					$('.szld').each(function(){
					var szldItem = $(this).offset().left / $(window).width() * 100;
					if (szldItem > 0){
						$(this).animate({'top': 8 + (szldItem/2) + '%'}, {duration:  300, queue: false});
						$('.szld:last').css('top', '10%');
			
					}
					if ($('.szld').length == 1){
						$('.szld').css('top', '10%');
					}
					});

				}});
			});
		} else {
			$('#' + closestLeft).prevAll().each(function(){
				$(this).animate({left: parseInt($(this).css('left'), 10) - ($(window).width() * 0.10) + 'px'},{duration: 300, complete: function(){
					$('.szld').each(function() {
						var szldItem = $(this).offset().left / $(window).width() * 100;
						if (szldItem > 5){
							$(this).animate({'top': 8 + (szldItem/2) + '%'}, {duration:  300, queue: false});
						}
					});
				}});
			});
		}
		$('#queue div').removeClass('rerate');
		$(this).addClass('rerate');
		var contCopy = $(this).contents().clone();
		$('#middleArticle').addClass('requeue').empty().append($('#topArticle').contents());
		$('#topArticle').addClass('rerate').empty().append(contCopy);
	});

	szl = function(e){
		if (!isRunning){
			isRunning = true;
			var szld = $('#topArticle').contents().clone();
			var thecontent = [];
			thecontent.push(szld);
			//var theIMG = $('#topArticle').find('img').clone();  // pull out just the img from article content
			var artText = $('#topArticle').text();
			$('#topArticle').animate({left: '+'+width+"px"},{queue: false,duration: 500, easing: 'swing', complete: function(){
				$(this).remove();
				$('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
				$('#bottomArticle').attr('id', 'middleArticle');
				isRunning = false;
				$('#stream').bind('click');
				}
			}).css({'box-shadow': '0 0 .5em red'});
			createArticle();
			if (duplicate){//if article already in queue, don't add it
				duplicate = false;//next article will be different, so this allows the else block to run
			} else {
				////console.log('add')//if not in queue, add it
			$('#queue').scrollLeft(0);
				$('#queue div').each(function(){
					$(this).animate({left: parseInt($(this).css('left'), 10) + ($(window).width() * 0.10) + 'px'},{duration: 500});
				});
				var newDiv = document.createElement('div');
				$('#queue').append($(newDiv).attr('id', 'newSzl' + szlCount).css({  //use szlcount number as position in array to pull text from
					'position':'absolute', 'width': width * 0.2 + 'px', 'height': '90%',
					'background':'white',
					'border': '1px solid #FF4D4D',
					'box-shadow':'0 0 1em #FF4D4D',
					'z-index': szlCount + 1,
					'top':'10%',
					'left': 0
				}).addClass('szld').css('overflow','hidden').append(szld).scrollLeft(0));
				$('#queue').css('width', $('#queue').width() + $('.szld').width() + 'px');
				//console.log('last in queue: ' + $('.szld:last').attr('id'));
				//console.log($('#queue').width());
				$('.szld:last').prevAll().each(function(index){
					$(this).css({'z-index' : $(this).next().css('z-index') - 1,
					'box-shadow': '0 0 .8em black', 'border':'none',
					//old one
					//'top': parseInt($(this).next().css('top'), 10) + (parseInt($('#queue').css('height'), 10) * 0.05) + 'px'});
					
					//'top': parseInt($(this).next().css('top'), 10) + (($(this).position().top + szldItem)/5) + 'px'}); //drop gets larger
					//'top': parseInt($(this).next().css('top'), 10) + (index * -2) + 20 + 'px'}); // drop gets smaller
					//'top': Math.round(parseInt($(this).next().css('top'), 10) + Math.abs( (index * -1) + ($(window).width() - $(this).offset().left) / 80 ) / 100) + '%'//drop gets larger as %
					'top': (parseInt($(this).next().css('top'), 10) / $('#queue').height()) * 75  +  Math.round(parseInt($('.szld:last').css('top'), 10) * 2) + '%'
					//'top': ( parseInt($(this).next().css('top'), 10) + Math.round(Math.abs( (index * -1) + (parseInt($('#queue').css('height'), 10) * 0.08) )) )/ parseInt($('#queue').css('height'), 10) * 100 + '%'}); // drop gets smaller
					});
					//console.log((parseInt($(this).next().css('top'), 10) / $('#queue').height()) * 100  +  parseInt($('.szld:last').css('top'), 10) + 'px');
				
				});
				$('#queue, footer').scrollLeft(0);
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

	createArticle = function(){
		var newCont = $("<div id='bottomArticle'></div");//container for next article
		var contents = $("<div class='articleContent'></div>");
		$('#stream').append(newCont);
		if ($('#middleArticle').hasClass('requeue')){
			if(index === 0){
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

	var newArticle = {
		axis: 'x',
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

	var orig;
	var prevX = -1;
	$('#queue').draggable({
		axis: "x",
		scroll: false,
		start: function(ui, e){
			dragged = true;
				$('.szld').each(function(){
					console.log($(this).offset().left);
				});
		},

		drag: function(e, ui){
			$('.szld').each(function(){
				//article with focus in center
				var szldItem = $(this).offset().left / $(window).width() * 100;
				/*if (szldItem < 40) {
					console.log('< 38');
					$(this).css({//adjust z-index for elements left of center & set top
						"z-index": $(this).prev().css("z-index") - 1, "top": 50 - szldItem + '%'});//.css('width', 60 - szldItem + '%');
				} else if (szldItem > 40) {
					console.log('> 38: ' + $(this).offset().left / $(window).width() * 100);
					$(this).css({'top': -30 + szldItem + '%'});
				}

				//set border shadow for central item
				if (szldItem > 35 &&  szldItem < 45) {
					console.log('38-48: ' + $(this).offset().left / $(window).width() * 100);
					$(this).css({
						'z-index': '200000',
						'box-shadow':'0 0 1em #33FF33',
						'border': '1px solid #33FF33'
					});
					$(this).nextAll().css({'border':'none', 'box-shadow':'0 0 .8em black'});
					$(this).prevAll().css({'border':'none', 'box-shadow':'0 0 .8em black'});
					console.log($(this).closest());
				}

				//set shadow for peripheral items
				if (szldItem > 48 && szldItem < 55) {
					console.log('48-55');
					$(this).css({'z-index' : $(this).closest().css('z-index') - 1});
					//zCount.right = zCount.right + 1;
				}*/

				//////article with focus on left
				/*var firstPos = $('.szld').filter(function() {
				    return $(this).offset().left == 0;
				});*/
				//console.log($(firstPos).attr('id'));
				
				if (szldItem < 0) {
					/*var nextTop1 = parseInt($(this).prev().css('top'), 10) / $('#queue').height() * 100;
					var thisTop1 =parseInt($(this).css('top'), 10) / $('#queue').height() * 100;
					var nextLeft1 = parseInt($(this).prev().css('left'), 10) / $(window).width() * 100;
					var thisLeft1 = parseInt($(this).css('left'), 10) / $(window).width() * 100;
					var theirTopDiff1 = nextTop1 - thisTop1;
					var theirLeftDiff1 = nextLeft1 - thisLeft1;
					console.log(index + ': ' + theirTopDiff1 / theirLeftDiff1);
					//$(this).css({"z-index": $(this).prev().css("z-index") - 1, "top": 8 - (szldItem/2) + '%'});
					//adjust z-index for elements left of center & set top*/
					$(this).css({
						//"top": '10%',
						"z-index": $(this).prev().css("z-index") - 1
					});
					//parseInt($(this).prev().css('top'), 10)/ $('#queue').height() + ($('#queue').height() * 0.2) + '%'//do something based on left position
					
				}
				if (szldItem > 0) {
					/*var minTop = ($('#queue').height() * 0.10);
					var nextTop = parseInt($(this).next().css('top'), 10) / $('#queue').height() * 100;
					var thisTop = parseInt($(this).css('top'), 10) / $('#queue').height() * 100;
					var nextLeft = parseInt($(this).next().css('left'), 10) / $(window).width() * 100;
					var thisLeft = parseInt($(this).css('left'), 10) / $(window).width() * 100;
					var theirTopDiff = thisTop - nextTop;
					var theirLeftDiff = thisLeft - nextLeft;*/
					//console.log(index + ': ' + theirTopDiff / theirLeftDiff);
					//console.log($(this).offset().left);
					$(this).css({'top': 100 * (1.0-Math.min(1.0,(0.75 + ( 0.25/ (Math.exp(0.008*$(this).offset().left))) )) ) + '%'});
					//this.top - (difference between this.top and 10% of queue height) / this left offset ?
					//as drag left, 'this' should go up by the difference in top position divided by difference in left position?
					//console.log('% top of next: ' + parseInt($(this).next().css('top'), 10) / $('#queue').height() + '%');
					//$(this).css({'top': 8 + (szldItem/2) + '%'});
					//$(this).css({'top': ($(window).width() -  $(this).offset().left) /20 + (parseInt($(this).next().css('top'), 10) / $('#queue').height()) * 100 + '%' });
				}

				//set border shadow for central item
				if (szldItem > -5 &&  szldItem < 5) {
					$(this).css({
						'z-index': '200000',
						'box-shadow':'0 0 1em #FF4D4D',
						'border': '1px solid #FF4D4D'
					});
					$(this).nextAll().css({'border':'none', 'box-shadow':'0 0 .8em black'});
					$(this).prevAll().css({'border':'none', 'box-shadow':'0 0 .8em black'});
				}

				//set shadow for peripheral items
				if (szldItem > 8 && szldItem < 15) {
			
					$(this).css({'z-index' : $(this).closest().css('z-index') - 1});
				}
			});

			
				/*if(prevX == -1) {
					prevX = e.pageX;
					//return false;
				}
				// dragged left
				if(prevX > e.pageX) {
					//console.log('dragged left');
					$('.szld').each(function() {
						$(this).width($(this).width() - 1);
					});
				}
				
				else if(prevX < e.pageX) { // dragged right
					$('.szld').each(function() {
						$(this).width($(this).width() + 1);
					});
					//console.log('dragged right');
					/*console.log($('.szld:last').offset().left)
					if ($('.szld:last').offset().left > 0){
						console.log('go')
						//ui.containment = 'parent';
						$(ui.helper).offset().left = 0;
						//$(e.toElement).trigger('mouseup');
						//ui.revert = true;
						//$(e.toElement).trigger('mouseup');

						/*var w1 = ui.helper.outerWidth(),
						w2 = $container.width();
						//console.log([ui.position.left, w1, w2].join(' : '));
						ui.position.left = Math.max(Math.min(ui.position.left, w2 - w1), 0);
					}
				}
				prevX = e.pageX;*/
			},

		stop: function(event){
			//http://stackoverflow.com/questions/3486760/how-to-avoid-jquery-ui-draggable-from-also-triggering-click-event/13973319#13973319
			$(event.toElement ).one('click', function(e){
				e.stopImmediatePropagation();
			});
			if ($('.szld:last').offset().left > 0 || $('.szld:first').offset().left < 0){
				$('#queue').animate({left: 0}, {duration: 300, queue: false, complete: function(){
					$('.szld').each(function(){
						var szldItem = $(this).offset().left / $(window).width() * 100;
						$(this).animate({ top: 8 + (szldItem/2) + '%'}, {duration: 300, queue: false});
						$(this).css({'z-index' : $(this).closest().css('z-index') - 1});
					});
					$('.szld:last').prevAll().each(function(){
						$(this).css({'z-index' : $(this).next().css('z-index') - 1});
					});
				}});
				$('.szld').css({'box-shadow':'0 0 1em black','border': 'none'});
				$('.szld:last').css({'box-shadow':'0 0 1em #FF4D4D','border': '1px solid #FF4D4D'});
			}
		}
	});

	$('#stream').click(function(e){
		e.stopPropagation();
		if (!isRunning){
			if (e.pageX < $(document).width() * 0.10){//within 10% of left edge
				fzl();
			} else if (e.pageX > $(document).width() - ($(document).width() * 0.10)){//right edge
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
