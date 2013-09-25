// szzzl public javascripts
// global flag
var isIE = false, // flag for IE
    isiPhone = false, // flag for mobile device

// global request and XML document objects
    req,
    getter;

// story data
var unratedStreamURI = 'https://dl.dropboxusercontent.com/u/97446129/13.09.23/13.09.22/js/unrated.xml', //unrated articles stream
    userDataURI = '/stream/user_data.xml',
    userURI = '/users/',
    streamURI = '/stream.xml',
    voteURI = '/buzzes/',
    commentURI = '/comments/',
    sourceURI = '/sources/',
    storyComments = [],
    storyData = [],
    storyHash = {},
//var viewedStories = {};
    last_story_loaded_index = -1,
    streamlastIndex = -1,
    urlsPosted = 0,
    storyBeingShown = false,
    lastStoryRendered = 0,
    currentlyLoadingStories = false,
    storiesViewed = 0,
    storiesSzzzled = 0,
    storiesFzzzled = 0,
    lastRequestTime = 0,
    timesReqYieldsNoStories = 0, // # of times the req for content yielded nothing new
    minStories = 2,
    backwardsSuccessful = false,
    backwardsFailing = 0,
    backStory,
    backStoryDisplayed = false,
    displayedStory,

    // values set by getRandomColor()
    r = 0,
    g = 0,
    b = 0,

    // views
    storyType = 0,

    // story data lookup
    sTitle = 0,
    sSummary = 1,
    sFullStory = 2,
    sId = 3,
    sTitleLong = 4,
    sStoryLong = 5,
    sImg = 6,
    sVote = 7,
    sTallImg = 8,
    sStoryIndex = 9,
    sStoryLink = 10,
    sStoryDate = 11,
    sStorySourceId = 12,
    sStoryAlways = 13,
    sStorySometimes = 14,
    sStoryNever = 15,
    sStoryName = 16,
    sStoryHome = 17,
    sStoryPrediction = 18,
    sStoryForwardingUser = 19,
    sStoryForwardingUserId = 20,
    sStoryForwardingSource = 21,
    sStoryComments = 22,

    // comment data lookup
    cCommentId = 0,
    cCommentUsername = 1,
    cCommentUserTzzzl = 2,
    cCommentUserDzzzl = 3,
    cContent = 4,

    // scrolling
    firstScroll = true,
    szzzlBarVisible = true,

    // story layout
    storyMargin = 0,
    storyHeight = 128 + 2 + 2 + 10,
    szzzlBarHeight = 40,

    // user
    username = "",
    userLoggedIn = false,
    tzzzls = 0,
    dzzzls = 0,

    // debug
    finishedScrolling = 0;

