$(document).ready(function(){
  /*$('#source-a').hover(function(){
    $('#navsub-1').show();
    $('#navsub-1').hover(function(){
      $(this).show();
    },function(){
      $(this).hide();
    });
  });*/

  $('#username .userNav').hover(function(){
    console.log('hover');
    $('#navsub-2').show();
    },function(){
    $('#navsub-2').hide();
  });


  var nameLength = $('#username-a').width() + 4;
  $('#tzls').css('left', nameLength + 'px');
  $('#szldArticle').css('left', nameLength + 'px');

  //initialize article width becos css xux
  var documentWidth = $(document).width();
  var documentHeight = $(document).height();
  var sidebarFixedWidth = 412;
  var dragbarFixedWidth = 42;
  var mainWidth = documentWidth - dragbarFixedWidth;
  var tableFixedHeight = $('#szl-table').height();
  if ( mainWidth > 705 ) {
    var marginLeft = Math.round(( mainWidth - 705 )/2);
    var footerWidth = 705;
  } else {
    var marginLeft = 0;
    var footerWidth = mainWidth;
  }
  if ( tableFixedHeight > documentHeight - 200 ) {
    var tableHeight = documentHeight - 200;
  } else {
    var tableHeight = tableFixedHeight;
  }

  var marginTop = Math.round(( documentHeight - 185 - 80 + 20 )/2);

  //$('#mainContent').css('width',mainWidth);
  //$('header').css('width',mainWidth);
  //$('footer').css('width',footerWidth);
  //$('footer').css('margin-left',marginLeft);
  $('#dragtext').css('margin-top',marginTop);
  //$('#szl-table').css('height',tableHeight);

  //hi
  /*$(window).resize(function(){
    var documentWidth = $(document).width();
    var documentHeight = $(document).height();
    var sidebarWidth = $('#sidebar').width();
    if ( $('#mainContent').width() > 705 ) {
      var marginLeft = Math.round(( documentWidth - sidebarWidth - 705 )/2);
      var footerWidth = 705;
    } else {
      var marginLeft = 0;
      var footerWidth = documentWidth - sidebarWidth;
    }
    if ( tableFixedHeight > documentHeight - 200 ) {
      var tableHeight = documentHeight - 200;
    } else {
      var tableHeight = tableFixedHeight;
    }
    if ( $('#back-button').children().length ) {
      var marginTop = Math.round(( documentHeight - 222 - 80 + 20 )/2);
    } else {
      var marginTop = Math.round(( documentHeight - 185 - 80 + 20 )/2);
    }

    $('#mainContent').css('width',documentWidth - sidebarWidth);
    $('header').css('width',documentWidth - sidebarWidth);
    $('footer').css('width',footerWidth);
    $('footer').css('margin-left',marginLeft);
    $('#dragtext').css('margin-top',marginTop);
    //$('#szl-table').css('height',tableHeight);
  });*/
  //1-5
  //6-37
  //38-42
  //43-74
  //75-79
  //80-111
  //112-116
  //117-148
  //149-153
  //154-185

  // BORG FUNCTION
  /*$('#dragbar').click(function(e){
    var dragbarOffset = $(this).parent().offset();
    var dragbarClickX = e.pageX - dragbarOffset.left;
    var dragbarClickY = e.pageY;
    console.log( dragbarClickY );
    var documentHeight = $(document).height();
    if ( dragbarClickX <= 4 || dragbarClickX > 36 || dragbarClickY <= 4 || ( dragbarClickY > 36 && dragbarClickY <= 41 ) || ( dragbarClickY > 73 && dragbarClickY <= 78 ) || ( dragbarClickY > 110 && dragbarClickY <= 115 ) || ( dragbarClickY > 147 && dragbarClickY <= 152 ) || ( dragbarClickY > 184 && dragbarClickY <= 189 ) || ( dragbarClickY > 221 ) ) {
      var documentWidth = $(document).width();
      var articleFixedWidth = 705;
      var sidebarFixedWidth = 412;
      var dragbarFixedWidth = 42;
      var mainWidth = documentWidth - sidebarFixedWidth;
      var sidebarWidth = $('#sidebar').width();

      if( sidebarWidth == sidebarFixedWidth ) {
        $('#sidebar').animate({width: dragbarFixedWidth}, 1000);
        $('#mainContent').animate({width: documentWidth - dragbarFixedWidth}, 1000);
        $('header').animate({width: documentWidth - dragbarFixedWidth}, 1000);
        // documentWidth < 748
        if ( documentWidth < articleFixedWidth + dragbarFixedWidth + 1 ) {
          $('footer').animate({width: documentWidth - dragbarFixedWidth}, 1000);
        }
        // documentWidth > 747 && documentWidth < 1117
        else if ( documentWidth > articleFixedWidth + dragbarFixedWidth && documentWidth < articleFixedWidth + sidebarFixedWidth ) {
          var marginLeft = Math.round(( documentWidth - dragbarFixedWidth - articleFixedWidth )/2);
          $('footer').animate({width: articleFixedWidth, marginLeft: marginLeft}, 1000);
        }
        // documentWidth > 1116
        else if ( documentWidth > articleFixedWidth + sidebarFixedWidth - 1 ) {
          var marginLeft = parseInt($('footer').css('marginLeft').slice(0,-2));
          $('footer').animate({marginLeft: marginLeft + ( sidebarFixedWidth - dragbarFixedWidth )/2}, 1000);
        }
        setTimeout(function(){ $('#dragbar').css('cursor','w-resize'); }, 500);
      } else {
        $('#sidebar').animate({width: sidebarFixedWidth}, 1000);
        $('#mainContent').animate({width: mainWidth}, 1000);
        $('header').animate({width: mainWidth}, 1000);
        // documentWidth < 748
        if ( documentWidth < articleFixedWidth + dragbarFixedWidth + 1 ) {
          $('footer').animate({width: mainWidth}, 1000);
        }
        // documentWidth > 747 && documentWidth < 1117
        else if ( documentWidth > articleFixedWidth + dragbarFixedWidth && documentWidth < articleFixedWidth + sidebarFixedWidth ) {
          $('footer').animate({width: mainWidth, marginLeft: 0}, 1000);
        }
        // documentWidth > 1116
        else if ( documentWidth > articleFixedWidth + sidebarFixedWidth - 1 ) {
          var marginLeft = parseInt($('footer').css('marginLeft').slice(0,-2));
          $('footer').animate({marginLeft: marginLeft - ( sidebarFixedWidth - dragbarFixedWidth )/2}, 1000);
        }
        setTimeout(function(){ $('#dragbar').css('cursor','e-resize'); }, 500);
      }
    }
  });*/

  //comment counter
  $('#comment-submit').hide();
  $('#comment_content').keyup(function(event){
    var maxNum = 160;
    var inputText = $('#comment_content').val();
    var numChar = inputText.length;
    var charRemain = maxNum - numChar;
    console.log(inputText);

    $('#counter').text(charRemain);
    if(charRemain < 0){
      $('#counter').css('color','#CC0000')
      $('#comment_content').removeClass('correct').addClass('error');
      $('#comment-submit').fadeOut(1000);
    }
    else if (charRemain < 160) {
      $('#counter').css('color','black');
      $('#comment-submit').fadeIn(1000);
      $('#comment_content').removeClass('error').addClass('correct');
    }

    else{ $('#comment_content').removeClass('error').removeClass('correct');
      $('#counter').css('color','black');
      $('#comment-submit').fadeOut(1000);
    }
  });

  function addRows(tableId,username,user_id,tzzzl) {
    var table = document.getElementById(tableId);
    var rowCount = table.rows.length;
    var row1 = table.insertRow(rowCount);
    var row2 = table.insertRow(rowCount+1);
    var row3 = table.insertRow(rowCount+2);

    var cell11 = row.insertCell(0);
    var cell11id = "cell" + rowCount + 1 + "1";
    cell11.setAttribute("id", cell11id);
    cell11.appendChild('');

    var cell12 = row.insertCell(1);
    var cell12id = "cell" + rowCount + 1 + "2";
    cell12.setAttribute("id", cell12id);
    var cell12content = '<a href="http://www.szzzl.com/users/' + user_id + '" target="_blank">' + username + '</a> | ' + tzzzl + ' <a href="http://www.szzzl.com/tzzzls">';
    cell12.appendChild(cell12content);
    console.log( cell12content );

    var cell21 = row.insertCell(0);
    var cell21id = "cell" + rowCount + 2 + "1";
    cell21.setAttribute("id", cell21id);
    cell21.appendChild('');

    var cell22 = row.insertCell(1);
    var cell22id = "cell" + rowCount + 2 + "2";
    cell22.setAttribute("id", cell22id);
    var comment = $('#comment_content').val();
    cell22.appendChild(comment);
    console.log( comment );

    var cell31 = row.insertCell(0);
    var cell31id = "cell" + rowCount + 3 + "1";
    cell31.setAttribute("id", cell31id);
    cell31.appendChild('');

    var cell32 = row.insertCell(1);
    var cell32id = "cell" + rowCount + 3 + "2";
    cell32.setAttribute("id", cell32id);
    var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var month = getMonth();
    var day = getDate();
    var date = months[month] + day;
    cell32.appendChild(date);
    console.log( date );

    f(cell11id)
    .text(f(cell21id).remove().text())
    .text(f(cell31id).remove().text())
    .attr('rowspan','3');
  }

  function f(id){
    return $("#" + id);
  }

  //submits comment when enter pressed
  $('#comment_content').keypress(function(event) {
    var code = (event.keyCode ? event.keyCode : event.which);
    if (code == 13){
      event.preventDefault();
      $('#comment-submit').trigger('click');
    }
  });

  //grays out szzzl/fzzzl buttons in comment table
  $('td').find('a').on('mouseup', function(e){
    console.log('click');
    $(this).parent().find('img').css({'opacity':'0.5','filter':'alpha(opacity=50)'}).unbind('click');
    $('td').find('a').on('click', function(e) {
      e.preventDefault();
    });
  });
  
  /*$(document).click(function(e){
    console.log(e.target);
  });
  grayed = false;
  $('#szl-table').on('click', 'td', function(e){
     if ($(this).attr('gray') == 'true') return false;
    console.log('click');
    grayed = true;
    $(this).attr('gray', 'true').unbind('click').css({'opacity':'0.5','filter':'alpha(opacity=50)'});
  });*/

});



