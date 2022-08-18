
  
  let currentBlob = null;
  const compiler = new MINDAR.IMAGE.Compiler();

  $(function() {
    setDefaultUIStatus();
    imageCropperSetup();
  });  

  const setDefaultUIStatus = () => {
    $("#short_url_field").hide();        
    $("#viewer_button").hide();
    $("#startButton").hide();
    $("#progressArea").hide();
    $("#fileDropArea").show();
    $("#progress-bar").css("width", "0%");
  }

  function imageCropperSetup() {

      var avatar = document.getElementById('avatar');
      var image = document.getElementById('image');
      var input = document.getElementById('inputimage_file');    
      var $alert = $('.alert');
      var $modal = $('#modal');
      var cropper;
      
      $('[data-toggle="tooltip"]').tooltip();      

      input.addEventListener('change', function (e) {
        $('[data-toggle="tooltip"]').tooltip('hide')
        
        var files = e.target.files;
        var done = function (url) {
          input.value = '';
          image.src = url;
          $alert.hide();          
          $modal.modal('show');
        };
        var reader;
        var file;
        if (files && files.length > 0) {
          file = files[0];

          if (URL) {
            done(URL.createObjectURL(file));
          } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
              done(reader.result);
            };
            reader.readAsDataURL(file);
          }
        }
      });

      var cropBoxData;
      var canvasData;
      $modal.on('shown.bs.modal', function () {
        cropper = new Cropper(image, {          
          autoCropArea: 0.5,
          ready: function () {
            //Should set crop box data first here
            cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
          }
        });
      }).on('hidden.bs.modal', function () {
        cropper.destroy();
        cropper = null;
      });

      document.getElementById('crop').addEventListener('click', function () {      
        var canvas;

        $modal.modal('hide');

        if (cropper) {
          canvas = cropper.getCroppedCanvas({
            width: 800,
            height: 800,
          });
          initialAvatarURL = avatar.src;
          avatar.src = canvas.toDataURL();
          $alert.removeClass('alert-success alert-warning');
          
          canvas.toBlob(function (blob) {            
            currentBlob = blob;
            $("#startButton").show();
          });        
        }
      });
  }
    
  const uploadToServer = (blob) => {
  
    var reader = new FileReader();
    reader.onload = function(event){
        let fname = Date.now() + "";
        var fd = new FormData();
        fd.append('form_kind', "objet_upload");
        fd.append('fname', fname);
        fd.append('data', event.target.result);
        $.ajax({
            type: 'POST',
            url: 'https://duni.io/arink/arinkassets/objethandler.php',
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
            // print the output from the upload.php script
            //console.log(data);
            //alert("처리 완료!");
            generateShortURL("https://aplx.aply.biz/objet/viewer.html?mname=" + fname)            
        });
    };      
    // trigger the read from the reader...
    reader.readAsDataURL(blob);
  
  }
  
  const download = (buffer) => {    
    var blob = new Blob([buffer]);
    uploadToServer(blob);      
    return;
  
    var aRink = window.document.createElement('a');
    aRink.download = 'targets.mind';
    aRink.href = window.URL.createObjectURL(blob);
    aRink.click();
    window.URL.revokeObjectURL(aRink.href);
  }
  
  const showData = (data) => {
    //console.log("data", data);
    for (let i = 0; i < data.trackingImageList.length; i++) {
      const image = data.trackingImageList[i];
      const points = data.trackingData[i].points.map((p) => {
        return {x: Math.round(p.x), y: Math.round(p.y)};
      });
      showImage(image, points);
    }
  
    for (let i = 0; i < data.imageList.length; i++) {
      const image = data.imageList[i];
      const kpmPoints = [...data.matchingData[i].maximaPoints, ...data.matchingData[i].minimaPoints];
      const points2 = [];
      for (let j = 0; j < kpmPoints.length; j++) {
        points2.push({x: Math.round(kpmPoints[j].x), y: Math.round(kpmPoints[j].y)});
      }
      showImage(image, points2);
    }
  }
  
  
  const showImage = (targetImage, points) => {
    return;
  
    const container = document.getElementById("filecontainer");
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    canvas.width  = targetImage.width;
    canvas.height = targetImage.height;
    canvas.style.width = canvas.width;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = new Uint32Array(imageData.data.buffer);
  
    const alpha = (0xff << 24);
    for (let c = 0; c < targetImage.width; c++) {
      for (let r = 0; r < targetImage.height; r++) {
        const pix = targetImage.data[r * targetImage.width + c];
        data[r * canvas.width + c] = alpha | (pix << 16) | (pix << 8) | pix;
      }
    }
  
    var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00; // green
    for (let i=0; i < points.length; ++i) {
      const x = points[i].x;
      const y = points[i].y;
      const offset = (x + y * canvas.width);
      data[offset] = pix;
      //for (var size = 1; size <= 3; size++) {
      for (var size = 1; size <= 6; size++) {
        data[offset-size] = pix;
        data[offset+size] = pix;
        data[offset-size*canvas.width] = pix;
        data[offset+size*canvas.width] = pix;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
  
  const loadImage = async (file) => {
    const img = new Image();
  
    return new Promise((resolve, reject) => {          
      let img = new Image()
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    })
  }
  
  const compileFiles = async (files) => {
    const images = [];        
    
    for (let i = 0; i < files.length; i++) {         
      images.push(await loadImage(files[i]));
    }        
  
    //let _start = new Date().getTime();    
    const dataList = await compiler.compileImageTargets(images, (progress) => {
      $("#progress").text('기다려: ' + progress.toFixed(2) + "%");
      $("#progress-bar").css("width", progress.toFixed(2) + "%");
    });
    //console.log('exec time compile: ', new Date().getTime() - _start);
    
    for (let i = 0; i < dataList.length; i++) {
      showData(dataList[i]);
    }
    
    const exportedBuffer = await compiler.exportData();
    //document.getElementById("downloadButton").addEventListener("click", function() {
    download(exportedBuffer);
    //});
  }
  
  const loadMindFile = async (file) => {
    var reader = new FileReader();
    reader.onload = function() {
      const dataList = compiler.importData(this.result);
      //for (let i = 0; i < dataList.length; i++) {
      //  showData(dataList[i]);
      //}
    }
    reader.readAsArrayBuffer(file);
  }
  
  document.getElementById("startButton").addEventListener("click", function() {
    if (currentBlob == null) return;

    $("#fileDropArea").hide();
    $("#startButton").hide();
    $("#progressArea").show();
    $("#progress").text("어디가지마, 기다려!");        
    compileFiles([currentBlob]);    
    return false;
  });

  document.getElementById("startAgain").addEventListener("click", function(){
    setDefaultUIStatus();    

    return false;
  });

    
  function generateShortURL(url) {
    var accessToken = "2a727c7f1c3b380b1fb16f7fca6df5b2e3d2cfc4";
    var params = {
        "long_url" : url           
    };
    $.ajax({
        url: "https://api-ssl.bitly.com/v4/shorten",
        cache: false,
        dataType: "json",
        method: "POST",
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        },
        data: JSON.stringify(params)
    }).done(function(data) {
        $("#short_url_field").show();
        $("#short_url_link").text(data.link);
        $("#short_url_link").attr("href", data.link);
        $("#viewer_link_button").attr("href", data.link);
        $("#progress").text("처리가 다 되었다.");
        $("#viewer_button").show();
    }).fail(function(data) {
        console.log(data);
    });
  }

  