
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
		startSize = $(window).width();
		overlap = $(window).width() * 0.10;

	articles.push(
		"<p class='articleText'><b>article1 article1 article1 </b>article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1 article1</p>",
		"<p class='articleText'>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 <i>article#2 article#2 article#2 article#2 article#2  article#2 </i>article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2 article#2</p>",
		"<p class='articleText'>article3 article3 <h1>article3 article3 article3 </h1>article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 article3 </p>",
		"<p class='articleText'>article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>article#4 article#4 article#4 article#4 article#4 <p>article#4 article#4 article#4 article#4 article#4 article#4</p> article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 article#4 </p>",
		"<p class='articleText'>article5 <p>article5 article5 article5 article5 article5<p> article5 article5 article5 article5 article5 article5 article5 article5<p>",
		"<h1><a href=''target=''>Giant microwave blaster lets bread stay fresh-ish for over 60 days</a></h1><h2><a href='https://dvice.com/' target='_blank'>DVICE</a> November 30th, 2012 16:46 EST</h2><div id='szzzl-story-long-wrapper'><p><div><div><p class='articleText'>About a third of the bread that consumers buy gets tossed out or fed to ducks who don't know any better after it goes stale or gets moldy. You just cant win with bread- either you keep it moist and gross stuff grows on it, or you dry it out and it turns into a rock. A Texas company says it has a solution, in the form of a huge homogenized microwave cannon.</p><p class='articleText'>Microwaves, being radiation, work quite well at killing things like fungi. The reason that you cant use your microwave to kill fungi is that your microwave sucks, and due to the wavelength of the microwaves used in microwave ovens (just under five inches), you get hot spots and cold spots that show up at half of that wavelength. Microzap's microwave chamber, on the other hand, works differently, and much better. CEO Don Stull explains:</p><div>For the latest tech stories, follow DVICE on Twitter at @dvice or find us on Facebook</div></div></div></p><p><a href='https://dvice.com/archives/2012/11/giant-microwave.php' target='_blank'>Read more</a></p></div>"
	);
	//TODO: orientation change messes up element sizes
	//could put this in self-executing function?
	$(window).on('resize load', function(){//adjust elements for different screen sizes
		//alert(window.devicePixelRatio);
		$('body').show();
		var difference = Math.abs($(window).width() - startSize);
		var adjust = difference / startSize * $(window).width();
		//console.log(adjust);
		//console.log(difference);
		var w_box = $(window).width(),
			h_box = $('#stream').height(),
			w_total = ((w_box - $article.width())/2) - 2, //400
			h_total = (h_box - $article.height())/2,
			css = {"position": 'absolute',"margin-left": w_total +"px"};
		$article.css(css);
		$('#paper0').css('margin-left', w_total + 2 + 'px');
		$('#paper1').css('margin-left', w_total + 4 + 'px');
		$('#paper2').css('margin-left', w_total + 6 + 'px');
		$('#username').css('margin-left', parseInt($('.article').css('margin-left'), 10) + 'px');
		$('#share').css('margin-left', parseInt($('#topArticle').css('margin-left'), 10) * -1 + 'px' );
		$('#shareMenu').css("left", ($(window).width() - parseInt($('#shareMenu').css('width'), 10) + 'px'));
		//TODO: adjust szld items on window resize
		/*$queueItems.css('width', '10%');
		$('.szld:last').prevAll().each(function(){
			$(this).css('left', parseInt($(this).css('left'), 10) - 0.10 + 'px');
		});*/
		artPos = $('#topArticle').css('margin-left');
		artLeft = $('#topArticle').css('left');
		width = $(window).width();
		height = $(window).height();
	});

	//prevent browser window from scrolling on iphone
	$('body').bind('touchmove', function (ev) {
		ev.preventDefault();
	});

	//console.log($('#content').height())
	//console.log($('#stream').height());
	//console.log($('.article').height());
	//console.log('total: '+ $(document).height());
	//console.log('colorbar: '+ $('.colorbar').height());
	//console.log('queue: ' + $('#header-container').height());

	//$('#topArticle').html(articles[5]);

	adjustTop = function(offset){
		return 100 * (1.0-Math.min(0.98,(0.75 + ( 0.25/ (Math.exp(0.003*offset))) )) ) + '%';
	};

	szl = function(e){
		if (!isRunning){
			isRunning = true;
			var szld = $('#topArticle').contents().clone();
			$topArticle = $('#topArticle');
			var thecontent = [];//holder for article content in case user clicks picture from the queue..retrieve it from this array
			thecontent.push(szld);
			//var theIMG = $('#topArticle').find('img').clone();  // pull out just the img from article content
			var artText = $topArticle.text();
			$topArticle.animate({left: width},{queue: false,duration: 500, complete: function(){
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
						$(this).animate({left: parseInt($(this).css('left'), 10) + overlap + 'px'},{duration: 500, complete:function(){
							queueDrag.containment = [-1 * ($('.szld:first').offset().left + overlap), 0, $(window).width()/2, 0];//adjust left containment based on far right item in queue
						}});
					});
				}

				var newDiv = document.createElement('div');
				$szlQueue.append($(newDiv).attr('id', 'newSzl' + szlCount).css({  //use szlcount number as position in array to pull text from
					'position':'absolute', 'width': $(window).width() * 0.20, 'height': '90%',
					'background':'white',
					'border': '1px solid #FF4D4D',
					'box-shadow':'0 0 1em #FF4D4D',
					'z-index': szlCount + 1,
					'top': '1px',
					'left': '5px'
				}).addClass('szld').css('overflow','hidden').append(szld));
				$queueItems = $('#queue div.szld');
				$lastSzld = $queueItems.filter(':last');
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
				$lastSzld.prevAll().each(function(index){
					$(this).css({'z-index' : $(this).next().css('z-index') - 1,
					'box-shadow': '0 0 .8em black', 'border':'none'});
				});
				szlCount += 1;
				//if not kindle..
				if (navigator.userAgent.indexOf("Silk") == -1) {
					//alert('kindle');
					$szlQueue.css('width', $('#queue').width() + ($queueItems.width() * 0.90));
				}
				//$szlQueue.css('width', $('#queue').width() + ($queueItems.width() * 0.90))
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
	$article.draggable(newArticle);

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
	}).mousemove(function(e){
		//console.log(e.pageX);
	}).mouseup(function(e){
		end(e);
		if (!isRunning) checkForSwipe();
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

	$szlQueue.on('mouseenter', 'div', function(event){
		//orig = $(this).css('z-index');
		//$(this).css('z-index', '100');//.css('transform','rotateY(0deg)').css('z-index', '100');
	}).on('mouseleave', 'div', function(event){
		//$(this).css('z-index', orig);//.css('transform','rotateY(-45deg)')
	});

	//share menu
	var $shareMenu = $('#shareMenu');
	$('#shareText').click(function(){
		////console.log($('#shareMenu').css("height"));
		if (parseInt($shareMenu.css('height'), 10) > 0){
			$shareMenu.animate({height: 0},500);
		}
		else {
			$shareMenu.css("left", ($(window).width() - parseInt($shareMenu.css('width'), 10) + 'px'));
			$shareMenu.animate({height: '938px'}, 500);
		}
	});

	//var orig;
	//var prevX = -1;

	/*var x1, x2,
        y1, y2,
        t1, t2;  // Time

    var minDistance = 40; // Minimum px distance object must be dragged to enable momentum.

    var onMouseMove = function(e) {
        var mouseEvents = $('#queue').data("mouseEvents");
        if (e.timeStamp - mouseEvents[mouseEvents.length-1].timeStamp > 40) {
            mouseEvents.push(e);
            if (mouseEvents.length > 2) {
                mouseEvents.shift();
            }
        }
    }

    var onMouseUp = function() {
        $(document).unbind("mousemove mouseup");
    }*/
	var dragMomentum = new function () { 
    var howMuch = 30;  // change this for greater or lesser momentum
    var minDrift = 6; // minimum drift after a drag move
    var easeType = 'easeOutBack';

    //  This easing type requires the plugin:  
    //  jquery.easing.1.3.js  http://gsgd.co.uk/sandbox/jquery/easing/

    var dXa =[0];
    var dYa =[0];
    var dTa =[0];

    this.start = function (elemId, Xa, Ya, Ta)  {
          dXa[elemId] = Xa;
        dYa[elemId] = Ya;
        dTa[elemId] = Ta;

      }; // END dragmomentum.start()

    this.end = function (elemId, Xb, Yb, Tb)  {        
        var Xa = dXa[elemId];
        var Ya = dYa[elemId];
        var Ta = dTa[elemId];
        var Xc = 0;
        var Yc = 0;

        var dDist = Math.sqrt(Math.pow(Xa-Xb, 2) + Math.pow(Ya-Yb, 2));
        var dTime = Tb - Ta;
        var dSpeed = dDist / dTime;
        dSpeed=Math.round(dSpeed*100)/100;

        var distX =  Math.abs(Xa - Xb);
        //var distY =  Math.abs(Ya - Yb);

        var dVelX = (minDrift+(Math.round(distX*dSpeed*howMuch / (distX))));
        //var dVelY = (minDrift+(Math.round(distY*dSpeed*howMuch / (distX+distY))));

        var position = $('#'+elemId).position();
        var locX = position.left;
        //var locY = position.top;

        if ( Xa > Xb ){  // we are moving left
            Xc = locX - dVelX;
        } else {  //  we are moving right
            Xc = locX + dVelX;
        }

        /*if ( Ya > Yb ){  // we are moving up
            Yc = (locY - dVelY);
        } else {  // we are moving down
            Yc = (locY + dVelY);
        }*/

        var newLocX = Xc + 'px';
        //var newLocY = Yc + 'px';

        $('#'+elemId).animate({ left:newLocX}, 700, easeType );

    }; // END  dragmomentum.end()

};  // END dragMomentum()
	var startTime;
	var theTime = [];
	var pos = [];
	var startPoint;
	var endPoint;
	var dateLog = [];
	var queueDrag = { //needs better name
		axis: "x",
		scroll: false,

		start: function(ui, e){
			dragged = true;
				/*$('#queue').data("mouseEvents", [e]);
            	$(document)
                .mousemove(onMouseMove)
                .mouseup(onMouseUp);*/
                startTime = new Date();
               // dateLog = setInterval(function(){
                //	console.log(new Date() + ', ' + e.pageX);
                //	//dateLog.push[new Date()]
                //}, 100)
		},

		drag: function(e, ui){
			$queueItems.each(function(){
				//article with focus in center
				//console.log(e.pageX);
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
				if (szldItem < 0) {
					$(this).css({
						"z-index": $(this).prev().css("z-index") - 1
					});
				}
				if (szldItem > 0) {
					$(this).css({
						'top': adjustTop($(this).offset().left),
						'height': startHeight - ($(this).position().top)/2 + '%'//adjust height in relation to top position
					});
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
			//dragMomentum.start(this.id, e.clientX, e.clientY, e.timeStamp);
			current = new Date();
			theTime.push(current);
			pos.push(e.pageX);

		},

		stop: function(e, ui){
			//clearInterval(dateLog);
			var endTime = new Date(),
				endPoint = e.pageX;
				pos.push(endPoint);
				theTime.push(new Date());
				timeDiff = ((endTime - startTime)/1000);
				distance = Math.abs((endPoint - pos[0]));
				velocity = distance/timeDiff;
			//console.log(theTime.length + ', ' + pos.length);

			//time and distance between final two points during drag
				endOfDragDistance = Math.abs(pos[pos.length - 1] - pos[pos.length - 2]);
				endOfDragTime = (theTime[theTime.length - 1] - theTime[theTime.length - 2]);
				//console.log(theTime);
				console.log(endOfDragDistance + 'px');
				console.log(endOfDragTime + 'ms');
				finalVelocity = endOfDragDistance/endOfDragTime;// in seconds
				console.log(finalVelocity);
				pos = [];
				theTime = [];
				/*$(this).animate({left: $(this).offset().left + (-1 * endOfDragTime/100 * velocity)}, {duration: finalVelocity * 200, step: function(){
					console.log(velocity);
					velocity -= .05
				}});*/
			//console.log('timeDiff: ' + timeDiff + ', distance:' + distance + ', velocity:' + velocity);
			//http://stackoverflow.com/questions/3486760/how-to-avoid-jquery-ui-draggable-from-also-triggering-click-event/13973319#13973319
			var leftBound = ( (e.pageX > $(window).width() * 0.38) ? leftBound = -5 : leftBound = 0 );
				/*rightofZero = $('.szld').filter(function() {
					return ($(this).offset().left > 0 && $(this).offset().left < ($(window).width() * 0.10));
				}),
				theID = $(rightofZero).attr('id');//needs a better name
			
			//prevent click from firing if touchend is over one of the szld elements
			*/$(e.toElement ).one('click', function(e){
				e.stopImmediatePropagation();
			});/*

			//adjust elements left based on initial distance of 'rightofZero' at time of mouseup
			$(rightofZero).next().prevAll().each(function(){
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

			//move queue back to initial position when last szld element is > 0
			if ($lastSzld.offset().left > 0){
				$szlQueue.animate({left: leftBound}, {duration: (Math.abs($lastSzld.offset().left) > $(window).width() * 0.25 ? Math.abs($lastSzld.offset().left) : 300),
					step: function(){
						rightofZero = $('.szld').filter(function() {return ($(this).offset().left > 0 && $(this).offset().left < ($(window).width() * 0.18));});
						$(rightofZero).each(function(){
							$(this).next().css({'transform-origin' : '0px 0px' ,
							'transform' : 'perspective( 600px ) rotateY(0deg)'});
						});
						$queueItems.each(function(){
							$(this).css({
								'top': adjustTop($(this).offset().left) ,
								'height': startHeight - ($(this).position().top)/2 + '%'
							});
						});
						$(this).css({'z-index' : $(this).closest().css('z-index') - 1});
					$lastSzld.prevAll().each(function(){
						$(this).css({'z-index' : $(this).next().css('z-index') - 1});
					});
				}, complete: function(){
					//queue bounces back after hitting left edge
					if (e.pageX > $(window).width() * 0.38){
						$(this).animate({left: 0}, 400);
					}
				}});
				$queueItems.css({'box-shadow':'0 0 1em black','border': 'none'});
				$lastSzld.css({'box-shadow':'0 0 1em #FF4D4D','border': '1px solid #FF4D4D'});
			}

			/*$('#queue').stop();
            $('#queue').css("text-indent", 100);

            var lastE = $('#queue').data("mouseEvents").shift();

            x1 = lastE.pageX;
            y1 = lastE.pageY;
            t1 = lastE.timeStamp;
            x2 = e.pageX;
            y2 = e.pageY;
            t2 = e.timeStamp;

            // Deltas
            var dX = x2 - x1,
                dY = y2 - y1,
                dMs = Math.max(t2 - t1, 1);

            // Speeds
            var speedX = Math.max(Math.min(dX/dMs, 1), -1),
                speedY = Math.max(Math.min(dY/dMs, 1), -1);

            // Distance moved (Euclidean distance)
            var distance = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));

            if (distance > minDistance) {
                // Momentum
                var lastStepTime = new Date();
                $d.animate({ textIndent: 0 }, {
                    duration: Math.max(Math.abs(speedX), Math.abs(speedY)) * 2000,
                    step: function(currentStep){
                        speedX *= (currentStep / 100);
                        speedY *= (currentStep / 100);

                        var now = new Date();
                        var stepDuration = now.getTime() - lastStepTime.getTime();

                        lastStepTime = now;

                        var position = $d.position();

                        var newLeft = (position.left + (speedX * stepDuration / 4)),
                            newTop = (position.top + (speedY * stepDuration / 4));

                        $('#queue').css({
                            left: newLeft+"px",
                            //top: newTop+"px"
                        });
                    }
                });
            }*/
            //dragMomentum.end(this.id, e.clientX, e.clientY, e.timeStamp);
		}
	};
	/*$('footer').scroll(function(){
		console.log($('.szld:last').offset().left);
		$('.szld').each(function() {

			if ($(this).offset().left > 0) {
			$(this).css({ 'top': adjustTop($(this).offset().left) });
			//$(this).css({ 'height': $(this).height() - $(this).position().top + 'px'})
			}
		});
		
	});*/

	$szlQueue.on('click', '.szld' , function(){//switch top article content with queued content
		var clicked = $(this).attr('id');//clicked one
		$('#' + clicked).css({'z-index': $(this).next().css('z-index') + 1, 'box-shadow':'0 0 1em #FF4D4D','border': '1px solid #FF4D4D'}).next().css({
			'box-shadow':'0 0 8em black','border': 'none'
		});
		$szlQueue.animate({left: $szlQueue.offset().left - $('#' + clicked).offset().left + 10}, {duration: 500,
			step: function(){
				$queueItems.each(function(){
					//console.log($(this).css('left') + ' ,' + $(this).offset().left);
					$(this).css({
						'top': adjustTop($(this).offset().left) ,
						'height': startHeight - ($(this).position().top)/2 + '%'
					});
				});
			}
		});
		$queueItems.each(function(){
			$(this).css({
				'top': adjustTop($(this).offset().left),
				'height': startHeight - ($(this).position().top)/2 + '%'
			});
		});
		$('#queue div').removeClass('rerate');
		$(this).addClass('rerate');
		var contCopy = $(this).contents().clone();
		$('#middleArticle').addClass('requeue').empty().append($('#topArticle').contents());
		$('#topArticle').addClass('rerate').empty().append(contCopy);
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
});
