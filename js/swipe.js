document.write('<style type="text/css">body{display:none}</style>');//hide content while jquery sets some css

$(document).ready(function(){
	var index = 0,
		articles = [],
		width = $(window).width(),
		height = $(window).height(),
		left = -width + 'px',
		right = width + 'px',
		szld,
		szlCount = 0,
		artPos,
		artLeft,
		duplicate,
		isRunning = false,
		dragged = false,
		startHeight = 85,
		$article = $('#stream div.article'),
		$szlQueue = $('#queue'),
		$topArticle = $('#topArticle'),
		$middleArticle = $('#middleArticle'),
		startSize = $(window).width(),
		overlap = $(window).width() * 0.10,
		current,
		theContent = [],
		pos = [],
		theTime = [],
		swipeStartTime,
		startPos = {x:0, y:0},
		distance = {x:0, y:0},
		scaledDistance, swipeTime, swipeAngle = 0,
		dragStartTime,
		startPoint,
		endPoint,
		sidevalue = 0.15,
		arrows = true;

	articles.push(
		"<p class='articleText'><b>article1 article1 article1 </b>article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1</p>",
		"<p class='articleText'>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 <i>article#2 article#2 article#2 article#2 article#2  article#2 </i>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2</p>",
		"<p class='articleText'>article3 article3 <h1>article3 article3 article3 </h1>article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 </p>",
		"<p class='articleText'>article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p><p>article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4</p> <p>article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>",
		"<p class='articleText'>article5 <p>article5 article5 article5 article5 article5<p> article5 article5 article5 article5 article5 article5 article5 article5<p>",
		"<h1><a href=''target=''>Giant microwave blaster lets bread stay fresh-ish for over 60 days</a></h1><h2><a href='https://dvice.com/' target='_blank'>DVICE</a> November 30th, 2012 16:46 EST</h2><div id='szzzl-story-long-wrapper'><p><div><div><p class='articleText'>About a third of the bread that consumers buy gets tossed out or fed to ducks who don't know any better after it goes stale or gets moldy. You just cant win with bread- either you keep it moist and gross stuff grows on it, or you dry it out and it turns into a rock. A Texas company says it has a solution, in the form of a huge homogenized microwave cannon.</p><p class='articleText'>Microwaves, being radiation, work quite well at killing things like fungi. The reason that you cant use your microwave to kill fungi is that your microwave sucks, and due to the wavelength of the microwaves used in microwave ovens (just under five inches), you get hot spots and cold spots that show up at half of that wavelength. Microzap's microwave chamber, on the other hand, works differently, and much better. CEO Don Stull explains:</p><div>For the latest tech stories, follow DVICE on Twitter at @dvice or find us on Facebook</div></div></div></p><p><a href='https://dvice.com/archives/2012/11/giant-microwave.php' target='_blank'>Read more</a></p></div>"
	);

	//TODO: orientation change messes up element sizes

	//adjust elements for different screen sizes and when orientation changes
	$(window).on('resize load orientationchange', function(){
		//alert(window.devicePixelRatio);
		$('body').show();
		//article overlaps 10% of adjacent article
		var overlap = $(window).width() * 0.10,
			difference = (($(window).width()/startSize * 100) - 100),//% difference between initial width and current width
			szldWidth = ($(window).width() * 0.2)  + (difference/5),
			w_box = $(window).width(),
			h_box = $('#stream').height(),
			w_total = ((w_box - $('.article').width())/2) - 2,
			h_total = (h_box - $('.article').height())/2,
			css = {"position": "absolute", "margin-left": w_total +"px"};

		$('.article').css(css);
		$('#paper0').css('margin-left', w_total + 2 + 'px');
		$('#paper1').css('margin-left', w_total + 4 + 'px');
		$('#paper2').css('margin-left', w_total + 6 + 'px');
		$('#username').css('margin-left', parseInt($('.article').css('margin-left'), 10) + 'px');
		$('#share').css('margin-left', parseInt($('#topArticle').css('margin-left'), 10) * -1 + 'px' );
		$('#shareMenu').css("left", ($(window).width() - parseInt($('#shareMenu').css('width'), 10) + 'px'));
		//TODO: adjust szld items on window resize
			if($('.szld').length){
				$('.szld').css({
					//'left': parseInt($(this).css('left'), 10) - 0.10 + 'px',
					'width': szldWidth
					///'left': $(this).offset().left + (difference * $(this).offset().left)
				});
				console.log($('.szld').width());
			}
		artPos = $('#topArticle').css('margin-left');
		artLeft = $('#topArticle').css('left');
		width = $(window).width();
		height = $(window).height();
	});

	//$('#topArticle').html(articles[5]);
	//return nonlinear top value based on the element's left offset
	adjustTop = function(offset){
		return 100 * (1.0-Math.min(0.98,(0.75 + ( 0.25/ (Math.exp(0.003*offset))) )) ) + '%';
	};

	szl = function(e){
		if (!isRunning){
			isRunning = true;
			var szld = $('#topArticle').html();
			var newContainer = $('<div id="new"></div>').append(szld);
			$topArticle = $('#topArticle');
			theContent.push(szld);
			//console.log(theContent);
			//var theIMG = $('#topArticle').find('img').clone();  // pull out just the img from article content
			var artText = $topArticle.text();
			$topArticle.animate({left: width},{queue: false, duration: 500,
				complete: function(){
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
				//if not in queue, add it
				if (szlCount > 0){
					$queueItems.each(function(){
						var cssLeft = parseInt($(this).css('left'), 10);
						$(this).animate({left: cssLeft + overlap + 'px'},{duration: 500, 
							complete:function(){
								//queueDrag.containment = [-1 * ($('.szld').eq(0).offset().left + overlap), 0, $(window).width()/2, 0];//adjust left containment based on far right item in queue
							}
						});
					});
				}
				//create new div, add it to queue, append contents from szld article
				newDiv = document.createElement('div');
					$(newDiv).addClass('szld');
					$('#queue').append($(newDiv)
						.addClass('szld')
						.attr('id', 'newSzl' + szlCount)
						.css({'width': $(window).width() * 0.20, 'z-index': szlCount + 1}));
				$(theContent).each(function(index){
					//console.log(theContent[index]);
					$('#newSzl' + szlCount).append(theContent[szlCount]);
				});
				$queueItems = $('#queue div.szld');
				if ($queueItems.length > 11){
					$queueItems.eq(0).remove();
				}
				console.log($queueItems.length);
				/*var newDiv = document.createElement('div');
				$szlQueue.append($(newDiv).attr('id', 'newSzl' + szlCount).addClass('szld').css({  //use szlcount number as position in array to pull text from 
					'width': $(window).width() * 0.20,
					'z-index': szlCount + 1
				}).append(szld));*/
				szlCount += 1;
				//$queueItems = $('#queue div.szld');
				$lastSzld = $queueItems.filter(':last');

				//TODO: adding new item when last one is off screen messes up previous items
				//reposition queue so the newest item added is visible
				$szlQueue.animate({left: 0},{duration: 300,
					step: function(){
						$queueItems.each(function(){
							//console.log($(this).css('left') + ' ,' + $(this).offset().left);
							$(this).css({
								'top': adjustTop($(this).offset().left),
								'height': startHeight - ($(this).position().top)/2 + '%'
							});
						});
					}
				});

				//set descending z-indexes for items after the newly added item
				$lastSzld.prevAll().each(function(index){
					$(this).css({'z-index' : $(this).next().css('z-index') - 1,
					'box-shadow': '0 0 .8em black', 'border':'none'});
				});

				//if not kindle..
				if (navigator.userAgent.indexOf("Silk") == -1) {
					$szlQueue.css('width', $('#queue').width() + ($queueItems.width() * 0.90));
				} else alert('kindle');

				//initialize draggable queue with updated containment property
				$szlQueue.draggable(queueDrag);
			}
		}
	};
	fzl = function(e){
		if (!isRunning){
			isRunning = true;
			$('#topArticle').animate({left: '-'+width+"px"}, {queue: false, duration: 500, easing: 'swing', complete: function(){
				if($(this).hasClass('rerate')) {
					var rerateID = $('#queue .rerate').next('.szld').attr('id');
					$('#queue div.rerate').remove();
					$queueItems.each(function(){
						var currentItem = $(this).index();
						if(currentItem < $("#" + rerateID).index() || rerateID === undefined) {
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
		var newCont = $("<div id='bottomArticle'></div");  //container for next article
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

	//enable article dragging
	var newArticle = {
		axis: 'x',
	};
	$article.draggable(newArticle);

	
	function start(e) {
		swipeStartTime = new Date();
		startPos.x = e.pageX;
		startPos.y = e.pageY;
	}

	function end(e) {
		var now = new Date();
		swipeTime = (now - swipeStartTime)/1000;
		distance.x = e.pageX - startPos.x;
		distance.y = e.pageY - startPos.y;
		swipeAngle = Math.atan(distance.y / distance.x) * (180 / Math.PI);
		scaledDistance = Math.sqrt((distance.x / width)^2 + (distance.y / height)^2);
		if (!isRunning) checkForSwipe();
	}

	$('#content').mousedown(function(e){
		start(e);
	}).mousemove(function(e){
		//console.log(e.pageX);
	}).mouseup(function(e){
		end(e);
	});

	checkForSwipe = function(){
		$topArticle = $('#topArticle');
		if (Math.abs(swipeAngle) <= 45){
			if (scaledDistance / swipeTime > 3){
				if (distance.x > 0){
					szl();
				}
				else if (distance.x < 0){
					fzl();
				}
				else {
					$topArticle.animate({left: 0 },300);
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
				$topArticle.animate({left: 0 },300);
			}
		}
		else {
			$topArticle.animate({left: 0 },300);
		}
	};

	//

	//set queue item z-indexes based on their position
	setZ = function(szldItem, $this){
		if (szldItem < 0) {
			$this.css({
				"z-index": $this.prev().css("z-index") - 1
			});
		}
		if (szldItem > 0) {
			$this.css({
				'top': adjustTop($this.offset().left),
				'height': startHeight - ($this.position().top)/2 + '%',//adjust height in relation to top position
			});
		}

		//set border shadow for central item
		if (szldItem > -5 &&  szldItem < 5) {
			$this.css({
				'z-index': '200000',
				'box-shadow':'0 0 1em #FF4D4D',//take out red
				'border': '1px solid #FF4D4D'
			}).siblings().css({'border':'none', 'box-shadow':'0 0 .8em black'});
		}
	};
	
	//object passed to draggable method
	var lastSzldID;
	var queueDrag = {
		axis: "x",
		scroll: false,

		start: function(ui, e){
			dragged = true;
            dragStartTime = new Date();
            console.log(Date.now());
            var lastSzld = $('.szld:last');
                lastSzldID = $('.szld:last').attr('id');
            console.log(lastSzld);
		},

		drag: function(e, ui){
			queueDrag.containment = [-1 * ($('.szld').eq(0).offset().left + overlap), 0, $(window).width()/2, 0];
			$queueItems.each(function(){
				var szldItem = $(this).offset().left / $(window).width() * 100;
				//////article with focus on left
				var $this = $(this);
				setZ(szldItem, $this);

				//set shadow for peripheral items
				if (szldItem > 8 && szldItem < 15) {
					//$(this).css({'z-index' : $(this).closest().css('z-index') - 1});
				}
				if ($(this).offset().left > 0 && $(this).offset().left < overlap){
					var rotation = (-90 * (1-($(this).offset().left/overlap)));
					if (rotation >= -45){
						$(this).next().offset({left:0}).css({
							//'left':'1px',
							'transform-origin' : '0px 0px' ,
							'perspective-origin': '0% 50%',
							'transform' : 'perspective( 600px ) rotateY('+ 2 * rotation +'deg)'
						});
					}
				} else if ($(this).offset().left >= overlap){
					$(this).next().css({
						'transform' : 'perspective( 600px ) rotateY(0deg)'
					});
				}
			});
			current = new Date();
			theTime.push(current);
			pos.push(e.pageX);

			//add a new item to the right side when ones rotates off of the left side
			var lastOne = $('.szld').length - 1;//get the eq position of the last one on the left
			//console.log(lastOne);
			//console.log($('.szld:last').index());
			//console.log($('.szld').eq(lastOne).attr('id'));

			//if the offset of the last one on the left becomes < 0..
			if ($('.szld').eq(lastOne).offset().left < 0 ){
				//remove it
				$('.szld').eq(lastOne).remove();
				//console.log('true');
				//console.log($('.szld').eq(0).attr('id'));
				//console.log(theContent.length - $queueItems.length);

				newDiv = document.createElement('div');//create new div
				$('#queue').prepend($(newDiv)//add it to the first position (the right)
					.addClass('szld')
					.attr('id','newSzl' + (theContent.length - $queueItems.length))//give it a numbered ID that's one less than its left neighbor
					.css({
						'width': $(window).width() * 0.20,
						'z-index': $(this).next().css('z-index') - 1,
						'left': parseInt($('.szld').eq(0).css('left'), 10) + overlap + 'px'
					}));

				//append corresponding content from content array
				$('#newSzl' + (theContent.length - $queueItems.length)).append(theContent[theContent.length - $queueItems.length])
					//give it appropriate top & height value **doesn't do anything yet
					.css({
						'top': adjustTop($(this).offset().left),
						'height': startHeight - ($(this).position().top)/2 + '%'
					});
				//adjust containment to prevent last one on the right from being dragged off left side
				queueDrag.containment = [-1 * ($('.szld').eq(0).offset().left + overlap), 0, $(window).width()/2, 0];
			}
		},

		stop: function(e, ui){
			var endTime = Date.now(),
				endPoint = e.pageX;
				pos.push(endPoint);
				theTime.push(endTime);
				timeDiff = ((endTime - dragStartTime)/1000);
				distance = Math.abs((endPoint - pos[0]));
				velocity = distance/timeDiff;
				//console.log(theTime.length + ', ' + pos.length);

			//time and distance between final two points during drag
				endOfDragDistance = Math.abs( pos[pos.length - 1] - pos[pos.length - 2] );
				endOfDragTime = ( theTime[theTime.length - 1] - theTime[theTime.length - 2] );
				finalVelocity = endOfDragDistance/endOfDragTime;

				//console.log(endOfDragDistance + 'px');
				//console.log(endOfDragTime + 'ms');
				//console.log(finalVelocity);
				
				//animate drag continuation based on final velocity
				$(this).animate({ left: (endPoint < pos[0]) ?
					$(this).offset().left + (-1 * endOfDragDistance/100 * velocity) :
					$(this).offset().left + (endOfDragDistance/100 * velocity) }, {
						duration: 300, easing: 'easeOutCirc',//duration should be length of time it takes the velocity to decay 
						step: function(){
							//decrement velocity for deceleration
							//console.log(velocity);
							//console.log(finalVelocity);
							velocity = Math.exp(-0.5 * finalVelocity);
							finalVelocity += 0.05;
							//console.log(velocity);
							//velocity -= 0.01;
							/*if ($(this).offset().left > 0 && $(this).offset().left < overlap){
							var rotation = (-90 * (1-($(this).offset().left/overlap)));
								if (rotation >= -45){
									$(this).next().offset({left:0}).css({
										//'left':'1px',
										'transform-origin' : '0px 0px' ,
										'perspective-origin': '0% 50%',
										'transform' : 'perspective( 600px ) rotateY('+ 2 * rotation +'deg)'
									});
								}

							}*/
							$('.szld').each(function(){
								var $this = $(this);
								var szldItem = $(this).offset().left / $(window).width() * 100;
								if ($(this).offset().left >= overlap){
									$(this).next().css({
										'transform' : 'perspective( 600px ) rotateY(0deg)'
									});
								}
								setZ($this, szldItem);
							});
						}
				});
 
				//fresh arrays for next drag
				pos = [];
				theTime = [];

			//http://stackoverflow.com/questions/3486760/how-to-avoid-jquery-ui-draggable-from-also-triggering-click-event/13973319#13973319
			var leftBound = ( (e.pageX > $(window).width() * 0.38) ? leftBound = -5 : leftBound = 0 ),
				rightofZero = $('.szld').filter(function() {
					return ($(this).offset().left > 0 && $(this).offset().left < ($(window).width() * 0.10));
				}),
				theID = $(rightofZero).attr('id');//needs a better name*/
			
			//prevent click from firing if touchend is over one of the szld elements
			$(e.toElement ).one('click', function(e){
				e.stopImmediatePropagation();
			});

			//adjust elements left based on initial distance of 'rightofZero' at time of mouseup
			/*$(rightofZero).next().prevAll().each(function(){
				$(this).animate({ left: $(this).position().left + (($(window).width() * 0.10) - $(rightofZero).offset().left)}, {duration: 500,
					//reset rotate back to 0 as elements reset right
					step:function(){
						$('#' + theID).next().css({
							'transform-origin' : '0px 0px' ,
							'perspective-origin': '0% 50%',
							'transform' : 'perspective( 600px ) rotateY('+ (-90 * (1-($('#' + theID).offset().left/($(window).width() * 0.10)))) +'deg)'
						});
					}
				});
			});*/

			//TODO: left containment gets further left after dragging back and forth
			//move queue back to initial position when last szld element is > 0
			if ($lastSzld.offset().left > 0){
				$szlQueue.stop().animate({left: leftBound}, {duration: (Math.abs($lastSzld.offset().left) > $(window).width() * 0.25 ? Math.abs($lastSzld.offset().left) : 300),
					step: function(){
						rightofZero = $('.szld').filter(function() {
							return ($(this).offset().left > 0 && $(this).offset().left < ($(window).width() * 0.10));
						});
						$(rightofZero).each(function(){
							$(this).next().css({'transform-origin' : '0px 0px' ,
							'transform' : 'perspective( 600px ) rotateY(0deg)'});
						});
						$queueItems.each(function(){
							$(this).css({
								'top': adjustTop($(this).offset().left) ,
								'height': startHeight - ($(this).position().top)/2 + '%',
								//adjust left position of items if they've shifted further right during dragging
								'left': $(this).offset().left - ($('.szld:last').offset().left - 5)
							});
						});
					//reset z's if they're out of order after dragging fast
					//TODO: prevent them from getting out of order in the first place
					$lastSzld.prevAll().each(function(){
						$(this).css({'z-index' : $(this).next().css('z-index') - 1});
					});
					//$(this).css({'z-index' : $(this).closest().css('z-index') - 1});
					}, complete: function(){
						//queue bounces back after hitting left edge
						if (e.pageX > $(window).width() * 0.38){
							$(this).animate({left: 0}, 400);
						}
					}
				});
				$queueItems.css({'box-shadow':'0 0 1em black','border': 'none'});
				$lastSzld.css({'box-shadow':'0 0 1em #FF4D4D','border': '1px solid #FF4D4D'});
			}
		}
	};

	//switch top article content with queued content
	$szlQueue.on('click', '.szld' , function(){
		duplicate = true;
		var clicked = $(this).attr('id');//clicked one
		$('#' + clicked).css({'box-shadow':'0 0 1em #FF4D4D','border': '1px solid #FF4D4D'}).siblings().css({
			'box-shadow':'0 0 .8em black','border': 'none'
		});
		$szlQueue.animate({left: $szlQueue.offset().left - $('#' + clicked).offset().left + 10}, {duration: 500,
			step: function(){
				$queueItems.each(function(){
					$(this).css({
						'top': adjustTop($(this).offset().left) ,
						'height': startHeight - ($(this).position().top)/2 + '%'
					});
					var szldItem = $(this).offset().left / $(window).width() * 100;
					var $this = $(this);
					setZ(szldItem, $this);
				});
			}
		});

		//$(this).next().css('z-index', $(this).css('z-index') - 1);
		$('#queue div').removeClass('rerate');
		$(this).addClass('rerate');
		var contCopy = $(this).contents().clone();
		$('#middleArticle').addClass('requeue').empty().append($('#topArticle').contents());
		$('#topArticle').addClass('rerate').empty().append(contCopy);
	});

	//share menu
	var $shareMenu = $('#shareMenu');
	$('#shareText').click(function(){
		if (parseInt($shareMenu.css('height'), 10) > 0){
			$shareMenu.animate({height: 0},500);
		}
		else {
			$shareMenu.css("left", ($(window).width() - parseInt($shareMenu.css('width'), 10) + 'px'));
			$shareMenu.animate({height: '938px'}, 500);
		}
	});

	//szl/fzl by clicking edges
	$('#stream').click(function(e){
		if (!isRunning){
			if (e.pageX < $(document).width() * 0.10){//within 10% of left edge
				fzl();
			} else if (e.pageX > $(document).width() - ($(document).width() * 0.10)){//right edge
				szl();
			}
		}
	});

	/*$('.arrows').mouseup(function(e){
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
	});*/

	//prevent browser window from scrolling on iphone
	$('body').bind('touchmove', function (e) {
		e.preventDefault();
	});
});
