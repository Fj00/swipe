// szzzl public javascripts
// global flag
var isIE = false;
var isiPhone = false;

// global request and XML document objects
var req;
var getter;

// story data
var unratedStreamURI = '/stream/unrated.xml';
var userDataURI = '/stream/user_data.xml';
var userURI = '/users/';
var streamURI = '/stream.xml';
var voteURI = '/buzzes/';
var commentURI = '/comments/';
var sourceURI = '/sources/';
var storyComments = [];
var storyData = [];
var storyHash = {};
//var viewedStories = {};
var last_story_loaded_index = -1;
var streamlastIndex = -1;
var urlsPosted = 0;
var storyBeingShown = false;
var lastStoryRendered = 0;
var currentlyLoadingStories = false;
var storiesViewed = 0;
var storiesSzzzled = 0;
var storiesFzzzled = 0;
var lastRequestTime = 0;
var timesReqYieldsNoStories = 0;
var minStories = 2;
var backwardsSuccessful = false;
var backwardsFailing = 0;
var backStory = undefined;
var backStoryDisplayed = false;
var displayedStory = undefined;
var r = 0;
var g = 0;
var b = 0;

// views
var storyType = 0;

// story data lookup
var sTitle = 0;
var sSummary = 1;
var sFullStory = 2;
var sId = 3;
var sTitleLong = 4;
var sStoryLong = 5;
var sImg = 6;
var sVote = 7;
var sTallImg = 8;
var sStoryIndex = 9;
var sStoryLink = 10;
var sStoryDate = 11;
var sStorySourceId = 12;
var sStoryAlways = 13;
var sStorySometimes = 14;
var sStoryNever = 15;
var sStoryName = 16;
var sStoryHome = 17;
var sStoryPrediction = 18;
var sStoryForwardingUser = 19;
var sStoryForwardingUserId = 20;
var sStoryForwardingSource = 21;
var sStoryComments = 22;

// comment data lookup
var cCommentId = 0;
var cCommentUsername = 1;
var cCommentUserTzzzl = 2;
var cCommentUserDzzzl = 3;
var cContent = 4;

// scrolling
var firstScroll = true;
var szzzlBarVisible = true;

// story layout
var storyMargin = 0;
var storyHeight = 128 + 2 + 2 + 10;
var szzzlBarHeight = 40;

// user
var username = "";
var userLoggedIn = false;
var tzzzls = 0;
var dzzzls = 0;

// debug
var finishedScrolling = 0;

//---------------------------------------------------------------------//

function Start() {
  setTimeout('Init()', 100);
}

function Init() {
  //if ( ( navigator.userAgent.match( /iPhone/i ) ) || ( navigator.userAgent.match( /iPod/i ) ) || ( navigator.userAgent.match( /iPad/i ) ) || ( navigator.userAgent.match( /Android/i ) ) ) {
  //  isiPhone = true;
  //}
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( navigator.userAgent ) ) {
    isiPhone = true;
  }
  //if ( ( navigator.userAgent.match( /iPhone/i ) ) || ( navigator.userAgent.match( /iPod/i ) ) || ( navigator.userAgent.match( /iPad/i ) ) ) { isiPhone = true; }
  //if ( isiPhone ) { firstScrollsetTimeout( 'ScrollTo( 100 )', 1000 ); }
  if ( isiPhone ) {
    document.addEventListener( 'touchstart', HideSzzzlBarTouch, false );
  }
  var st = gup( "h" );
  if ( st != "" ) {
    storyType = parseInt( st );
  }
  //Main();
  setInterval( 'Main()', 1000 );
  var d = new Date();
  scrollDone = d.getTime() - 1000;
}

