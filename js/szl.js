// Szl.it © Copyright 2013 \\

// * indicates variable name that was changed
// others are newly created names

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
    requestsWithoutResult = 0, // * # of times the req for content yielded nothing new
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

        // create an html block for article using text from the XML elements
        articleHtml += '<h1 id="title"><a href=' + articleLink + '" target="_blank">' + $(this).find('title').text() + '</a></h1>' +
                      '<div id="titleBar"></div>' +
                      '<h2><a id="source-a" href="' + articleLink + '" target="_blank">' + sourceName + '</a> ' + $(this).find('date').text() + ' EST</h2>' +
                      '<ul id="navsub-1">' +
                      '    <li id="always-li" style="border-top: 1px #888888 solid;" onclick="rateSource(' + articleID  + ',1,0);"><input type="checkbox" id="always"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Subscribe to ' + sourceName + '</span></li>' +
                      '    <li id="sometimes-li" class="sometimes" onclick="rateSource(' + articleID + ',0,0);"><input type="checkbox" id="sometimes" checked><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Unsubscribe from ' + sourceName+ '</span></li>' +
                      '    <li id="never-li" onclick="rateSource(' + articleID  + ',-1,0);"><input type="checkbox" id="never" ><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Block ' + sourceName + '</span></li>' +
                      '</ul>' +
                      '<h2>This article was forwarded by user <a href="http://www.szzzl.com/users/' + $(this).find('forwarding-user-id').text() + '" target="_blank">' + $(this).find('forwarding-user').text() + '</a></h2>' +
                      '<h3>' + $(this).find('prediction').text() + '% chance of szl</h3>';

                      if ($(this).find('image').text() !== ''){ // if there is an image, add it. otherwise don't create an element for it
                        articleHtml += '<div id="articleIMG"><img src="' + $(this).find('image').text() + '" /></div>';
                      }

        articleHtml += '<div id ="articleWrapper">' + articleText + '</div>' +
                      '<a href="' + articleLink + '" target="_blank" >Read more</a>';
        // end block

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
        $('#content').empty().html(a_articleContent[0]); // empty current content and replace with next
        $('#szl-table').empty().html(a_commentContent[0]);   // replace comment
        snakeShowing = false;
      }
      console.log(a_articleContent.length);
    })
      .done(function(data){
        requestInProgress = false;
    })
    // when get request fails
    .fail(function(){
      alert('request failed');
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
    $ratingCounter.html(szldCount + '/' + articlesViewed + ' szled');
    //}
    sendRating( rateArticleURL );
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
    //console.log('source ID, ' + sourceID);
    //console.log('source rated');
    var rateSourceURL = sourceLink + sourceID + '/rating/'; // *
    if ( rating == 1 ) {
      rateSourceURL += 'always.xml';
      $(document).ready(function(){
        if ( cyclic === 0 ) {
          //if ( isMobile ) {
            /*$('#always-li').css('background-color','#AF2F4E');
            $('#sometimes-li').css('background-color','');
            $('#never-li').css('background-color','');
          //} else {
            $('#navsub-1 li').removeClass();
            $('#always-li').addClass('always');

          //}*/

          $('#navsub-1 li').removeClass();
          $('#always-li').addClass('always');
          $('#always').prop('checked', true);
          $('#sometimes, #never').prop('checked', false);

        } /*else if ( cyclic == 1 ) {
          if ( isMobile ) {
            $('#source-' + id).css('background-color','#AF2F4E');
          } else {
            $('#source-' + id).css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
          }
          $('#source-' + id).attr('onclick','rateSource(' + id + ', -1, 1)');
        }*/
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
        // not sure what this does
        /*else if ( cyclic == 1 ) {
          if ( isMobile ) {
            $('#source-' + id).css('background-color','#FEF5DF');
          } else {
            $('#source-' + id).css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
          }
          $('#source-' + id).attr('onclick','rateSource(' + id + ', 1, 1)');
        }*/
      });
    } else if ( rating == -1 ) {
      rateSourceURL += 'never.xml';
      $(document).ready(function(){
        if ( cyclic === 0 ) {
          /*//if ( isMobile ) {
            $('#always-li').css('background-color','');
            $('#sometimes-li').css('background-color','');
            $('#never-li').css('background-color','#2E6D90');
          //} else {
            $('#navsub-1 li').removeClass();
            $('#never-li').addClass('never');
          //}*/

          $('#navsub-1 li').removeClass();
          $('#never-li').addClass('never');
          $('#never').prop('checked', true);
          $('#sometimes, #always').prop('checked', false);

        }
        //unsure
        /*else if ( cyclic == 1 ) {
          if ( isMobile ) {
            $('#source-' + id).css('background-color','#2E6D90');
          } else {
            $('#source-' + id).css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
          }
          $('#source-' + id).attr('onclick','rateSource(' + id + ', 0, 1)');
        }*/
      });
    }
    sendRating( rateSourceURL );
  }

  function showNewArticle(){

    if (a_articleContent.length === 1 ) { // show loading snake and load more articles if true

      console.log('true');
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
      
      $('#content').empty().html(a_articleContent[1]); // empty current content and replace with next
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
      addthis.update( 'share', 'title', $('#title a').text() ); // pass article title
      //console.log(shareURL);
      //console.log('currentID, ' + currentArticleID);
      buttonsDisabled = false;

    }
  }

  $(document).ready(function(){

    // set up rating buttons
    $('#rateButtons a').click(function(e){

      if (buttonsDisabled === false) {
        rateCount += 1;
        if (e.target.id == 'rateSzl'){
          //console.log('szl');
          rateArticle(articleID, 1);
        } else {
          //console.log('fzl');
          rateArticle(articleID, -1);
        }
        showNewArticle();
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
      $('#content').on('mouseenter', '#source-a', function(){
        //console.log('true');
        $('#navsub-1').show();
        $('#navsub-1').hover(function(){
          $(this).show();
        },function(){
          $(this).hide();
        });
      });
    }
  });