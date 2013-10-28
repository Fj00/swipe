/*all code pertaining to interaction with buzz_mobile.html */

document.write('<style type="text/css">body{display:none}</style>');//hide content while jquery sets some css
$(document).ready(function(){

	var szldContent,	// html content of szld article
		$article = $('#stream div.article'),
		$szlQueue = $('#queue'),
		$topArticle = $('#topArticle'),
		$middleArticle = $('#middleArticle'),

		//arrays
		a_articles = [],
		a_theContent = [],
		a_pos = [],
		a_theTime = [],

		//boolean
		b_isRunning = false,	// whether or not article animation is running
		b_dragged = false,
		b_duplicate,	// flag for whether or not the szld article is already in the queue
		b_arrows = true,

		//integer
		i_articleIndex = 0,
		i_szlCount = 0,	// track how many have been szl'd
		i_STARTHEIGHT = 85,
		swipeStartTime,
		startPos = {x:0, y:0},
		distance = {x:0, y:0},
		scaledDistance, swipeTime, swipeAngle = 0,
		dragStartTime,
		startPoint,
		endPoint,
		artPos,
		artLeft,
		width = $(window).width(),
		height = $(window).height(),
		left = -width + 'px',
		right = width + 'px',
		STARTSIZE = $(window).width(),
		overlap = $('#queue').height() * .72, // percentage each article overlaps into its neighbor
		currentDate,	// time when queue drag is released
		sidevalue = 0.15;	// used to define the size of the clickable area on right and left edges

	a_articles.push(
		"<img src='img/df.jpg' /><p class='articleText'><b>article1 article1 article1 </b>article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1</p>",
		"<img src='img/eye.jpg' /><p class='articleText'>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 <i>article#2 article#2 article#2 article#2 article#2  article#2 </i>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2</p>",
		"<img src='img/cat.jpg' /><p class='articleText'>article3 article3 <h1>article3 article3 article3 </h1>article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 </p>",
		"<img src='img/mandel.jpg' /><p class='articleText'>article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p><p>article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4</p> <p>article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>",
		"<img src='img/golden.jpg' /><p class='articleText'>article5 <p>article5 article5 article5 article5 article5<p> article5 article5 article5 article5 article5 article5 article5 article5<p>",
		"<img src='img/laser.jpg' /><h1><a href=''target=''>Giant microwave blaster lets bread stay fresh-ish for over 60 days</a></h1><h2><a href='https://dvice.com/' target='_blank'>DVICE</a> November 30th, 2012 16:46 EST</h2><div id='szzzl-story-long-wrapper'><p><div><div><p class='articleText'>About a third of the bread that consumers buy gets tossed out or fed to ducks who don't know any better after it goes stale or gets moldy. You just cant win with bread- either you keep it moist and gross stuff grows on it, or you dry it out and it turns into a rock. A Texas company says it has a solution, in the form of a huge homogenized microwave cannon.</p><p class='articleText'>Microwaves, being radiation, work quite well at killing things like fungi. The reason that you cant use your microwave to kill fungi is that your microwave sucks, and due to the wavelength of the microwaves used in microwave ovens (just under five inches), you get hot spots and cold spots that show up at half of that wavelength. Microzap's microwave chamber, on the other hand, works differently, and much better. CEO Don Stull explains:</p><div>For the latest tech stories, follow DVICE on Twitter at @dvice or find us on Facebook</div></div></div></p><p><a href='https://dvice.com/archives/2012/11/giant-microwave.php' target='_blank'>Read more</a></p></div>"
	);

	//TODO: orientation change messes up element sizes

	//adjust elements for different screen sizes and when orientation changes
	$(window).on('resize load orientationchange', function(){
		//alert(window.devicePixelRatio);
		$('body').show();

		//article overlaps 10% of adjacent article
		var overlap = $(window).width() * 0.02,
			difference = (($(window).width()/STARTSIZE * 100) - 100),// % difference between initial width and current width
			szldWidth = ($(window).width() * 0.2)  + (difference/5),
			w_box = $(window).width(),
			h_box = $(window).height(),
			w_total = ((w_box - $('#topArticle').width())/2) - 2,
			h_total = (h_box - $('#topArticle').height())/2,
			css = {"position": "absolute", "margin-left": w_total +"px", "margin-top": h_box * 0.03	};

		$('.article').css(css);
		$('#username').css('margin-left', parseInt($('.article').css('margin-left'), 10) + 'px');
		$('#share').css('margin-left', parseInt($('#topArticle').css('margin-left'), 10) * -1 + 'px' );
		$('#shareMenu').css("left", ($(window).width() - parseInt($('#shareMenu').css('width'), 10) + 'px'));
		$('footer').css({'top': '81%', 'height':'19%'});

		artPos = $('#topArticle').css('margin-left'); // used for setting margin for newly created articles
		artLeft = $('#topArticle').css('left'); // value changes depending on window size

		// updated window dimensions
		width = $(window).width();
		height = $(window).height();

	});

	$('#topArticle').html(a_articles[5]);

	// return nonlinear top value based on the element's left offset
	var adjustTop = function(offset){
		return 100 * (1.0-Math.min(0.98,(0.75 + ( 0.25/ (Math.exp(0.003*offset))) )) ) + '%';
	};
	var artImg = [];
	var szl = function(e){
		if (!b_isRunning){
			b_isRunning = true;
			$topArticle = $('#topArticle');
			var szldContent = $('#topArticle').html(); // content from szld article
			var theIMG = $('#topArticle img').clone();  // pull out just the img from article content
			var artText = $topArticle.text();
			$topArticle.animate({left: width},{queue: false, duration: 500,
				complete: function(){
					$(this).remove();
					$('#middleArticle').attr('id', 'topArticle');//.draggable(newArticle);
					$('#bottomArticle').attr('id', 'middleArticle');
					b_isRunning = false;
				}
			}).css({'box-shadow': '0 0 .5em red'});
			createArticle();
			if (b_duplicate){	// if article already in queue, don't add it
				b_duplicate = false;	// next article will be different, so this allows the else block to run
			} else {
				artImg.push(theIMG.attr('src'));
				a_theContent.push(szldContent);
				//if not in queue, add it
				if (i_szlCount > 0){
					$queueItems = $('#queue div.szld');
					$queueItems.each(function(){
						var cssLeft = parseInt($(this).css('left'), 10);
						$(this).animate({left: cssLeft + $(this).width() + 5 + 'px'},{duration: 500, queue: false,
							complete: function(){
								//console.log('shifted');
								/*adjust left containment based on far right item in queue
									queueDrag.containment = [
									-1 * ($('.szld').eq(0).offset().left + overlap), 0, 
									$(window).width()/2, 0];
								*/
							}
						});
					});
				}

				// create new div, add it to queue, append contents from szld article
				newDiv = document.createElement('div');
				newDiv.id = "newSzl" + i_szlCount;
				console.log(newDiv.id);

				$('#queue').append($(newDiv)
					.addClass('szld')
					.css({ 
						  'width': $('#queue').height() * 0.72, 
						  'z-index': i_szlCount + 1
					}));
				console.log(theIMG);
				console.log(newDiv.id)
				$(newDiv).append(theIMG).fadeIn(500);

				//});
				$queueItems = $('#queue div.szld');
				//console.log($queueItems.length);
				//console.log(a_theContent.length);
				// remove new item if it's out of view
				if ( $queueItems.length * $('.szld').width() > $(window).width()  + ($('.szld').width() * 2)){
					//console.log('true');
					$queueItems.eq(0).remove();
				}

				i_szlCount += 1;
				console.log(i_szlCount);
				$lastSzld = $queueItems.filter(':last');

				//TODO: adding new item when last one is off screen messes up previous items
				//set the left position of the last one before adjusting the rest of them based on that ****
				//reposition queue so the newest item added becomes visible
				$szlQueue.animate({left: 0},{duration: 300, queue: false,
					step: function(){ // adjust the top & height values of the items along the way
						$queueItems.each(function(){
							//console.log($(this).css('left') + ' ,' + $(this).offset().left);
							$(this).css({
								'top': adjustTop($(this).offset().left),
								'height': i_STARTHEIGHT - ($(this).position().top)/2 + '%'
							});
						});
					}
				});

				//set descending z-indexes for items after the newly added item
				$lastSzld.prev().css({'border':'none', 'box-shadow': '0 0 .8em black'});

				//if not kindle..
				if (navigator.userAgent.indexOf("Silk") == -1) {
					$szlQueue.css('width', $('#queue').width() + ($queueItems.width() * 0.90));
				} else {
					//alert('kindle');
				}

				//initialize draggable queue with updated containment property
				$szlQueue.draggable(queueDrag);
			}
		}
	};
	var adjustValues = function($queueItems){
		$queueItems.each(function(){
			$(this).css({
				'top': adjustTop($(this).offset().left),
				'height': i_STARTHEIGHT - ($(this).position().top)/2 + '%',
				'transform':'none',
				'z-index': $(this).index()
			});
		});
	};

	var fzl = function(e){
		if (!b_isRunning){
			b_isRunning = true;
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
				$('#middleArticle').attr('id', 'topArticle').css('margin-left', artPos)//.draggable(newArticle);
				$('#bottomArticle').attr('id', 'middleArticle').css('margin-left', artPos);
				b_isRunning = false;
				}
			}).css({'box-shadow': '0 0 .5em blue'});
			createArticle();
		}
	};

	var createArticle = function(){
		var newCont = document.createElement('div');
			newCont.id = "bottomArticle";  //container for next article

		$('#stream').append(newCont);
		if ($('#middleArticle').hasClass('requeue')){
			if(i_articleIndex === 0){
				$('#bottomArticle').addClass('article').html(a_articles[i_articleIndex + 5]).css('margin-top', $(window).height() * 0.03).css('margin-left', artPos);
			} else {
				$('#bottomArticle').addClass('article').html(a_articles[i_articleIndex-1]).css('margin-top', $(window).height() * 0.03).css('margin-left', artPos);
			}
		}
		else {
			$('#bottomArticle').addClass('article').html(a_articles[i_articleIndex])
				.css('margin-top', $(window).height() * 0.03)
				.css('margin-left', artPos);
			i_articleIndex += 1;
		}
		if (i_articleIndex > 5){ i_articleIndex = 0;}
	};

	//enable article dragging
	/*var newArticle = {
		axis: 'x',
		start: function(){
			$(this).css('box-shadow','5px 5px 10px #888888');
		},
		stop: function(){
			$(this).css('box-shadow', 'none');
		}
	};*/
	//$article.draggable(newArticle);

	
	var start = function(e) {
		swipeStartTime = new Date();
		startPos.x = e.pageX;
		startPos.y = e.pageY;
	}

	var end = function(e) {
		var now = new Date();
		swipeTime = (now - swipeStartTime)/1000;
		distance.x = e.pageX - startPos.x;
		distance.y = e.pageY - startPos.y;
		swipeAngle = Math.atan(distance.y / distance.x) * (180 / Math.PI);
		scaledDistance = Math.sqrt((distance.x / width)^2 + (distance.y / height)^2);
	}
 
	var downPoint,
		mouseIsDown,
		$currentTop;
	$('#content').mousedown(function(e){
		$currentTop = $('#topArticle');
		downPoint = e.pageX - $('#topArticle').offset().left;
		mouseIsDown = true;
		start(e);
	}).mousemove(function(e){
		//console.log(e.pageX);
		// Problem: drag starts when trying to select text..
		if(mouseIsDown) {
			// trying to implement custom drag interaction instead of using draggable
			$currentTop.offset({left: e.pageX - downPoint});
			$currentTop.addClass('unselectable'); // prevent text highlighting during drag
		}

	}).mouseup(function(e){
		mouseIsDown = false;
		$currentTop.removeClass('unselectable');
		end(e);
		if (!b_isRunning) checkForSwipe();
	});

	var checkForSwipe = function(){
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
				'height': i_STARTHEIGHT - ($this.position().top)/2 + '%',//adjust height in relation to top position
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
	var arrayPos = 0,
		direction,
		startY,
		startX;

    $('footer').mousedown(function(e){
		startY = e.pageY;
		startX = e.pageX;
	});
	var queueDrag = {
		axis: "x",
		scroll: false,

		start: function(ui, e){
			b_dragged = true;
            dragStartTime = new Date();
            var lastSzld = $('.szld:last');
                lastSzldID = $('.szld:last').attr('id');
			$(this).data('dir', '');
			$('#queue .szld').each(function(){
				$(this).css('z-index', $(this).index());
			});
			startX = event.pageX;
		},

		//if initial pageY is < current pageY and starting pageX is within x amount from current pageX..don't drag

		drag: function(e, ui){

			//console.log(startX);
			/*var dir = $(this).data('dir');
				// If we don't have a direction, decide where we're going
				if ((dir != 'y') && (dir != 'x')) {
				var dy = ui.originalPosition.top - ui.position.top;
				var dx = ui.originalPosition.left - ui.position.left;
				dir = (Math.abs(dy) > Math.abs(dx))?'y':'x';
				$(this).data('dir', dir);
			}

			if (dir == 'y') {
				// Change the height
				var ft = $('footer').position().top;
				var fh = $('footer').height();
				console.log(ft - ui.offset.top);
				//console.log(ft);
				$('footer').css('height', fh + (ft - ui.offset.top )+ 'px');
				$('footer').css('top', ui.offset.top).css('z-index', '5');
				// Prevent the drag from happening
				// ??? 
			}*/
			/*var ft = $('footer').position().top;
			var fh = $('footer').height();
			//if ( Math.abs(startY - e.pageY) > 10 && Math.abs(startY - e.pageY) > Math.abs(startX - e.pageX) ){
				$('footer').css('height', fh + (ft - ui.offset.top ) + 'px');
				$('footer').css('top', ui.offset.top);
			//}*/
			if (startX < e.pageX){
				direction = 'right';
			} else {
				direction = 'left';
			}

			//console.log(direction);

			//queueDrag.containment = [-1 * ($('.szld').eq(0).offset().left + overlap), 0, $(window).width()/2, 0];
			$('.szld').each(function(){
				var szldItem = $(this).offset().left / $(window).width() * 100;
				
				// article with focus on left
				var $this = $(this);
				setZ(szldItem, $this);

				/*if ($(this).offset().left > 0 && $(this).offset().left < overlap){
					var rotation = (-90 * (1-($(this).offset().left/overlap)));
					if (rotation >= -45){
						$(this).next().offset({left:0}).css({
							//'left':'1px',
							'transform-origin' : '0px 0px',
							'perspective-origin': '0% 50%',
							'transform' : 'perspective( 600px ) rotateY('+ 2 * rotation +'deg)'
						});
					}
				} else if ($(this).offset().left >= overlap){
					$(this).next().css({
						'transform' : 'perspective( 600px ) rotateY(0deg)'
					});
				}*/
			});
			currentDate = new Date();
			a_theTime.push(currentDate);
			a_pos.push(e.pageX);

			// add a new item to the right side when ones rotates off of the left side
			var lastOne = $('.szld').length - 1;// get the eq position of the last one on the left
			var lastId = $('.szld:first').next().attr('id');

			// if the offset of the last one on the left becomes < 0..
			if ( direction == 'left' && $queueItems.length * $('.szld').width() > ($(window).width() + $('.szld').width()) && $('.szld').eq(lastOne).offset().left < (-1 * $('.szld').width()) && (a_theContent.length - $queueItems.length) >= arrayPos){
				//remove it
				$('.szld').eq(lastOne).remove();
				//console.log(lastId.replace(/\D/g,''));
				newDiv = document.createElement('div');// create new div
				//newDiv.id = "newSzl" + (($('.szld').eq(0).attr('id').substr($('.szld').eq(0).attr('id').indexOf('l'), $('.szld').eq(0).attr('id').length) - 1) + '');// give it a numbered ID that's one less than its left neighbor
				$('#queue').prepend($(newDiv)// add it to the first position (the right)
					.addClass('szld')
					.attr('id', $(this).next().attr('id'))
					.css({
						'width': $('#queue').height() * 0.72,
						'z-index': $(this).next().css('z-index') - 1,
						'left': parseInt($('.szld').eq(0).css('left'), 10) + $('.szld').width() + 5 + 'px',
						'top': '50px',
						'height': '50%'
					}).attr('id', 'newSzl' + ($('#queue .szld').eq(0).attr('id').replace(/\D/g,'') - 1)));

				//append corresponding content from content array
				//console.log($('#queue .szld:last').attr('id'));

				$('#newSzl' + ($('#queue .szld').eq(0).attr('id').replace(/\D/g,''))).append(a_theContent[$('#queue .szld').eq(1).attr('id').replace(/\D/g,'') - 1])
					//give it appropriate top & height value **doesn't do anything yet
					.css({
						'top': '50px',//adjustTop($(this).offset().left),
						'height': '50%'//i_STARTHEIGHT - ($(this).position().top)/2 + '%'
					});

				//adjust containment to prevent last one on the right from being b_dragged off left side
				//queueDrag.containment = [-1 * ($('.szld').eq(0).offset().left + overlap), 0, $(window).width()/2, 0];

				arrayPos += 1;
			} else if ( direction == 'right' && $queueItems.length * $('.szld').width() > ($(window).width() + ($('.szld').width() * 2)) && $('.szld').eq(0).offset().left > $(window).width() && (a_theContent.length - $queueItems.length) >= arrayPos){
				//remove it
				$('.szld').eq(0).remove();
				//console.log($('.szld:last').attr('id'));
				newDiv = document.createElement('div');// create new div
				//newDiv.id = "newSzl" + (($('.szld').eq(0).attr('id').substr($('.szld').eq(0).attr('id').indexOf('l'), $('.szld').eq(0).attr('id').length) - 1) + '');// give it a numbered ID that's one less than its left neighbor
				$('#queue').append($(newDiv)// add it to the first position (the right)
					.addClass('szld')
					.attr('id', $(this).next().attr('id'))
					.css({
						'width': $('#queue').height() * 0.72,
						'z-index': $(this).next().css('z-index') - 1,
						'left': parseInt($('.szld:last').css('left'), 10) - $('.szld').width() - 10 + 'px',
						'top': '50px',
						'height': '50%'
					}).attr('id', 'newSzl' + (($('#queue .szld:last').attr('id').replace(/\D/g,'') - 0) + 1) ));

				//append corresponding content from content array
				//console.log($('#queue .szld:last').attr('id'));
				//console.log(0 - (a_theContent.length - $('#queue .szld:last').attr('id').replace(/\D/g,'')) );
				$('#queue .szld:last').append(a_theContent[0 - (a_theContent.length - $('#queue .szld:last').attr('id').replace(/\D/g,'')) ])
					//give it appropriate top & height value **doesn't do anything yet
					.css({
						'top': '50px',//adjustTop($(this).offset().left),
						'height': '50%'//i_STARTHEIGHT - ($(this).position().top)/2 + '%'
					});

				//adjust containment to prevent last one on the right from being b_dragged off left side
				//queueDrag.containment = [-1 * ($('.szld').eq(0).offset().left + overlap), 0, $(window).width()/2, 0];

				arrayPos += 1;
			}
		},

		stop: function(e, ui){
			var endTime = new Date(),
				endPoint = e.pageX;
				a_pos.push(endPoint);
				a_theTime.push(endTime);
				timeDiff = ((endTime - dragStartTime)/1000);
				dragDistance = Math.abs((endPoint - a_pos[0]));
				velocity = dragDistance/timeDiff;
				//console.log(a_theTime.length + ', ' + a_pos.length);

			$(this).data('dir', '');	
			//time and distance between final two points during drag
				endOfDragDistance = Math.abs( a_pos[a_pos.length - 1] - a_pos[a_pos.length - 2] );
				endOfDragTime = ( a_theTime[a_theTime.length - 1] - a_theTime[a_theTime.length - 2] );
				finalVelocity = endOfDragDistance/endOfDragTime;

				//console.log(endOfDragDistance + 'px');
				//console.log(endOfDragTime + 'ms');
				//console.log(finalVelocity);
				
				//animate drag continuation based on final velocity
				/*$(this).animate({ left: (endPoint < a_pos[0]) ?
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

							}
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
				});*/
 
				//fresh arrays for next drag
				a_pos = [];
				a_theTime = [];

			//http://stackoverflow.com/questions/3486760/how-to-avoid-jquery-ui-draggable-from-also-triggering-click-event/13973319#13973319
			var leftBound = ( (e.pageX > $(window).width() * 0.38) ? leftBound = -5 : leftBound = 0 );
				/*rightofZero = $('.szld').filter(function() {
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
			$lastSzld = $('#queue .szld').eq($('.szld').length - 1);
			if ($lastSzld.offset().left > 0){
				$szlQueue.stop().animate({left: leftBound},

					// if position of newest item is more the 25% from the starting point, set duration equal to its left offset. if not, make it 300ms
					{duration: (Math.abs($lastSzld.offset().left) > $(window).width() * 0.25 ? 
								Math.abs($lastSzld.offset().left) : 300),
					step: function(){
						/*rightofZero = $('.szld').filter(function() {
							return ($(this).offset().left > 0 && $(this).offset().left < ($(window).width() * 0.10));
						});
						$(rightofZero).each(function(){
							$(this).next().css({'transform-origin' : '0px 0px' ,
							'transform' : 'perspective( 600px ) rotateY(0deg)'});
						});*/
						$('.szld').each(function(){
							$(this).css({
								'top': adjustTop($(this).offset().left) ,
								'height': i_STARTHEIGHT - ($(this).position().top)/2 + '%',

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
		b_duplicate = true;
		var clicked = $(this).attr('id'); // ID of clicked item
		$('#' + clicked).css({'box-shadow':'0 0 1em #FF4D4D','border': '1px solid #FF4D4D'}).siblings().css({
			'box-shadow':'0 0 .8em black','border': 'none'
		});
		$szlQueue.animate({left: $szlQueue.offset().left - $('#' + clicked).offset().left + 10}, {duration: 500,
			step: function(){
				$('.szld').each(function(){
					$(this).css({
						'top': adjustTop($(this).offset().left) ,
						'height': i_STARTHEIGHT - ($(this).position().top)/2 + '%'
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
		clicked = clicked.replace(/\D/g,'');	// strip text from the ID in order to get the correct position in theContent array
		$('#middleArticle').addClass('requeue').empty().append($('#topArticle').contents());
		$('#topArticle').addClass('rerate').empty().append(a_theContent[clicked]);
	});

	//share menu
	var $shareMenu = $('#shareMenu');
	$('#shareText').click(function(){
		//slides up and down with css transition
		if ($shareMenu.hasClass('clicked')){
			$shareMenu.removeClass('clicked').addClass('hideIt');
			//$shareMenu.animate({height: 0},500);
		}
		else {
			//$shareMenu.css("left", ($(window).width() - parseInt($shareMenu.css('width'), 10) + 'px'));
			//$shareMenu.animate({height: '938px'}, 500);
			$shareMenu.removeClass('hideIt').addClass('clicked');
		}
	});

	//szl/fzl by clicking edges
	$('#stream').click(function(e){
		if (!b_isRunning){
			if (e.pageX < $(document).width() * 0.10){//within 10% of left edge
				fzl();
			} else if (e.pageX > $(document).width() - ($(document).width() * 0.10)){//right edge
				szl();
			}
		}
	});

	$('.arrows').mouseup(function(e){
		if (e.pageX < $(document).width() * sidevalue){//within 10% of left edge
			fzl();
		} else if (e.pageX > $(document).width() - ($(document).width() * sidevalue)){//right edge
			szl();
		}
	});
	$('#content, .arrows').on('mousedown', function(e){
		if (e.pageX > $(document).width() * sidevalue & e.pageX < $(document).width() - ($(document).width() * sidevalue)){
			if (b_arrows) {
				$('.arrows').fadeIn();
				b_arrows = false;
				setTimeout(function(){
					b_arrows = true;
				}, 800);
			}
		}
	}).on('mouseup', function(){
		$('.arrows').fadeOut();
	});

	//prevent browser window from scrolling on iphone
	/*$('body').bind('touchmove', function (e) {
		//e.preventDefault();
		if ($(e.target).attr('id') == 'stream'){
			e.preventDefault();
		}
	});*/

	//extract links and push to an array
	// http://stackoverflow.com/questions/9934944/embedding-youtube-video-refused-to-display-document-because-display-forbidden-b
	/*links = [];
	thumbs = [];
	$.getJSON('http://gdata.youtube.com/feeds/api/videos?author=LifeHacker&v=2&alt=json', function(data){
		$(data.feed.entry).each(function(){
			theString = this.link[0].href;
			//console.log(theString);
			var videoID = theString.substr(theString.indexOf('=') + 1, 11);
			//var videoID = videoLink.substr(videoLink.indexOf('=') + 1, );
			videoLink = 'http://www.youtube.com/embed/'+ videoID;
			//console.log(videoLink);
			thumb = "<img src='http://img.youtube.com/vi/"+ videoID +"/0.jpg' />";
			links.push('<iframe width="420" height="315" src="' + videoLink + '" frameborder="0" allowfullscreen></iframe>');
			thumbs.push(thumb);
		});

		//console.log(links);
		$('#topArticle').html(thumbs[0]);
		$('#middleArticle').html(thumbs[1]);
	});*/
});