function LoginOrLogout() {
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


function Main() {
  var currentDate = new Date();
  var currentTime = currentDate.getTime();
  var currentUrl = document.URL;

  userLoggedIn = ( currentUrl.lastIndexOf( "register" ) == -1 && currentUrl.lastIndexOf( "login" ) == -1 && currentUrl.lastIndexOf( "logout" ) == -1 );    
 
  if ( userLoggedIn ) {
    if ( timesReqYieldsNoStories == 0 || ( lastRequestTime + ( timesReqYieldsNoStories * 1000 ) < currentTime ) ) {
      if ( currentlyLoadingStories == false && storyData.length < minStories ) {
        var uri = "";
        //var progressImage = document.getElementById( 'progress_image' );
        //if( progressImage ){
        //  loadSubmit();
        //}
        uri = unratedStreamURI;

        if ( uri != "" ) {
          currentlyLoadingStories = true;
          var reqDate = new Date();
          lastRequestTime = reqDate.getTime();
          loadXMLDoc( uri );
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

function UpdateLayout( showInfo ) {
}

function HideSzzzlBarTouch ( e ) {
	return;
}

function HideSzzzlBar() {

}

function ShowSzzzlBar() {
	yy = ( window.pageYOffset + 0 );
	document.getElementById( "szzzl-logo" ).style.top = "" + yy + "px";
	szzzlBarVisible = true;
}

function LoadUserData() {
  // user info
  uri = userDataURI;

  if ( uri != "" ) {
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
}

function LoadStories() {
  //var user = req.responseXML.getElementsByTagName( "user" );
  //var oldUserName = username;
  
  //username = getElementTextNS( "", "username", user[0], 0 );
  
  //if ( username.indexOf( 'Anonymous' ) > -1 ) { 
  //  username = ''; 
  //} 
  //if ( username != oldUserName ) {
  //  UpdateUserInfo();
  //}
  
  //tzzzls = getElementTextNS( "", "tzzzl", user[0], 0 );
  //dzzzls = getElementTextNS( "", "dzzzl", user[0], 0 );
//
  //var whitelist = req.responseXML.getElementsByTagName( "whitelist" );

  //for ( var ii = 0; ii < whitelist.length; ii++ ) {
  //  var source_id = getElementTextNS( "", "source-id", whitelist[ii], 0 );
  //  source_ids.push( source_id );
  //}

	var items = req.responseXML.getElementsByTagName( "item" );

	currentlyLoadingStories = true;

	if ( items.length == 0 ) {
		timesReqYieldsNoStories++;
		if ( timesReqYieldsNoStories > 5 )
      timesReqYieldsNoStories = 5;
	  } else {
      timesReqYieldsNoStories = 0;
    }

	var storiesLoaded = 0;
	for ( var ii = 0; ii < items.length; ii++ ) {

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
      storyComments = ""
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
      //story_full = story_full.replace( /å/gi ,'' );
      //story_full = story_full.replace( /.\u0080\u0083/gi ,'' );
      //story_full = story_full.replace( /.\u0080\u009C/gi ,'"' );
      //story_full = story_full.replace( /.\u0080\u009D/gi ,'"' );
      //story_full = story_full.replace( /.\u0080\u0094/gi ,'Ñ' );
      //story_full = story_full.replace( /.\u0080\u0093/gi ,'-' );
      //story_full = story_full.replace( /.\u0080\u0098/gi ,"'" );
      //story_full = story_full.replace( /.\u0080\u0099/gi ,"'" );
      //story_full = story_full.replace( /.\u0082Â/gi ,'\u0080' );
      //story_full = story_full.replace( /.\u0080/gi ,'' );
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
      storyHash[ story_id ] = {
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
	}
	
	if ( !storyBeingShown ){
		OpenStory();
	}

	currentlyLoadingStories = false;
}

function BackClicked() {
  if ( backStory && !backStoryDisplayed ) {
    if ( backStory[sVote] == 1 ) {
      storiesSzzzled--;
    }
    storiesViewed--;
    var ud = document.getElementById( "szzzl-count" );
    if ( ud && ud.innerHTML ){
      ud.innerHTML = storiesSzzzled + '/' + storiesViewed + ' szzzled';
    }
    backStoryDisplayed = true;
    DisplayStory( backStory, false );
  }
}

function GetRandomColor() {
  r = Math.floor( Math.random()*256 );
  g = Math.floor( Math.random()*256 );
  b = Math.floor( Math.random()*256 );
  console.log( r );
  console.log( g );
  console.log( b );
}

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
    tt += '  <h3>' + currStory[sStoryPrediction] + '% chance of szzzl</h3>';
  }
  if ( currStory[sImg] != '' ) {
    tt += '<div id="story-image"><img src="' + currStory[sImg] + '" /></div>';
  }
  tt += '  <div id="szzzl-story-long-wrapper">' + currStory[sStoryLong] + '</div>';

  $(document).ready(function(){
    if ( forward && backStory ) {
      var backButtonNode = document.getElementById( "back-button" );
      if ( backButtonNode ) {
        backButtonNode.innerHTML = '<a href="#back" onClick="BackClicked(); return false;"><img src="images/back-arrow.png" /></a>';
        //$('#back-button').fadeIn(1000);
        var documentHeight = $(document).height();
        //var marginTop = parseInt($('#dragtext').css('margin-top').slice(0,-2),10);
        //$('#dragtext').css('margin-top',( marginTop - 41 ));
        var marginTop = Math.round(( documentHeight - 185 - 80 - 37 + 20 )/2);
        //console.log( documentHeight );
        //console.log( marginTop );
        //$('#dragtext').animate({marginTop: marginTop}, 1000);
        $('#dragtext').css('margin-top',marginTop);
      }
    } else {
      var backButtonNode = document.getElementById( "back-button" );
      if ( backButtonNode ) {
        backButtonNode.innerHTML = '';
      }
    }
  });

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
  cc += '        <div id="szzzl-buttons-' + ( jj + 1 ) + '">';
  cc += '          <a href="#szzzl" onclick=RateComment(' + comment_id + ',1); return false;"><img src="http://www.szzzl.com/images/resized-comment-szzzl.png" onmouseover="this.src=\'http://www.szzzl.com/images/resized-comment-szzzl-glow.png\'" onmouseout="this.src=\'http://www.szzzl.com/images/resized-comment-szzzl.png\'" /></a>';
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
  //cc += '  <div id="comment-text-area">';
  //cc += '    <form action="/comments" class="new_comment" id="new_comment" method="post">';
  //cc += '      <textarea class="comment-text-area" rows="4" id="comment_content" name="comment[content]"></textarea>';
  //cc += '      <input id="comment_buzz_id" name="comment[buzz_id]" type="hidden" value="' + bID + '" />';
  //cc += '      <input class="submit" id="comment_submit" name="commit" type="submit" value="Submit" />';
  //cc += '    </form>';
  //cc += '    <div id="counter">160</div>';
  //cc += '  </div>';

  document.getElementById( "szzzl-button" ).onclick = function() { CloseStory(1,bID); return false; };
  document.getElementById( "fzzzl-button" ).onclick = function() { CloseStory(-1,bID); return false; };

  var storyNode = document.getElementById( "szzzl-content" );
  if ( storyNode && storyNode.innerHTML ) {
    storyNode.innerHTML = tt;
  }

  var commentsNode = document.getElementById( "szzzl-table" );
  if ( commentsNode && commentsNode.innerHTML ) {
    commentsNode.innerHTML = cc;
  }

  var commentsFormNode = document.getElementById( "comment_buzz_id" );
  commentsFormNode.value = bID;

  var wrapperNode = document.getElementById( "szzzl-story-long-wrapper" );
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
      $('#sometimes').attr('checked',false);
      $('#never').attr('checked',false);
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
      $('#always').attr('checked',false);
      $('#sometimes').attr('checked',true);
      $('#never').attr('checked',false);
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
      $('#always').attr('checked',false);
      $('#sometimes').attr('checked',false);
      $('#never').attr('checked',true);
    }

    $('#szzzl-container').scrollTop(0);
    $('#szzzl-table').scrollTop(0);
  });

  storyBeingShown = true;

  //viewedStories[ currStory[sId] ] = true;
  staticUrl = 'http://www.szzzl.com/buzzes/' + currStory[sId]
  addthis.update( 'share', 'url', staticUrl )
  addthis.update( 'share', 'title', currStory[sTitleLong] )    
}


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
    var storyNode = document.getElementById( "szzzl-content" );
    if ( ! snake ) {
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
  var ud = document.getElementById( "szzzl-count" );
  if ( ud && ud.innerHTML ){
    ud.innerHTML = storiesSzzzled + '/' + storiesViewed + ' szzzled';
  }
  
  if ( displayedStory ) {
    displayedStory[sVote] = rating;
  }
  SendGetAndIgnore( urzzl );
  //var comment = document.getElementById( 'szzzl-comment' );
  //if ( comment.className == 'visible' ) {
  //  comment.className = 'hidden';
  //}
}

function RateComment( id, rating ) {
  var urzzl = commentURI + id + '/rating/';
  if ( rating == -1 ) {
    urzzl += 'comment_nay.xml';
  } else if ( rating == 1 ) {
    urzzl += 'comment_yay.xml';
  }
  SendGetAndIgnore( urzzl );
}

function RateSource( id, rating, cyclic ) {
  var urzzl = sourceURI + id + '/rating/';
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
        $('#always').attr('checked',false);
        $('#sometimes').attr('checked',false);
        $('#never').attr('checked',false);
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
        $('#always').attr('checked',false);
        $('#sometimes').attr('checked',false);
        $('#never').attr('checked',false);
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
        $('#always').attr('checked',false);
        $('#sometimes').attr('checked',false);
        $('#never').attr('checked',false);
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
  SendGetAndIgnore( urzzl );
}

function AddTzzzl() {
  var urzzl = 'http://www.szzzl.com/buzzes/1/rating/tzzzl.xml';
console.log( urzzl );
  SendGetAndIgnore( urzzl );
}

//function UpdateUserInfo() {
//  if ( username.length > 0 ) {
//    if ( storiesViewed > 0 ) {
//      if ( tzzzls == 1 ) {
//        if ( dzzzls == 1 ) {
//          tt = '<a href="/users">' + username + '</a> | ' + storiesSzzzled + '/' + storiesViewed + ' szzzled | ' + tzzzls + ' <a href="/tzzzls">tzzzl</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzl</a>';
//        } else {
//          tt = '<a href="/users">' + username + '</a> | ' + storiesSzzzled + '/' + storiesViewed + ' szzzled | ' + tzzzls + ' <a href="/tzzzls">tzzzl</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzls</a>';
//        }
//      } else {
//        if ( dzzzls == 1 ) {
//          tt = '<a href="/users">' + username + '</a> | ' + storiesSzzzled + '/' + storiesViewed + ' szzzled | ' + tzzzls + ' <a href="/tzzzls">tzzzls</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzl</a>';
//        } else {
//          tt = '<a href="/users">' + username + '</a> | ' + storiesSzzzled + '/' + storiesViewed + ' szzzled | ' + tzzzls + ' <a href="/tzzzls">tzzzls</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzls</a>';
//        }
//      }
//    } else {
//      if ( tzzzls == 1 ) {
//        if ( dzzzls == 1 ) {
//          tt = '<a href="/users">' + username + '</a> | ' + tzzzls + ' <a href="/tzzzls">tzzzl</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzl</a>';
//        } else {
//          tt = '<a href="/users">' + username + '</a> | ' + tzzzls + ' <a href="/tzzzls">tzzzl</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzls</a>';
//        }
//      } else {
//        if ( dzzzls == 1 ) {
//          tt = '<a href="/users">' + username + '</a> | ' + tzzzls + ' <a href="/tzzzls">tzzzls</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzl</a>';
//        } else {
//          tt = '<a href="/users">' + username + '</a> | ' + tzzzls + ' <a href="/tzzzls">tzzzls</a> | ' + dzzzls + ' <a href="/tzzzls">dzzzls</a>';
//        }
//      }
//    }
//    var ud = document.getElementById( "szzzl-user-data" );
//    if ( ud && ud.innerHTML ){
//      ud.innerHTML = tt;
//    }
//    //document.getElementById( "login" ).style.display = "none";
//    document.getElementById( "szzzl-user" ).style.display = "inline";		
//  } else {
//    //document.getElementById( "login" ).style.display = "inline";
//    document.getElementById( "szzzl-user" ).style.display = "none";
//	}
//}

function UpdateUserImage() {
	//var img = username.replace( / /gi ,'' );
	//document.getElementById( "buzzSearch" ).style.backgroundImage = 'url( "../images/' + img + '.png" )';
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
}

//---- UTILITY --------------------------------------------------

function loadSubmit() {
  var progressImage = document.getElementById( 'progress_image' );
  document.getElementById( "progress" ).style.visibility = "visible";
  setTimeout( function() { progressImage.src = progressImage.src },100 );
  return true;
}

function ScrollIt ( yy ) {
	window.scrollTo( 0, yy );
}

function gup ( name ) {
  name = name.replace( /[\[]/,"\\\[" ).replace( /[\]]/,"\\\]" );
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function loadXMLDoc( url ) {
	urlsPosted++;					
  // branch for native XMLHttpRequest object
  if ( window.XMLHttpRequest ) {
    //alert( "native XMLHttpRequest()" );
    req = new XMLHttpRequest();
    req.overrideMimeType( 'text/xml' );
    req.onreadystatechange = processReqChange;
    req.open( "GET", url, true );
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
  //alert( "url = " + url );
  // branch for native XMLHttpRequest object
  if ( window.XMLHttpRequest ) {
    //alert( "native XMLHttpRequest()" );
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
  getter.onreadystatechange = function() {
    //Call a function when the state changes.
    if( getter.readyState == 4 && getter.status == 200 ) {
      //alert( poster.responseText );
    }
  }
}

function getElementTextNS( prefix, local, parentElem, index ) {
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
}