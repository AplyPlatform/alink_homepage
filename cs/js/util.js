"use strict";


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