//---------------------------------------------------------------------//

  /*function Start(){
    setTimeout(Init(), 100);
  }

  function Init() {
    console.log('init');
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( navigator.userAgent ) ) {
      isiPhone = true;
    }
    if ( isiPhone ) {
      document.addEventListener( 'touchstart', HideSzzzlBarTouch, false ); // HideSzzzlBarTouch isn't defined anywhere
    }

    var st = gup( "h" );
    if ( st !== "" ) {
      storyType = parseInt(( st ), 10);
    }

    //Main();
    setInterval(Main(), 1000 );
    var d = new Date();
    scrollDone = d.getTime() - 1000; // scrollDone doesn't show up again after this
  }

  // check if user is logged in and load stream of unrated articles
  function Main() {
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    var currentUrl = document.URL;


    // returns true when 'register', 'login', 'logout' aren't found within the currentUrl
    userLoggedIn = ( currentUrl.lastIndexOf( "register" ) == -1 && currentUrl.lastIndexOf( "login" ) == -1 && currentUrl.lastIndexOf( "logout" ) == -1 );
    console.log(currentUrl);
    console.log(userLoggedIn);

    if ( userLoggedIn ) {
      if ( timesReqYieldsNoStories == 0 || ( lastRequestTime + ( timesReqYieldsNoStories * 1000 ) < currentTime ) ) {
        if ( currentlyLoadingStories == false && storyData.length < minStories ) {
          var uri = "";
          uri = unratedStreamURI; // unrated articles stream

          if ( uri != "" ) {  // if the unrated stream exists..

            currentlyLoadingStories = true;
            var reqDate = new Date();
            lastRequestTime = reqDate.getTime(); // store the time of request
            loadXMLDoc( uri );  // load xml for stream of unrated articles 
          }
        } else {
          if ( timesReqYieldsNoStories == 0 ) { 
            var reqDate = new Date();
            lastRequestTime = reqDate.getTime(); 
          }
        }
      }
    } else {
      username = "";
    }
  }

  // click handlers for szl & fzl buttons
  /*$('#szl-button').click(function(){
    console.log('szl');
    return false;
  });
  $('#fzzzl-button').click(function(){
    console.log('fzl');
    return false;
  });*/



  // not being called
  /*function LoginOrLogout() {
    if ( username == "Login" || username == "" ) {
      Login();
    } else {
      Logout();
    }
  }

  function Login() {
    window.location = '/login';
  }

  function Logout() {
    window.location = '/logout';
  }

  function ShowSzzzlBar() {
    yy = ( window.pageYOffset + 0 );
    document.getElementById( "szl-logo" ).style.top = "" + yy + "px";
    szzzlBarVisible = true;
  }*/

  // Call to this is commented out
  /*function LoadUserData() {
    // user info
    uri = userDataURI;

    if ( uri !== "" ) {
      loadXMLDoc( uri );
    }

    var user = req.responseXML.getElementsByTagName( "user" );
    var oldUserName = username;

    username = getElementTextNS( "", "username", user[0], 0 );
    
    if ( username.indexOf( 'Anonymous' ) > -1 ) {
      username = '';
    }
    if ( username != oldUserName ) {
      UpdateUserInfo();
    }
    
    tzzzls = getElementTextNS( "", "tzzzl", user[0], 0 );
    dzzzls = getElementTextNS( "", "dzzzl", user[0], 0 );
  }*/




  function LoadStories() {

    var items = req.responseXML.getElementsByTagName( "item" ); // all 'item' elements from the returned XML

    currentlyLoadingStories = true;

    if ( items.length == 0 ) { // if request didn't return any unrated stories, timesReqYieldsNoStories is incremented by 1
      timesReqYieldsNoStories++;
    if ( timesReqYieldsNoStories > 5 )
      timesReqYieldsNoStories = 5;
    } else {
      timesReqYieldsNoStories = 0;
    }

    var storiesLoaded = 0;

    for ( var ii = 0; ii < items.length; ii++ ) { // loops through elements in the XML 

      //  getElementTextNS(prefix, local, parentElem, index);
      var story_id = getElementTextNS( "", "id", items[ii], 0 );
      var story_title_long = getElementTextNS( "", "title", items[ii], 0 );
      var story_title = story_title_long;
      var story_date = getElementTextNS( "", "date", items[ii], 0 );
      var story_link = getElementTextNS( "", "link", items[ii], 0 );
      var story_source_id = getElementTextNS( "", "source-id", items[ii], 0 );
      var story_always = getElementTextNS( "", "always", items[ii], 0 ) === 'true';
      var story_sometimes = getElementTextNS( "", "sometimes", items[ii], 0 ) === 'true';
      var story_never = getElementTextNS( "", "never", items[ii], 0 ) === 'true';
      var story_name = getElementTextNS( "", "name", items[ii], 0 );
      var story_home = getElementTextNS( "", "home", items[ii], 0 );
      var story_forwarding_user = getElementTextNS( "", "forwarding-user", items[ii], 0 );
      var story_forwarding_user_id = getElementTextNS( "", "forwarding-user-id", items[ii], 0 );
      var story_forwarding_source = getElementTextNS( "", "forwarding-source", items[ii], 0 );
      var story_prediction = getElementTextNS( "", "prediction", items[ii], 0 );
      var story_comments = items[ii].getElementsByTagName( "comments" );
      //console.log( story_comments.length );
      if ( story_comments.length > 0 ) {
        storyComments = [];
        for ( var jj = 0; jj < story_comments.length; jj++ ) {
          if ( typeof story_comments[jj] !== "undefined" && story_comments[jj] !== null ) {
            var comment_id = getElementTextNS( "", "comment-id", story_comments[jj], 0 );
            var comment_username = getElementTextNS( "", "comment-username", story_comments[jj], 0 );
            var comment_user_id = getElementTextNS( "", "comment-user-id", story_comments[jj], 0 );
            var comment_user_tzzzl = getElementTextNS( "", "comment-user_tzzzl", story_comments[jj], 0 );
            var comment_user_dzzzl = getElementTextNS( "", "comment-user_dzzzl", story_comments[jj], 0 );
            var comment_date = getElementTextNS( "", "comment-date", story_comments[jj], 0 );
            var content = getElementTextNS( "", "content", story_comments[jj], 0 );
            //console.log( comment_id );
            if ( comment_id != "n/a" ) {
              storyComments.push( [ comment_id, comment_username, comment_user_id, comment_user_tzzzl, comment_user_dzzzl, comment_date, content ] );
            }
          }
        }
      } else {
        storyComments = "";
      }

      var story_link_href = '<a href="' + story_link + '" target="_blank" >Read more</a>';

      var story_description = items[ii].getElementsByTagName( "description" );

      last_story_loaded_index = Number( getElementTextNS( "", "index", items[ii], 0 ) );

      if ( story_description[0].getAttribute( 'nil' ) == 'true' ) {
        var story_full = '';
        var story_long = '';
      } else {
        story_full = getElementTextNS( "", "description", items[ii], 0 );
        story_full = story_full.replace( /<script[\s\S]*<\/script>/gi ,'' );
        story_full = story_full.replace( /<img[^>]+\>/gi ,'' );
        story_long = story_full;
        story_full = story_full.replace( /<\/?[^>]+(>|$)/g, "" );
      }
      if ( story_full.length > 1 ) {
        if ( isiPhone ) {
          //var story_summary = story_full.substring( 0, 256 );
          var story_summary = getElementTextNS( "", "summary", items[ii], 0 );
        } else {
          //story_summary = story_full.substring( 0, 1024 );
          story_summary = getElementTextNS( "", "summary", items[ii], 0 );
        }
      } else {
        //story_summary = '( ' + story_id + ' ) ' + story_link.substring( 0, 32 );
        story_summary = GetDomain( story_link );
        story_summary = '( ' + story_id + ' ) ' + GetDomain( story_link );
      }
      story_full = '<p>' + story_full + '</p>';
      story_full += '<p>' + story_link_href + '</p>';
      story_long = '<p>' + story_long + '</p>';
      story_long += '<p>' + story_link_href + '</p>';
      var story_img = getElementTextNS( "", "image", items[ii], 0 );
      //if ( ii == 10 ) { alert( "story_title = " + story_title ); }
      if ( ( story_img.indexOf( '?' ) > -1 ) || ( story_img.length < 3 ) ) {
        //if ( ii == 10 ) { alert( "story_img = " + story_img ); }
        //continue;
        story_img = '';
      }

      var story_vote = 0;
      var story_vote_previous = items[ii].getElementsByTagName( "rating" );
      if ( story_vote_previous[0].getAttribute( 'nil' ) != 'true' ) {
        story_vote = parseInt( getElementTextNS( "", "rating", items[ii], 0 ) );
      }

      if ( story_vote == 0 ) {
        storyData.push( [ story_title, story_summary, story_full, story_id, story_title_long, story_long, story_img, story_vote, -1, last_story_loaded_index, story_link, story_date, story_source_id, story_always, story_sometimes, story_never, story_name, story_home, story_prediction, story_forwarding_user, story_forwarding_user_id, story_forwarding_source, storyComments ] );
        storyHash[ story_id ] = { //
          "comments": storyComments,
          "forwarding_source": story_forwarding_source,
          "forwarding_user_id": story_forwarding_user_id,
          "forwarding_user": story_forwarding_user,
          "prediction": story_prediction,
          "home": story_home,
          "name": story_name,
          "never": story_never,
          "sometimes": story_sometimes,
          "always": story_always,
          "source_id": story_source_id,
          "date": story_date,
          "link": story_link,
          "title": story_title,
          "summary": story_summary,
          "full": story_full,
          "id": story_id,
          "titleLong": story_title_long,
          "storyLong": story_long,
          "image": story_img,
          "vote": story_vote,
          "tallImage": -1,
          "index": last_story_loaded_index,
        };
        //viewedStories[ story_id ] = false;
      }
      storiesLoaded++;

    } // end loop through XML
    
    if ( !storyBeingShown ){
      OpenStory();
    }

    currentlyLoadingStories = false;
  }


  // not being called 
  /*function GetRandomColor() {
    r = Math.floor( Math.random()*256 );
    g = Math.floor( Math.random()*256 );
    b = Math.floor( Math.random()*256 );
  }*/


  function DisplayStory( currStory, forward ){
    displayedStory = currStory;
    var bID = currStory[sId];
    var sID = currStory[sStorySourceId];

    var tt = '';
    var cc = '';

    tt += '  <h1><a href="' + currStory[sStoryLink] + '" target="_blank">' + currStory[sTitleLong] + '</a></h1>';
    tt += '  <div id="titlebar"></div>';
    if ( isiPhone ) {
      tt += '  <h2><span id="source-a" style="color: #AF2F4E; text-decoration: underline">' + currStory[sStoryName] + '</span> ' + currStory[sStoryDate] + ' EST</h2>';
    } else {
      tt += '  <h2><a id="source-a" href="' + currStory[sStoryHome] + '" target="_blank">' + currStory[sStoryName] + '</a> ' + currStory[sStoryDate] + ' EST</h2>';
    }
    tt += '  <ul id="navsub-1">';
    tt += '    <li id="always-li" style="border-top: 1px #888888 solid;" onClick="RateSource(' + sID + ',1,0);"><input type="checkbox" id="always"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Subscribe to ' + currStory[sStoryName] + '</span></li>';
    tt += '    <li id="sometimes-li" onClick="RateSource(' + sID + ',0,0);"><input type="checkbox" id="sometimes"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Unsubscribe from ' + currStory[sStoryName] + '</span></li>';
    tt += '    <li id="never-li" onClick="RateSource(' + sID + ',-1,0);"><input type="checkbox" id="never"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Block ' + currStory[sStoryName] + '</span></li>';
    tt += '  </ul>';
    if ( currStory[sStoryForwardingUser].length > 0 ) {
      tt += '  <h2>This article was forwarded by user <a href="http://www.szzzl.com/users/' + currStory[sStoryForwardingUserId] + '" target="_blank">' + currStory[sStoryForwardingUser] + '</a></h2>';
    }
    if ( currStory[sStoryForwardingSource].length > 0 ) {
      tt += '  <h2>This article was forwarded from RSS source <a href="' + currStory[sStoryHome] + '" target="_blank">' + currStory[sStoryForwardingSource] + '</a></h2>';
    }
    if ( currStory[sStoryForwardingUser].length == 0 && currStory[sStoryForwardingSource].length == 0 ) {
      tt += '  <h2>This article was forwarded based on prediction</h2>';
    }
    if ( currStory[sStoryPrediction].length > 0 ) {
      tt += '  <h3>' + currStory[sStoryPrediction] + '% chance of szl</h3>';
    }
    if ( currStory[sImg] != '' ) {
      tt += '<div id="story-image"><img src="' + currStory[sImg] + '" /></div>';
    }
    tt += '  <div id="szl-story-long-wrapper">' + currStory[sStoryLong] + '</div>';

    if ( currStory[sStoryComments].length > 0 ) {
      for ( var jj = 0; jj < currStory[sStoryComments].length; jj++ ) {
        var comment_user_username = currStory[sStoryComments][cCommentUsername];
        var comment_user_id = currStory[sStoryComments][cCommentUserId];
        var comment_user_tzzzl = currStory[sStoryComments][cCommentUserTzzzl];
        var comment_user_tzzzl_text = "";
        comment_user_tzzzl == 1 ? comment_user_tzzzl_text = "tzzzl" : comment_user_tzzzl_text = "tzzzls";
        var comment_content = currStory[sStoryComments][cContent];
        var comment_date = currStory[sStoryComments][cCommentDate];
        var comment_id = currStory[sStoryComments][cCommentId];
    cc += '  <table style="background-color: #FEF5DF;">';
    cc += '    <tr>';
    cc += '      <td rowspan="3" style="border-top: solid 2px #FEF5DF; width: 51px;">';
    cc += '        <div id="szl-buttons-' + ( jj + 1 ) + '">';
    cc += '          <a href="#szl" onclick=RateComment(' + comment_id + ',1); return false;"><img src="http://www.szzzl.com/images/resized-comment-szzzl.png" onmouseover="this.src=\'http://www.szzzl.com/images/resized-comment-szzzl-glow.png\'" onmouseout="this.src=\'http://www.szzzl.com/images/resized-comment-szzzl.png\'" /></a>';
    cc += '          <a href="#fzzzl" onclick=RateComment(' + comment_id + ',-1); return false;"><img src="http://www.szzzl.com/images/resized-comment-fzzzl.png" onmouseover="this.src=\'http://www.szzzl.com/images/resized-comment-fzzzl-glow.png\'" onmouseout="this.src=\'http://www.szzzl.com/images/resized-comment-fzzzl.png\'" style="margin-top: 10px;" /></a>';
    cc += '        </div>';
    cc += '      </td>';
    cc += '      <td style="border-top: solid 2px #FEF5DF; border-right: solid 1px #888888; background-color: #FFFFFF; padding-left: 3px; padding-right: 3px;">';
    cc += '        <a href="http://www.szzzl.com/users/' + comment_user_id + '" target="_blank">' + comment_user_username + '</a><span style="color: #888888"> | ' + comment_user_tzzzl + '</span> <a href="http://www.szzzl.com/tzzzls">' + comment_user_tzzzl_text + '</a>';
    cc += '      </td>';
    cc += '    </tr>';
    cc += '    <tr>';
    cc += '      <td style="border-right: solid 1px #888888; background-color: #FFFFFF; padding-left: 3px; padding-right: 3px;">';
    cc += '        ' + comment_content;
    cc += '      </td>';
    cc += '    </tr>';
    cc += '    <tr>';
    cc += '      <td style="border-bottom: solid 1px #888888; border-right: solid 1px #888888; background-color: #FFFFFF; color: #888888; padding-left: 3px; padding-right: 3px;">';
    cc += '        ' + comment_date;
    cc += '      </td>';
    cc += '    </tr>';
    cc += '  </table>';
      }
    } else {
      cc += '  <div id="comment-text">There are currently no comments. Be the first to add one!</div>';
    }

    document.getElementById( "szzzl-button" ).onclick = function() { CloseStory(1,bID); return false; };
    document.getElementById( "fzzzl-button" ).onclick = function() { CloseStory(-1,bID); return false; };

    var storyNode = document.getElementById( "szl-content" );
    if ( storyNode && storyNode.innerHTML ) {
      storyNode.innerHTML = tt;
    }

    var commentsNode = document.getElementById( "szl-table" );
    if ( commentsNode && commentsNode.innerHTML ) {
      commentsNode.innerHTML = cc;
    }

    var commentsFormNode = document.getElementById( "comment_buzz_id" );
    commentsFormNode.value = bID;

    var wrapperNode = document.getElementById( "szl-story-long-wrapper" );
    if ( wrapperNode ) {
      KillStyles( wrapperNode );
    }

    $(document).ready(function(){
      if ( isiPhone ) {
        $('#source-a').click(function(){
          $('#navsub-1').toggle();
          $('#navsub-1 li').click(function(){
            setTimeout( function(){ $('#navsub-1').hide() }, 500 );
          });
        });
      } else {
        $('#source-a').hover(function(){
          $('#navsub-1').show();
          $('#navsub-1').hover(function(){
            $(this).show();
          },function(){
            $(this).hide();
          });
        });
      }

      if ( currStory[sStoryAlways] ) {
        if ( isiPhone ) {
          $('#always-li').css('background-color','#AF2F4E');
        } else {
          $('#always-li').css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
          $('#always-li').css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
          $('#always-li').css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
          $('#always-li').css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
          $('#always-li').css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
        }
        $('#always').attr('checked',true);
        $('#sometimes, #never').attr('checked',false);
      } else if ( currStory[sStorySometimes] ) {
        if ( isiPhone ) {
          $('#sometimes-li').css('background-color','#FEF5DF');
        } else {
          $('#sometimes-li').css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
          $('#sometimes-li').css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
          $('#sometimes-li').css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
          $('#sometimes-li').css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
          $('#sometimes-li').css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
        }
        $('#always, #never').attr('checked',false);
        $('#sometimes').attr('checked',true);
      } else if ( currStory[sStoryNever] ) {
        if ( isiPhone ) {
          $('#never-li').css('background-color','#2E6D90');
        } else {
          $('#never-li').css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
          $('#never-li').css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
          $('#never-li').css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
          $('#never-li').css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
          $('#never-li').css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
        }
        $('#always, #sometimes').attr('checked',false);
        $('#never').attr('checked',true);
      }

      $('#szl-container').scrollTop(0);
      $('#szl-table').scrollTop(0);
    });

    storyBeingShown = true;

    //viewedStories[ currStory[sId] ] = true;
    staticUrl = 'http://www.szzzl.com/buzzes/' + currStory[sId]
    addthis.update( 'share', 'url', staticUrl )
    addthis.update( 'share', 'title', currStory[sTitleLong] )    
  }
