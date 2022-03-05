
  Dropzone.autoDiscover = false;

  let lat, lng, alt;

  const setDefaultUIStatus = () => {    
    $("#startButton").hide();
    $("#progressArea").hide();
    $("#fileDropArea").show();
    $("#progress-bar").css("width", "0%");
  }
    
  const uploadToServer = (blob) => {
  
    let fileext = blob.name.split('.').pop();
    let reader = new FileReader();
    reader.onload = function(event){
        let fd = new FormData();
        fd.append('user_id', 1324);
        fd.append('form_kind', "upload");
        fd.append('lat', lat);
        fd.append('lng', lng);        
        if (alt == null) alt = 0;
        fd.append('alt', alt);
        fd.append('fileext', fileext);        
        fd.append('memo', $("#memoInput").val());
        fd.append('data', event.target.result);
        $.ajax({
            type: 'POST',
            url: 'https://duni.io/arink/cs/handler/handler.php',
            data: fd,
            processData: false,
            contentType: false,
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function(e) {
                  var percent = e.loaded * 100 / e.total;
                  setProgress(percent);
                };
                return xhr;
            }                                          
        }).done(function(data) {            
            location.href = "https://arin.aply.biz/cs/index.html";
        });
    };      
    // trigger the read from the reader...
    reader.readAsDataURL(blob);  
  }
  
  const setProgress = (progress) => {
    $("#progress").text('기다려: ' + progress.toFixed(2) + "%");
    $("#progress-bar").css("width", progress + "%");
  };

  document.addEventListener('DOMContentLoaded', function(event) {
    const myDropzone = new Dropzone("#dropzone", { url: "#", autoProcessQueue: false, addRemoveLinks: true, dictDefaultMessage:"이곳을 터치해서 사진을 촬영하세요" });
    myDropzone.on("addedfile", function(file) {
        $("#startButton").show();
    });

    document.getElementById("startButton").addEventListener("click", function() {

      navigator.geolocation.getCurrentPosition(function (position) {
          // than use it to load from remote APIs some places nearby
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          alt = position.coords.altitude;
          $("#fileDropArea").hide();
          $("#startButton").hide();
          $("#progressArea").show();
          $("#progress").text("어디가지마, 기다려!");
          const files = myDropzone.files;
          if (files.length === 0) return;      
          uploadToServer(files[0]);
        },
        (err) => console.error('Error in retrieving position', err),
        {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
        }
      );

      
    });
  });

window.onload = () => {
    // first get current user location
    navigator.geolocation.getCurrentPosition(function (position) {
        // than use it to load from remote APIs some places nearby

        lat = position.coords.latitude;
        lng = position.coords.longitude;
        alt = position.coords.altitude;
        setDefaultUIStatus();
        
      },
      (err) => console.error('Error in retrieving position', err),
      {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 27000,
      }
    );
};
