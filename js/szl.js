// Szl.it © Copyright 2013 \\

// * indicates variable name that was changed
// others are newly created names

// the purpose of this file is to create articles from xml data..
// and send the rating of those articles back to the server

//TODO: add swipe & shadow

var IE = false, // check for IE *
    isMobile = false, // check for mobile device *

    // article data
    unratedContent = 'https://dl.dropboxusercontent.com/u/97446129/13.09.23/13.09.22/js/unrated.xml', // * unrated articles stream
    szldCount = 0,  // # szld *
    fzldCount = 0,  // # fzld *
    rateCount = 0, // # of articles rated *

    // used to create new URLs
    ratingLink = '/buzzes/', // *
    commentLink = '/comments/', // *
    sourceLink = '/sources/', // *
    loadingArticles = false, // *
    articlesViewed = 0, // *
    lastRequestTime = 0, // *
    //requestsWithoutResult = 0, // * # of times the req for content yielded nothing new
    minArticles = 2, // *

    article = $('#content'), // div for article content
    shareURL,
    articleHtml = '',
    commentsHtml = '',
    i_articleCache = 0, // number of articles ready for display

    // arrays for storing article and comment data for each xml 'item'
    a_articleContent = [],
    a_commentContent = [],
    a_articleID = [],
    a_commentID = [],
    a_sourceID = [],

    // numeric identifiers
    commentID,
    currentArticleID,

    // flags
    buttonsDisabled = false; // rating buttons disabled when this is true
    snakeShowing = false; // loading snake *
    requestInProgress = false; // xml request



  // attempt at rewriting xml request and article HTML insertion with jQuery
  function getXML( url ) {

    requestInProgress = true;

    var request = $.get(url, function(data){
      $(data).find('item').each(function(){ // loop through each 'item' tag (4 total)
        itemIndex = $(this).index(); // get the index of current 'item'
        var self = $(this); // store current value of 'this'

        // various pieces of article data
        articleText = $(this).find('description').text(); // main text
        articleText = articleText.replace( /(<script[\s\S]*<\/script>) (<img[^>]+\>)/gi ,'' ) // takes out script and img tags
                                 .replace( /<\/?[^>]+(>|$)/g, "" ); // takes out '<' and '>'
        articleLink = $(this).find('link').text();
        sourceName  = $(this).find('name').text();
        articleID   = $(this).find('id').text();
        sourceID    = $(this).find('source-id').text();

        // create an html block for article using text from the XML elements
        articleHtml += '<h1 id="title"><a href=' + articleLink + '" target="_blank">' + $(this).find('title').text() + '</a></h1>' +
                      '<div id="titleBar"></div>' +
                      '<h2><a id="source-a" href="' + articleLink + '" target="_blank">' + sourceName + '</a> ' + $(this).find('date').text() + ' EST</h2>' +
                      '<ul id="navsub-1">' +
                      '    <li id="always-li" style="border-top: 1px #888888 solid;" onclick="rateSource(' + sourceID  + ',1,0);"><input type="checkbox" id="always"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Subscribe to ' + sourceName + '</span></li>' +
                      '    <li id="sometimes-li" class="sometimes" onclick="rateSource(' + sourceID + ',0,0);"><input type="checkbox" id="sometimes" checked><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Unsubscribe from ' + sourceName+ '</span></li>' +
                      '    <li id="never-li" onclick="rateSource(' + sourceID  + ',-1,0);"><input type="checkbox" id="never" ><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Block ' + sourceName + '</span></li>' +
                      '</ul>' +
                      '<h2>This article was forwarded by user <a href="http://www.szzzl.com/users/' + $(this).find('forwarding-user-id').text() + '" target="_blank">' + $(this).find('forwarding-user').text() + '</a></h2>' +
                      '<h3>' + $(this).find('prediction').text() + '% chance of szl</h3>';

                      if ($(this).find('image').text() !== ''){ // if there is an image, add it. otherwise don't create an element for it
                        articleHtml += '<div id="articleIMG"><img src="' + $(this).find('image').text() + '" /></div>';
                      }

        articleHtml += '<div id ="articleWrapper">' + articleText + '</div>' +
                      '<a href="' + articleLink + '" target="_blank" >Read more</a>';
        // end block
        a_sourceID.push ( sourceID );
        a_articleID.push( articleID ); // store article's numeric ID
        a_articleContent.push(articleHtml); // store article html
        articleHtml = ''; // reset the value to make way for next block

        // create block to insert into comment table element
        if ($(this).find('comments').find('value').length){
          //console.log('true');
          $(this).find('comments').find('value').each(function(){
            commentID = $(this).find('comment-id').text();
            userName = $(this).find('comment-username').text();
            userID = $(this).find('comment-user-id').text();
            theDate = $(this).find('comment-date').text();
            commentText = $(this).find('content').text();
            Tzzzls = $(this).find('comment-user_tzzzl').text();
            a_commentID.push(commentID);

            //creat html block for comment table
            commentsHtml += '  <table style="background-color: #FEF5DF;">' +
                        '    <tr>' +
                        '      <td rowspan="3" style="border-top: solid 2px #FEF5DF; width: 51px;">' +
                        '        <div id="buttons-' + $(this).index() + '">' +
                        '          <a href="#szl"><img src="img/resized-comment-szzzl.png" style="border: none;" onclick="rateComment(a_commentID['+ $(this).index() + '],1); return false;" onmouseover="this.src=\'img/resized-comment-szzzl-glow.png\'" onmouseout="this.src=\'img/resized-comment-szzzl.png\'" /></a>' +
                        '          <a href="#fzzzl"><img src="img/resized-comment-fzzzl.png" style="border: none;" onclick="rateComment(a_commentID['+ $(this).index() + '],-1); return false;" onmouseover="this.src=\'img/resized-comment-fzzzl-glow.png\'" onmouseout="this.src=\'img/resized-comment-fzzzl.png\'" style="margin-top: 10px;" /></a>' +
                        '        </div>' +
                        '      </td>' +
                        '      <td style="border-top: solid 2px #FEF5DF; border-right: solid 1px #888888; background-color: #FFFFFF; padding-left: 3px; padding-right: 3px;">' +
                        '        <a href="http://www.szzzl.com/users/' + userID + '" target="_blank">' + userName + '</a><span style="color: #888888"> | ' + Tzzzls + '</span> <a href="http://www.szzzl.com/tzzzls">' + 'Tzzzls' + '</a>' +
                        '      </td>' +
                        '    </tr>' +
                        '    <tr>' +
                        '      <td style="border-right: solid 1px #888888; background-color: #FFFFFF; padding-left: 3px; padding-right: 3px;">' +
                        '        ' +  commentText +
                        '      </td>' +
                        '    </tr>' +
                        '    <tr>' +
                        '      <td style="border-bottom: solid 1px #888888; border-right: solid 1px #888888; background-color: #FFFFFF; color: #888888; padding-left: 3px; padding-right: 3px;">' +
                        '        ' + theDate +
                        '      </td>' +
                        '    </tr>' +
                        '  </table>';
            // end comment table block

          });
        } else {

          // if no comments..
          commentsHtml += '<div id="comment-text">There are currently no comments. Be the first to add one!</div>';
        }
        a_commentContent.push(commentsHtml); // push comment html
        commentsHtml = '';

      });
      if (a_articleContent.length == 4){ // insert first article once cache reaches 4
        currentArticleID = a_articleID[0]; // update article ID
        $('#topArticle .content').empty().html(a_articleContent[0]); // empty current content and replace with next
        $('#middleArticle .content').empty().html(a_articleContent[1]);
        shareURL = 'http://www.szzzl.com/buzzes/' + currentArticleID;
        addthis.update( 'share', 'url', shareURL ); // pass url
        addthis.update( 'share', 'title', $('#title a').text() ); // pass article title
        $('#szl-table').empty().html(a_commentContent[0]);   // replace comment
        snakeShowing = false;
      }
      //console.log(a_articleContent.length);
    })
      .done(function(data){
        requestInProgress = false;
    })
    // when get request fails
    .fail(function(){
      //alert('request failed');
      getXML( unratedContent );
    });
  }

  function checkAndLoad(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( navigator.userAgent ) ) {
      isMobile = true;
    }
    if ( isMobile ) {
    }

    getXML( unratedContent );  // load xml for stream of unrated articles 

  }

  checkAndLoad(); // check for mobile and load articles

  function rateArticle( articleID, rating ) {

    var rateArticleURL = ratingLink + currentArticleID + '/rating/'; // * /buzzes/ + (article ID) + /rating/
    if ( rating == -1 ) {
      rateArticleURL += 'fzl.xml';
      fzldCount++;
    } else if ( rating == 1 ) {
      rateArticleURL += 'szl.xml';
      szldCount++;
    }
    articlesViewed++;
    
    // update szld/rated count in the footer
    var $ratingCounter = $('#szldArticle'); // *
    //if ( $ratingCounter && $('#szldArticle').text() !== '' ){
    $ratingCounter.html(szldCount + '/' + articlesViewed + ' szld');
    //}
    //sendRating( rateArticleURL );
  }

  /* send rating data each time user rates an article, source, or comment
   * url will be rateArticleURL, rateSourceURL, or rateCommentURL
   */
  function sendRating( url ) {

    $.get(url, function(data){
      console.log('success');
    });

  }

  function rateComment( commentID, rating ) {
    var rateCommentURL = commentLink + commentID + '/rating/'; // *
    if ( rating == -1 ) {
      //console.log('fzl');
      rateCommentURL += 'comment_fzl.xml';
    } else if ( rating == 1 ) {
      //console.log('szl');
      rateCommentURL += 'comment_szl.xml';
    }
    sendRating( rateCommentURL );
  }

  function rateSource( sourceID, rating, cyclic ) {
    console.log('source ID, ' + sourceID);
    //console.log('source rated');
    var rateSourceURL = sourceLink + sourceID + '/rating/'; // *
    if ( rating == 1 ) {
      rateSourceURL += 'always.xml';
      $(document).ready(function(){
        if ( cyclic === 0 ) {
          $('#navsub-1 li').removeClass();
          $('#always-li').addClass('always');
          $('#always').prop('checked', true);
          $('#sometimes, #never').prop('checked', false);
        }
      });
    } else if ( rating === 0 ) {
      rateSourceURL += 'sometimes.xml';
      $(document).ready(function(){
        if ( cyclic === 0 ) {
          //if ( isMobile ) {
            /*
            $('#always-li').css('background-color','');
            $('#sometimes-li').css('background-color','#FEF5DF');
            $('#never-li').css('background-color','');
          //} else {
            $('#navsub-1 li').removeClass();
            $('#sometimes-li').addClass('sometimes');
          //}*/

          $('#navsub-1 li').removeClass();
          $('#sometimes-li').addClass('sometimes');
          $('#sometimes').prop('checked', true);
          $('#never, #always').prop('checked', false);

        }
      });
    } else if ( rating == -1 ) {
      rateSourceURL += 'never.xml';
      $(document).ready(function(){
        if ( cyclic === 0 ) {
          $('#navsub-1 li').removeClass();
          $('#never-li').addClass('never');
          $('#never').prop('checked', true);
          $('#sometimes, #always').prop('checked', false);
        }
      });
    }
    sendRating( rateSourceURL );
  }

  function showNewArticle(title){

    if (a_articleContent.length === 1 ) { // show loading snake and load more articles if true

      //console.log('true');
      var loadingSnake = '<p style="text-align: center;"><img style="padding-left: 5px; padding-top: 5px;" src="img/ajax-loader-red.gif" /><br />Loading your stream of articles</p>';
      $('#content').html(loadingSnake);
      buttonsDisabled = true; // disable rating buttons while loading new content
      snakeShowing = true; // loading snake visible

      var checkStatus = setInterval(function(){ // check if there is an ongoing xml request. keep loading snake going if so
        if (requestInProgress === false) { // once request is complete, remove snake, and show a new article
          snakeShowing = false;
          showNewArticle();
          clearInterval(checkStatus);
        }
      }, 100);

    } else if (snakeShowing === false) {
      $('#middleArticle .content').html(a_articleContent[2]);//.html(a_articles[i_articleIndex])
      //$('#content').empty().html(a_articleContent[1]); // empty current content and replace with next
      $('#szl-table').empty().html(a_commentContent[1]);   // replace comment
      a_articleContent = a_articleContent.slice(1, a_articleContent.length); // remove rated article from the array
      a_commentContent = a_commentContent.slice(1, a_commentContent.length); // remove its corresponding comment table

      // request more content if there isn't a request in progress
      if (a_articleContent.length == 3){
        if (requestInProgress === false) {
          getXML(unratedContent);
        }
      }

      currentArticleID = a_articleID[rateCount];
      shareURL = 'http://www.szzzl.com/buzzes/' + currentArticleID; // url used by share buttons
      addthis.update( 'share', 'url', shareURL ); // pass url
      addthis.update( 'share', 'title', title ); // top article title
      //console.log(shareURL);
      //console.log('currentID, ' + currentArticleID);
      buttonsDisabled = false;

      $('#topArticle, #articleWrapper').dragscrollable({
        dragSelector: 'p',
        //acceptPropagatedEvent: false
      });
    }
  }

  $(document).ready(function(){

    // set up rating buttons
    $('#rateButtons a').click(function(e){

      if (buttonsDisabled === false && b_isRunning === false) {
        rateCount += 1;
        if (e.target.id == 'rateSzl'){
          szlFzl(e.target.id);
          //console.log('szl');
          rateArticle(articleID, 1);
        } else {
          //console.log('fzl');
          szlFzl(e.target.id);
          rateArticle(articleID, -1);
        }
        //showNewArticle();
      }
      return false;
    });

    // article source dropdown menu
    if ( isMobile ) {
      $('#source-a').click(function(){
        $('#navsub-1').toggle();
        $('#navsub-1 li').click(function(){
          setTimeout( function(){
            $('#navsub-1').hide();
          }, 500 );
        });
      });
    } else {
      $('#mainContent').on('mouseenter', '#source-a', function(){
        //console.log('true');
        $('#navsub-1').show();
        $('#navsub-1').hover(function(){
          $(this).show();
        },function(){
          $(this).hide();
        });
      });
    }

    // article swipe functionality

    var swipeStartTime,
        startPos = {x:0, y:0},
        distance = {x:0, y:0},
        scaledDistance, swipeTime, swipeAngle = 0,
        width = $(window).width(),
        height = $(window).height(),
        b_isRunning = false,
        startDragX,
        startDragY,
        newArticle = {
          axis: 'x',
          //helper: 'clone',
          start: function(e){

            // get starting point of the drag
            startDragX = e.pageX;
            startDragY = e.pageY;
          },
          drag: function(e, ui){

            // prevent drag until user has moved 30px horizontally
            if (Math.abs(e.pageX - startDragX) < 30){
              ui.position.left = 0;
            } else {
              if (ui.position.left < 0) {

                // left drag
                ui.position.left = ui.position.left + 30;
              } else {
                // right drag
                ui.position.left = ui.position.left - 30;
              }
            }
          }
        };

    // move article left or right and change border color based on the swipe direction or the button that was clicked
    var szlFzl = function(target){

      // only execute when another swipe animation isn't in progress
      if (!b_isRunning){
        b_isRunning = true;
        $topArticle = $('#topArticle');

        // if rateSzl button or swipe right called the function, send article right. if not, send it left
        // set the blue/red border the same way
        leftOffset = (target == 'rateSzl' || target == 'left') ? -2 * width : width;
        borderColor = (target == 'rateSzl' || target == 'left') ? '0 0 .5em red' : '0 0 .5em blue';
        $topArticle.animate({left: leftOffset},{queue: false, duration: 500,
          complete: function(){
            $(this).remove(); // remove offscreen article
            createArticle(); // add a new one to bottom of the stack
            b_isRunning = false;
            console.log('swipe complete');
          }
        }).css({'box-shadow': borderColor});
      }
    };

    /*var fzl = function(e){
      if (!b_isRunning){
        b_isRunning = true;
        
        $('#topArticle').animate({left: -2 * $(window).width()}, {queue: false, duration: 500, easing: 'swing',
          complete: function(){
            $(this).remove();
            createArticle();
            b_isRunning = false;
            console.log('swipe complete');

          }
        }).css({'box-shadow': '0 0 .5em blue'});
        createArticle();
      }
    };*/

    var createArticle = function(){
      var newCont = document.createElement('div');
        newCont.id = "bottomArticle";  //container for next article
        $(newCont).addClass('articleContainer');
        newText = document.createElement('div');
        $(newText).addClass('content');

      $('#mainContent').append(newCont);
      $('#bottomArticle').append(newText);
      $('#middleArticle').attr('id', 'topArticle').draggable(newArticle);
      $('#bottomArticle').attr('id', 'middleArticle');
      var title = $('#topArticle .content').find($('#title a')).text();
      //$('.articleContainer').draggable(newArticle);
      /*if ($('#middleArticle').hasClass('requeue')){
        if(i_articleIndex === 0){
          $('#bottomArticle').addClass('article').html(a_articles[i_articleIndex + 5]).css('margin-top', $(window).height() * 0.03).css('margin-left', artPos);
        } else {
          $('#bottomArticle').addClass('articleContainer').html(a_articles[i_articleIndex-1]).css('margin-top', $(window).height() * 0.03).css('margin-left', artPos);
        }
      }
      else {*/
        //var topTitle =$('#topArticle .content').find($('#title a')).text();
        showNewArticle(title);
          //.css('margin-top', $(window).height() * 0.03)
          //.css('margin-left', artPos);
        //i_articleIndex += 1;
      //}
      //if (i_articleIndex > 5){ i_articleIndex = 0;}*/
      console.log('new article');
    };

    var checkForSwipe = function(){

      $topArticle = $('#topArticle');
      if (Math.abs(swipeAngle) <= 45){
        if (scaledDistance / swipeTime > 3){
          if (distance.x > 0){
            $topArticle.css({'box-shadow': '0 0 .5em red'});
            szlFzl('right');
            rateArticle(articleID, -1);
          }
          else if (distance.x < 0){
            $topArticle.css({'box-shadow': '0 0 .5em blue'});
            
            szlFzl('left');
            rateArticle(articleID, 1);
          }
          else {
            $topArticle.animate({left: 0 }, 500, 'easeOutBack');
            //console.log('true');
          }
        }
        else if (Math.abs(distance.x / width) > 0.25){
          if (distance.x > 0) {
            $topArticle.css({'box-shadow': '0 0 .5em red'});
     
            szlFzl('right');
            rateArticle(articleID, -1);
          }
          else if (distance.x < 0){
            $topArticle.css({'box-shadow': '0 0 .5em blue'});
            
            szlFzl('left');
            rateArticle(articleID, 1);
          }
        }
        else {
          $topArticle.animate({left: 0 }, 500, 'easeOutBack');
          //console.log('true');
        }
      }
      else {
        $topArticle.animate({left: 0 }, 500, 'easeOutBack');
        //console.log('true');
      }
    };

    var start = function(e) {
      swipeStartTime = new Date();
      startPos.x = e.pageX;
      startPos.y = e.pageY;
    };

    var end = function(e) {
      var now = new Date();
      swipeTime = (now - swipeStartTime)/1000;
      distance.x = e.pageX - startPos.x;
      distance.y = e.pageY - startPos.y;
      swipeAngle = Math.atan(distance.y / distance.x) * (180 / Math.PI);
      scaledDistance = Math.sqrt((distance.x / width)^2 + (distance.y / height)^2);
    };

    $('#mainContent').mousedown(function(e){
      start(e);
    }).mousemove(function(e){
    //console.log(e.pageX);
    }).mouseup(function(e){
      end(e);
      if (!b_isRunning) checkForSwipe();
    });

    // init draggable for initial top article
    $('.articleContainer').draggable(newArticle);

  });