/*

  function OpenStory() {
    //UpdateUserInfo();
    
    if ( storyData.length > 0 ) {
      var vote = storyData[0][sVote]; 
      while ( storyData.length > 0 && vote == -1 || vote == 1 ){
        storyData.splice( 0, 1 );
        vote = storyData[0][sVote];
      }
      DisplayStory( storyData[0], true );
    }
  }

  function KillStyles( n ) {
    //alert( "n ---> " + n );
    //alert( "style ---> " + n.getAttribute( "style" ) );
    n.removeAttribute( "style" );
    //n.removeAttribute( "class" );
    n.removeAttribute( "id" );
    for ( var ii = 0; ii < n.childNodes.length; ii++ ) {
      if ( n.childNodes[ii].nodeType == 1 ) {
        KillStyles( n.childNodes[ii] );
      }
    }
  }

  function CloseStory( vote, id ) {
    storyBeingShown = false;
    snake = false;
    document.getElementById( "szzzl-button" ).onclick = function() { return false; };
    document.getElementById( "fzzzl-button" ).onclick = function() { return false; };

    if ( storyData.length == 1 ) {
      var storyNode = document.getElementById( "szl-content" );
      if ( ! snake ) { // show loading snake
        storyNode.innerHTML = '<p style="text-align: center;"><img style="padding-left: 5px; padding-top: 5px;" src="images/ajax-loader-red.gif" /><br />Loading your stream of articles</p>';
        snake = true;
      }
      setTimeout( function() { CloseStory( vote, id ) }, 500 );
    } else {
      RateStory( id, vote );
      if ( !backStoryDisplayed ){
        backStory = storyData[0];
        storyData.splice( 0, 1 );
      } else {
        backStory = undefined
      }
      backStoryDisplayed = false;

      OpenStory();
    }
  }

  function RateStory( id, rating ) {
    var urzzl = voteURI + id + '/rating/';
    if ( rating == -1 ) { 
      urzzl += 'nay.xml';
      storiesFzzzled++;
    } else if ( rating == 0 ) { 
      urzzl += 'meh.xml';
    } else if ( rating == 1 ) { 
      urzzl += 'yay.xml';
      storiesSzzzled++;
    }
    storiesViewed++;
  console.log( storiesViewed );
    var ud = document.getElementById( "szl-count" );
    if ( ud && ud.innerHTML ){
      ud.innerHTML = storiesSzzzled + '/' + storiesViewed + ' szzzled';
    }
    
    if ( displayedStory ) {
      displayedStory[sVote] = rating;
    }
    SendGetAndIgnore( urzzl );
  }

  function RateComment( id, rating ) {
    var urzzl = commentURI + id + '/rating/';
    if ( rating == -1 ) {
      urzzl += 'comment_nay.xml';
    } else if ( rating == 1 ) {
      urzzl += 'comment_yay.xml';
    }
    SendGetAndIgnore( urzzl );
  }*/

  function RateSource( id, rating, cyclic ) {
    /*var urzzl = sourceURI + id + '/rating/';
    if ( rating == 1 ) {
      urzzl += 'always.xml';
      $(document).ready(function(){
        if ( cyclic == 0 ) {
          //if ( isiPhone ) {
            $('#always-li').css('background-color','#AF2F4E');
            $('#sometimes-li').css('background-color','');
            $('#never-li').css('background-color','');
          //} else {
            $('#always-li').css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#always-li').css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#always-li').css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#always-li').css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#always-li').css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#sometimes-li').css('background-image','');
            $('#never-li').css('background-image','');
          //}
          $('#always, #sometimes, #never').attr('checked',false);
          $('#always').attr('checked',true);
        } else if ( cyclic == 1 ) {
          if ( isiPhone ) {
            $('#source-' + id).css('background-color','#AF2F4E');
          } else {
            $('#source-' + id).css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
            $('#source-' + id).css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #AF2F4E 100%)');
          }
          $('#source-' + id).attr('onclick','RateSource(' + id + ', -1, 1)');
        }
      });
    } else if ( rating == 0 ) {
      urzzl += 'sometimes.xml';
      $(document).ready(function(){
        if ( cyclic == 0 ) {
          //if ( isiPhone ) {
            $('#always-li').css('background-color','');
            $('#sometimes-li').css('background-color','#FEF5DF');
            $('#never-li').css('background-color','');
          //} else {
            $('#always-li').css('background-image','');
            $('#sometimes-li').css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#sometimes-li').css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#sometimes-li').css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#sometimes-li').css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#sometimes-li').css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#never-li').css('background-image','');
          //}
          $('#always, #sometimes, #never').attr('checked',false);
          $('#sometimes').attr('checked',true);
        } else if ( cyclic == 1 ) {
          if ( isiPhone ) {
            $('#source-' + id).css('background-color','#FEF5DF');
          } else {
            $('#source-' + id).css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
            $('#source-' + id).css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #FEF5DF 100%)');
          }
          $('#source-' + id).attr('onclick','RateSource(' + id + ', 1, 1)');
        }
      });
    } else if ( rating == -1 ) {
      urzzl += 'never.xml';
      $(document).ready(function(){
        if ( cyclic == 0 ) {
          //if ( isiPhone ) {
            $('#always-li').css('background-color','');
            $('#sometimes-li').css('background-color','');
            $('#never-li').css('background-color','#2E6D90');
          //} else {
            $('#always-li').css('background-image','');
            $('#sometimes-li').css('background-image','');
            $('#never-li').css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#never-li').css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#never-li').css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#never-li').css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#never-li').css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
          //}
          $('#always, #sometimes', '#never').attr('checked',false);
          $('#never').attr('checked',true);
        } else if ( cyclic == 1 ) {
          if ( isiPhone ) {
            $('#source-' + id).css('background-color','#2E6D90');
          } else {
            $('#source-' + id).css('background-image','linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-o-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-ms-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-moz-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
            $('#source-' + id).css('background-image','-webkit-linear-gradient(-90deg, #FFFFFF 0%, #2E6D90 100%)');
          }
          $('#source-' + id).attr('onclick','RateSource(' + id + ', 0, 1)');
        }
      });
    }
    SendGetAndIgnore( urzzl );*/
  }


  // doesn't get called anywhere in this file
  /*function AddTzzzl() {
    var urzzl = 'http://www.szzzl.com/buzzes/1/rating/tzzzl.xml';
  console.log( urzzl );
    SendGetAndIgnore( urzzl );
  }

  function Show( id ) {
    var comment = document.getElementById( id );
    if ( comment.className == 'hidden' ) {
      comment.className = 'visible';
    }
  }
  function Hide( id ) {
    var comment = document.getElementById( id );
    if ( comment.className == 'visible' ) {
      comment.className = 'hidden';
    }
  }*/

  //---- UTILITY --------------------------------------------------

  //not getting called
  /*function loadSubmit() {
    var progressImage = document.getElementById( 'progress_image' );
    document.getElementById( "progress" ).style.visibility = "visible";
    setTimeout( function() { progressImage.src = progressImage.src },100 );
    return true;
  }

  function gup ( name ) {
    name = name.replace( /[\[]/,"\\\[" ).replace( /[\]]/,"\\\]" );
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null ) {
      return "";
    } else {
      return results[1];
    }
  }


  function loadXMLDoc( url ) {
    urlsPosted++;
    // branch for native XMLHttpRequest object
    if ( window.XMLHttpRequest ) {
      console.log('load');
      //alert( "native XMLHttpRequest()" );
      req = new XMLHttpRequest();
      req.overrideMimeType( 'text/xml' );
      req.onreadystatechange = processReqChange;
      req.open( "GET", url , true );
      req.send( null );
      // branch for IE/Windows ActiveX version
    } else if ( window.ActiveXObject ) {
      isIE = true;
      req = new ActiveXObject( "Microsoft.XMLHTTP" );
      if ( req ) {
        req.onreadystatechange = processReqChange;
        req.open( "GET", url, true );
        req.send();
      }
    }
  }

  // handle onreadystatechange event of req object
  function processReqChange() {
    if ( req.readyState == 4 ) {
      // only if "OK"
      if ( req.status == 200 ) {
        //LoadUserData();
        LoadStories();
      } else {
        alert( "There was a problem retrieving the XML data:\n" + req.statusText );
      }
    }
  }

  function SendGetAndIgnore( url ) {
    // branch for native XMLHttpRequest object
    if ( window.XMLHttpRequest ) {
      getter = new XMLHttpRequest();
      getter.overrideMimeType( 'text/xml' );
      getter.open( "GET", url, true );
      getter.send( null );
      // branch for IE/Windows ActiveX version
    } else if ( window.ActiveXObject ) {
      isIE = true;
      getter = new ActiveXObject( "Microsoft.XMLHTTP" );
      if ( getter ) {
        getter.open( "GET", url, true );
        getter.send();
      }
    }
  }

  function getElementTextNS( prefix, local, parentElem, index ) { // 
    var result = "";
    if ( prefix && isIE ) {
      // IE/Windows way of handling namespaces
      result = parentElem.getElementsByTagName( prefix + ":" + local )[index];
    } else {
      // the namespace versions of this method 
      // ( getElementsByTagNameNS() ) operate
      // differently in Safari and Mozilla, but both
      // return value with just local name, provided 
      // there aren't conflicts with non-namespace element
      // names
      result = parentElem.getElementsByTagName( local )[index];
    }
    if ( result != null ) {
      // get text, accounting for possible
      // whitespace ( carriage return ) text nodes 
      if ( result.childNodes.length > 1 ) {
        return result.childNodes[1].nodeValue;
      } else {
        if ( result.firstChild != null ) {
          return result.firstChild.nodeValue;  
        }
        return '';
      }
    } else {
      return "n/a";
    }
  }

  function KillNetProcess () {
    if ( req.transport ) {
      req.transport.abort();
    }
  }*/


    // attempt at rewriting xml request with jQuery
    var article = $('#szl-content'),
        szlCount = 0,
        articleHtml_block = '',
        commentsHtml_block = '',
        i_articleCache = 0,
        a_articleContent = [],
        a_commentContent = [],
        tagName, // tag in unrated.xml
        elemContent; // content within XML tag

    var extractContent = function(tagName, parent){ // extract tag name & its associated content 
      console.log(tagName + ': ' + parent.find(tagName).text());
      elemContent = parent.find(tagName).text();
      //a_articleContent.push[tagContent]

      html_block += parent.find(tagName).text() + '</br>'; // add content from each tag into a main block
    };

    var theURL = 'https://dl.dropboxusercontent.com/u/97446129/13.09.23/13.09.22/js/unrated.xml';
    $.get(theURL)
      .done(function(data){
        console.log(data); // the returned XML object

        $(data).find('item').each(function(){ // loop through each 'item' tag (4 total)
          itemIndex = $(this).index(); // get the index of current 'item'
          var self = $(this); // store current value of 'this' for passing to 'extractContent'
          console.log('item number: ' + itemIndex);
          /*$(this).children().each(function(){ // loop through each child of xml item
            tagName = $(this).prop('tagName'); // get its tag name
            extractContent( tagName, self );
          });
          console.log('');
          a_articleContent.push(html_block); // push each html_block
          html_block = ''; // reset the value to make way for next block
          i_articleCache += 1;
          if (i_articleCache == 4){ // insert block of html once cache reaches 4
            //$('#szl-content').html(a_articleContent[szlCount]); // set html 
          }*/

          // create an html block for article using text from the XML elements 
          articleHtml_block += '<h1><a href=' + $(this).find('link').text() + '" target="_blank">' + $(this).find('title').text() + '</a></h1>' +
                        '<div id="titlebar"></div>' +
                        '<h2><a id="source-a" href="' + $(this).find('link').text() + '" target="_blank">' + $(this).find('name').text() + '</a> ' + $(this).find('date').text() + ' EST</h2>' +
                        '<ul id="navsub-1">' +
                        '    <li id="always-li" style="border-top: 1px #888888 solid;" onClick="RateSource(' + $(this).find('id').text()  + ',1,0);"><input type="checkbox" id="always"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Subscribe to ' + $(this).find('name').text() + '</span></li>' +
                        '    <li id="sometimes-li" onClick="RateSource(' + $(this).find('id').text() + ',0,0);"><input type="checkbox" id="sometimes"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Unsubscribe from ' + $(this).find('name').text() + '</span></li>' +
                        '    <li id="never-li" onClick="RateSource(' + $(this).find('id').text()  + ',-1,0);"><input type="checkbox" id="never"><span style="color: #AF2F4E; margin-left: 4px; margin-right: 4px;">Block ' + $(this).find('name').text() + '</span></li>' +
                        '</ul>' +
                        '<h2>This article was forwarded by user <a href="http://www.szzzl.com/users/' + $(this).find('forwarding-user-id').text() + '" target="_blank">' + $(this).find('forwarding-user').text() + '</a></h2>' +
                        '<h3>' + $(this).find('prediction').text() + '% chance of szl</h3>';

                        if ($(this).find('image').attr('nil') === false){ // if there is an image, add it. otherwise don't create an element for it
                          articleHtml_block += '<div id="story-image"><img src="' + $(this).find('image').text() + '" /></div>';
                        }

          articleHtml_block += '<div' + $(this).find('description').text() + '</div>' +
                        '<a href="' + $(this).find('link').text() + '" target="_blank" >Read more</a>';
          a_articleContent.push(articleHtml_block); // push article html
          articleHtml_block = ''; // reset the value to make way for next block

          // create block to insert into comment table element
          if ($(this).find('comments').text() !== ''){
          $(this).find('comments').find('value').each(function(){
          commentsHtml_block += '  <table style="background-color: #FEF5DF;">' +
                        '    <tr>' +
                        '      <td rowspan="3" style="border-top: solid 2px #FEF5DF; width: 51px;">' +
                        '        <div id="szl-buttons-' + '1' + '">' +
                        '          <a href="#szl" onclick=RateComment(' + 'abc' + ',1); return false;"><img src="http://www.szzzl.com/images/resized-comment-szzzl.png" onmouseover="this.src=\'http://www.szzzl.com/images/resized-comment-szzzl-glow.png\'" onmouseout="this.src=\'http://www.szzzl.com/images/resized-comment-szzzl.png\'" /></a>' +
                        '          <a href="#fzzzl" onclick=RateComment(' + 'abc' + ',-1); return false;"><img src="http://www.szzzl.com/images/resized-comment-fzzzl.png" onmouseover="this.src=\'http://www.szzzl.com/images/resized-comment-fzzzl-glow.png\'" onmouseout="this.src=\'http://www.szzzl.com/images/resized-comment-fzzzl.png\'" style="margin-top: 10px;" /></a>' +
                        '        </div>' +
                        '      </td>' +
                        '      <td style="border-top: solid 2px #FEF5DF; border-right: solid 1px #888888; background-color: #FFFFFF; padding-left: 3px; padding-right: 3px;">' +
                        '        <a href="http://www.szzzl.com/users/' + 'abc' + '" target="_blank">' + 'abc' + '</a><span style="color: #888888"> | ' + '11' + '</span> <a href="http://www.szzzl.com/tzzzls">' + 'abcd' + '</a>' +
                        '      </td>' +
                        '    </tr>' +
                        '    <tr>' +
                        '      <td style="border-right: solid 1px #888888; background-color: #FFFFFF; padding-left: 3px; padding-right: 3px;">' +
                        '        ' + 'abc' +
                        '      </td>' +
                        '    </tr>' +
                        '    <tr>' +
                        '      <td style="border-bottom: solid 1px #888888; border-right: solid 1px #888888; background-color: #FFFFFF; color: #888888; padding-left: 3px; padding-right: 3px;">' +
                        '        ' + 'abc' +
                        '      </td>' +
                        '    </tr>' +
                        '  </table>';
          });
          a_commentContent.push(commentsHtml_block); // push comment html
          commentsHtml_block = '';
          }
          i_articleCache += 1;
          if (i_articleCache == 4){ // insert first block of html once cache reaches 4
            $('#szl-content').html(a_articleContent[szlCount]); // set html 
            $('#szl-table').html(a_commentContent[szlCount]);
          }
          console.log($(this).find('comments').typeof);
        });
        console.log(a_articleContent.length);


      })
      .fail(function(){
        alert(' request failed');
      });

      $(document).ready(function(){
        szlCount = 0;
        $('#szl-button').click(function(){
          szlCount += 1;
          if (szlCount == 4) { // if count is equal to array length
            szlCount = 0; // reset count
          }
          $('#szl-content').empty().html(a_articleContent[szlCount]); // empty current content and replace with next block
          return false;
        });

        if ( isiPhone ) {
          $('#source-a').click(function(){
            $('#navsub-1').toggle();
            $('#navsub-1 li').click(function(){
              setTimeout( function(){
                $('#navsub-1').hide();
              }, 500 );
            });
          });
        } else {
          $('#szl-content').on('mouseenter', '#source-a', function(){
            console.log('true');
            $('#navsub-1').show();
            $('#navsub-1').hover(function(){
              $(this).show();
            },function(){
              $(this).hide();
            });
          });
        }
      });

          /*  var story_id = getElementTextNS( "", "id", items[ii], 0 );
      var story_title_long = getElementTextNS( "", "title", items[ii], 0 );
      var story_title = story_title_long;
      var story_date = getElementTextNS( "", "date", items[ii], 0 );
      var story_link = getElementTextNS( "", "link", items[ii], 0 );
      var story_source_id = getElementTextNS( "", "source-id", items[ii], 0 );
      var story_always = getElementTextNS( "", "always", items[ii], 0 ) === 'true';
      var story_sometimes = getElementTextNS( "", "sometimes", items[ii], 0 ) === 'true';
      var story_never = getElementTextNS( "", "never", items[ii], 0 ) === 'true';
      var story_name = getElementTextNS( "", "name", items[ii], 0 );
      var story_home = getElementTextNS( "", "home", items[ii], 0 );
      var story_forwarding_user = getElementTextNS( "", "forwarding-user", items[ii], 0 );
      var story_forwarding_user_id = getElementTextNS( "", "forwarding-user-id", items[ii], 0 );
      var story_forwarding_source = getElementTextNS( "", "forwarding-source", items[ii], 0 );
      var story_prediction = getElementTextNS( "", "prediction", items[ii], 0 );
      var story_comments = items[ii].getElementsByTagName( "comments" ); */