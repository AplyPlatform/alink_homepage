"use strict";

window.onload = () => {
    kakaoinit();
    setLoginButtons();
};

function kakaoLogin() {
  Kakao.Auth.login({
      success: function (authObj) {
          Kakao.API.request({
              url: '/v2/user/me',
              success: function (res) {
                  setCookie("dev_kind", "kakao", 1);

                  let name = "";
                  let image = "";
                  let email = "";
                  let token = authObj.access_token;

                  if ("properties" in res) {
                      if ("nickname" in res.properties) {
                          name = res.properties['nickname'];
                      }

                      if ("profile_image" in res.properties) {
                          image = res.properties['profile_image'];
                      }
                  }

                  if ("kakao_account" in res) {
                      if ("email" in res.kakao_account) {
                          email = res.kakao_account['email'];
                      }
                  }

                  formSubmit(token, name, image, email);
              },
              fail: function (error) {
                  showAlert("로그인에 실패하였습니다. : " + error);
              },
          })
      },
      fail: function (err) {
          showAlert("로그인에 실패하였습니다. : " + err);
      },
  });
}

function kakaoinit() {
  Kakao.init('74cf06fcd71087d17b1b9b40cb0fa573');

  if (document.getElementById('kakaoLoginBtn')) {
      document.getElementById('kakaoLoginBtn').addEventListener('click', function () {          
          kakaoLogin();
      });
  }
}

function setLoginButtons() {
  let token = getCookie("user_token");
  $("#kakaoLogoutBtn").click(function() {
    signOut();
  });

  $("#kakaoLoginBtn").hide();
  $("#kakaoLogoutBtn").hide();
    
  if (isSet(token)) {
    $("#kakaoLogoutBtn").show();
    $("#kakaoLoginBtn").hide();
  }
  else {
    $("#kakaoLogoutBtn").hide();
    $("#kakaoLoginBtn").show();
  }

  hideLoader();   
}

function signOut() {
  if (!Kakao.Auth.getAccessToken()) {      
    return;
  }

  Kakao.Auth.logout(function() {
    setCookie("dev_kind", "", -1);
    setCookie("user_token", "", -1);
    setCookie("temp_sns_id", "", -1);
    setCookie("user_clientid", "", -1);
    $("#kakaoLogoutBtn").hide();
    $("#kakaoLoginBtn").show();
  });    
}

function formSubmit(token, temp_name, temp_image, temp_email) {
    showLoader();

    if (isSet(temp_name) == false) {
        temp_name = "";
    }

    if (isSet(temp_email) == false) {
        temp_email = "";
    }

    if (isSet(temp_image) == false) {
        temp_image = "";
    }

    let skind = getCookie("dev_kind");

    let fd = new FormData();  
    fd.append('form_kind', 'login');  
    fd.append('sns_kind', skind);
    fd.append('sns_id', token);
    fd.append('nickname', temp_name);
    fd.append('email', temp_email);
    fd.append('image', temp_image);
    $.ajax({
        type: 'POST',
        url: 'https://duni.io/arink/cs/handler/handler.php',
        data: fd,
        cache: false,
        processData: false,
        contentType: false                                                    
    }).done(function(data) {
        hideLoader();
        if (data.result_code != 0) {
            if (data.reason == "not registered") {
              setCookie("temp_sns_id", token, 1);
              setCookie("temp_name", temp_name, 1);
              setCookie("temp_email", temp_email, 1);
              setCookie("temp_image", temp_image, 1);
              showConfirmDialog();
              return;
            }
        }

        setCookie("temp_sns_id", token, 1);
        setCookie("temp_name", temp_name, 1);
        setCookie("temp_email", temp_email, 1);
        setCookie("temp_image", temp_image, 1);
        setCookie("user_token", data.token, 1);
        setCookie("user_clientid", data.client_id, 1);

        $("#kakaoLogoutBtn").show();
        $("#kakaoLoginBtn").hide();
    }).fail(function()  {
      alert("Sorry. Server unavailable. ");
      hideLoader();
    });
}

function tryRegister() {
  showLoader();
  let sns_id = getCookie("temp_sns_id");
  let temp_name = getCookie("temp_name");
  let temp_email = getCookie("temp_email");
  let temp_image = getCookie("temp_image");
  let skind = getCookie("dev_kind");

  let fd = new FormData();  
  fd.append('form_kind', 'register');  
  fd.append('sns_kind', skind);
  fd.append('sns_id', sns_id);
  fd.append('nickname', temp_name);
  fd.append('email', temp_email);
  fd.append('image', temp_image);
  $.ajax({
      type: 'POST',
      url: 'https://duni.io/arink/cs/handler/handler.php',
      data: fd,
      cache: false,
      processData: false,
      contentType: false                                                    
  }).done(function(data) {
      hideLoader();

      if (data.result_code != 0) {
        showAlert("죄송합니다, 회원가입이 실패하였습니다 : " + data.reason);
        return;    
      }
      
      setCookie("user_token", data.token, 1);
      setCookie("user_clientid", data.client_id, 1);
      $("#kakaoLogoutBtn").show();
      $("#kakaoLoginBtn").hide();   

      showAlert("축하드립니다. 성공적으로 가입되었습니다.");
  }).fail(function()  {
        alert("Sorry. Server unavailable. ");
        hideLoader();
  });
}

