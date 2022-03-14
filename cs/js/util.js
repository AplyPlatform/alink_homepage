"use strict";

let gIsMine = "";
let isCommentAreaVisible = false;
let oldContentLat, oldContentLng;
let currentReplyIndex = 0;
let currentContentId;
let currentLat, currentLng, currentAlt;

const popLabel = $('<span></span>');
const popContainer = $('<div id="place-label"></div>');


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function setCurrentContent(currentContentLat, currentContentLng, currentContentCount) {
  $('#pagination').twbsPagination('destroy');
  $('#pagination').twbsPagination({
      totalPages: currentContentCount,
      visiblePages: 5,
      first: '',
      prev : '',
      next : '',
      last : '',
      onPageClick: function (event, page) {
          getContent(currentContentLat, currentContentLng, page - 1);
      }
  });

  $('#pagination').twbsPagination('show', 1);
}


function getContent(currentContentLat, currentContentLng, startIndex) {
  setTimeout(() => {
      showLoader();

      let sns_id = getCookie("temp_sns_id");
      let skind = getCookie("dev_kind");
      let user_token = getCookie("user_token");
      let client_id = getCookie("user_clientid");        

      let fd = new FormData();
      fd.append('form_kind', "getspe");        
      fd.append('sns_id', sns_id);    
      fd.append('sns_kind', skind);
      fd.append('user_token', user_token);
      fd.append('client_id', client_id);        
      fd.append('start', startIndex);        
      fd.append('is_mine', gIsMine);
      fd.append('lat', currentContentLat);
      fd.append('lng', currentContentLng);

      $.ajax({
          type: 'POST',
          url: 'https://duni.io/arink/cs/handler/handler.php',
          data: fd,
          cache: false,
          processData: false,
          contentType: false                                                    
      }).done(function(data) {            
          if (!("data" in data) || data.data.length == 0) {
              showAlert("해당 장소에는 기록이 존재하지 않습니다.");
              hideLoader();
              return;
          }

          $('#currentImage').attr("src", "https://duni.io/arink/cs/images/" + data.data[0].filename);        
          let date = new Date(data.data[0].datetime * 1000).toISOString().split("T")[0];
          const time = new Date(data.data[0].datetime * 1000).toTimeString().split(" ")[0];
          $('#currentDate').html("<font size=1>" + date + ' ' + time + "</font>");
          $('#currentMemo').html("<b>" + data.data[0].memo + "</b>");
          $('#commentArea').show();

          popLabel.text(data.data[0].memo);
          popContainer.show();
          
          setTimeout(() => {
              popContainer.hide();
          }, 1500);

          currentContentId = data.data[0].id;
          getComments(currentContentId, 0);            
      }).fail(function()  {
          showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
          hideLoader();
      });        
  }, 0);    
}

function getComments(c_id, start) {    
  showLoader();

  let sns_id = getCookie("temp_sns_id");
  let skind = getCookie("dev_kind");
  let user_token = getCookie("user_token");
  let client_id = getCookie("user_clientid");        

  let fd = new FormData();
  fd.append('form_kind', "comment");
  fd.append('c_id', c_id);
  fd.append('sns_id', sns_id);
  fd.append('sns_kind', skind);
  fd.append('user_token', user_token);
  fd.append('client_id', client_id);
  fd.append('start', start);

  $.ajax({
      type: 'POST',
      url: 'https://duni.io/arink/cs/handler/handler.php',
      data: fd,
      cache: false,
      processData: false,
      contentType: false                                                    
  }).done(function(data) {
      showComments(data.data, start);
      hideLoader();
  }).fail(function()  {
      showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
      hideLoader();
  });
}

function showComments(comments, start) {    
  isCommentAreaVisible = true;

  if (start == 0) $('#commentReplyArea').empty();
  
  if (!comments || comments.length <= 0) {       
      $('#commentReplyMore').hide(); 
      return;
  }

  currentReplyIndex = 0;
  
  let contentRow = "";    
  comments.forEach((d) => {
      let imageContent = "";
      if ("image" in d && isSet(d.image)) {
          imageContent = "<img src='" + d.image + "' border='0' width='24px' height='24px'>";
      }
      else {
          imageContent = "<img src='/cs/assets/" + getRandomInt(1,10) + ".png' border='0' width='24px' height='24px'>";
      }

      let date = new Date(d.datetime * 1000).toISOString().split("T")[0];
      let time = new Date(d.datetime * 1000).toTimeString().split(" ")[0];
      let dtimeStr = date + "<br>" + time;

      contentRow += "<div class='row'>"
          + "<div class='col-1 text-center'>"
          + imageContent
          + "</div>"
          + "<div class='col-2 text-center' style='white-space:nowrap;'><font size=1 color='#ccc'>"
          + dtimeStr
          + "</font></div><div class='col-9 text-left'>"
          + d.comment
          + "</div>"            
          + "</div><div class='row'><hr size='1' width='90%' color='#aaa'></div>";
  });

  $('#commentReplyArea').append(contentRow);

  if (comments.length >= 10) {
      $('#commentReplyMore').show();
  }
  else {
      $('#commentReplyMore').hide();
  }
}



function writeComment() {
  let comment = $("#commentInput").val();
  if (comment == "") {
      showAlert("내용을 입력해 주5");
      return;
  }

  showLoader();

  let sns_id = getCookie("temp_sns_id");
  let skind = getCookie("dev_kind");
  let user_token = getCookie("user_token");
  let temp_image = getCookie("temp_image");
  let client_id = getCookie("user_clientid");

  let fd = new FormData();    
  fd.append('form_kind', 'write');
  fd.append('c_id', currentContentId);
  fd.append('c_image', temp_image);
  fd.append('comment', comment);
  fd.append('sns_id', sns_id);
  fd.append('sns_kind', skind);
  fd.append('user_token', user_token);
  fd.append('client_id', client_id);
  $.ajax({
      type: 'POST',
      url: 'https://duni.io/arink/cs/handler/handler.php',
      data: fd,
      cache: false,
      processData: false,
      contentType: false                                                    
  }).done(function(data) {
      setTimeout(() => {
          getComments(currentContentId, 0);
      }, 0);
  }).fail(function()  {
      showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
      hideLoader();
  });
}

function showLoader() {
  $("#loading").show();
}

function hideLoader() {
  $("#loading").fadeOut(800);
}


function showConfirmDialog() {
  $('#askModalLabel').text("Calming Signal - ARink");
  $('#askModalContent').text("Calming Signal 서비스에 가입하시겠습니까?");
  $('#askModalOKButton').text("네");
  //$('#askModalCancelButton').hide();

  $('#askModalOKButton').off('click');
  $('#askModalOKButton').click(function (e) {
      e.preventDefault();
      $('#askModal').modal('hide');

      setTimeout(() => {
        tryRegister();
    }, 0);
  });

  $('#askModal').modal('show');
}

function showAlert(msg) {
  $('#modal-title').text("ARink");
  $('#modal-confirm-btn').text("확인");

  $('#errorModalLabel').html(msg);
  $('#errorModal').modal('show');
}

function delCookie(cName) {
  var date = new Date();
  document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/; domain=.aply.biz";
}

function setCookie(cName, cValue, cDay) {
  var date = new Date();
  date.setTime(date.getTime() + cDay * 60 * 60 * 24 * 1000);
  document.cookie = cName + '=' + cValue + '; expires=' + date.toUTCString() + '; path=/; domain=.aply.biz';
}

function getCookie(cName) {
  let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + cName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));

  return matches ? matches[1] : null;
}

function isSet(value) {
  if (typeof (value) === 'number')
      return true;
  if (value == "" || value == null || value == "undefined" || value == undefined)
      return false;
  return true;
}
