//allows take-photo.html to take photo  this is from https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos

(function () {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 800; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                alert("ERROR");
                console.log("An error occurred: " + err);
            });

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function (ev) {
            takepicture();
            ev.preventDefault();
        }, false);

        clearphoto();
    }

    // Fill the photo with an indication that none has been
    // captured.

    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
        } else {
            clearphoto();
        }
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();

//now i need to figure out how to display the picture taken alone, and then impose tabs over it, tabs linked to particular apis


//**************** */ zach's code
// < !DOCTYPE html >
//     <
//     ? xml version = "1.0"
// encoding = "UTF-8" ? >
//     <
//     CORSConfiguration xmlns = "http://s3.amazonaws.com/doc/2006-03-01/" >
//     <
//     CORSRule >
//     <
//     AllowedOrigin > * < /AllowedOrigin> <
//     AllowedMethod > POST < /AllowedMethod> <
//     AllowedMethod > GET < /AllowedMethod> <
//     AllowedMethod > PUT < /AllowedMethod> <
//     AllowedMethod > DELETE < /AllowedMethod> <
//     AllowedMethod > HEAD < /AllowedMethod> <
//     AllowedHeader > * < /AllowedHeader> <
//     /CORSRule> <
//     /CORSConfiguration>


//     <
//     html >
//     <
//     head >
//     <
//     meta charset = "UTF-8" >
//     <
//     title > AWS SDK
// for JavaScript - Browser Getting Started Application < /title> <
//     /head>

//     <
//     body >
//     <
//     div class = "camera" >
//     <
//     video id = "video" > Video stream not available. < /video> <
//     button id = "startbutton" > Take photo < /button>  <
//     /div> <
//     canvas id = "canvas" >
//     <
//     /canvas>


//     <
//     script src = "https://sdk.amazonaws.com/js/aws-sdk-2.449.0.min.js" > < /script> <
//     !--(script elements go here) -- >

//     <
//     script >

//     // Initialize the Amazon Cognito credentials provider
//     AWS.config.region = 'us-east-1'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:61173ba7-924f-4405-a319-6647a7c13c62',
// });

// var recognition = new AWS.Rekognition();

// (function () {

//     var width = 320; // We will scale the photo width to this
//     var height = 0; // This will be computed based on the input stream
//     var streaming = false;

//     var video = null;
//     var canvas = null;
//     var photo = null;
//     var startbutton = null;

//     function startup() {
//         video = document.getElementById('video');
//         canvas = document.getElementById('canvas');
//         startbutton = document.getElementById('startbutton');

//         navigator.mediaDevices.getUserMedia({
//                 video: true,
//                 audio: false
//             })
//             .then(function (stream) {
//                 video.srcObject = stream;
//                 video.play();
//             })
//             .catch(function (err) {
//                 console.log("An error occurred: " + err);
//             });

//         video.addEventListener('canplay', function (ev) {
//             if (!streaming) {
//                 height = video.videoHeight / (video.videoWidth / width);

//                 // Firefox currently has a bug where the height can't be read from
//                 // the video, so we will make assumptions if this happens.

//                 if (isNaN(height)) {
//                     height = width / (4 / 3);
//                 }

//                 video.setAttribute('width', width);
//                 video.setAttribute('height', height);
//                 canvas.setAttribute('width', width);
//                 canvas.setAttribute('height', height);
//                 streaming = true;
//             }
//         }, false);

//         startbutton.addEventListener('click', function (ev) {
//             takepicture();
//             ev.preventDefault();
//         }, false);

//         clearphoto();
//     }

//     // Fill the photo with an indication that none has been
//     // captured.

//     function clearphoto() {
//         var context = canvas.getContext('2d');
//         context.fillStyle = "#AAA";
//         context.fillRect(0, 0, canvas.width, canvas.height);

//         var data = canvas.toDataURL('image/png');
//     }

//     // Capture a photo by fetching the current contents of the video
//     // and drawing it into a canvas, then converting that to a PNG
//     // format data URL. By drawing it on an offscreen canvas and then
//     // drawing that to the screen, we can change its size and/or apply
//     // other changes before drawing it.

//     function takepicture() {
//         var context = canvas.getContext('2d');
//         if (width && height) {
//             canvas.width = width;
//             canvas.height = height;
//             context.drawImage(video, 0, 0, width, height);


//             //Prepare the input parameters
//             var params = {
//                 Image: {
//                     Bytes: getBinary(canvas.toDataURL())
//                 },
//                 MinConfidence: 50 //only allow a minimum confidence of 80% for any label
//             };

//             //Call the service
//             recognition.detectLabels(params, function (error, response) {
//                 if (error) console.log(error, error.stack); // an error occurred
//                 else {
//                     var labels = response.Labels;
//                     console.log(labels);

//                     if (labels[0].Name == "Pen") {
//                         alert("it's a Sharpie!")
//                     }
//                     fetch('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=' + labels[0].Name)
//                         .then(function (response) {
//                             return response.json();
//                         })
//                         .then(function (myJson) {
//                             console.log(JSON.stringify(myJson));
//                         });
//                 }
//             });

//         } else {
//             clearphoto();
//         }
//     }

//     // Set up our event listener to run the startup process
//     // once loading is complete.
//     window.addEventListener('load', startup, false);
// })();


// function dataURItoBlob(dataURI) {
//     // convert base64/URLEncoded data component to raw binary data held in a string
//     var byteString;
//     if (dataURI.split(',')[0].indexOf('base64') >= 0)
//         byteString = atob(dataURI.split(',')[1]);
//     else
//         byteString = unescape(dataURI.split(',')[1]);

//     // separate out the mime component
//     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

//     // write the bytes of the string to a typed array
//     var ia = new Uint8Array(byteString.length);
//     for (var i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//     }

//     return new Blob([ia], {
//         type: mimeString
//     });
// }

// function getBinary(encodedFile) {
//     var base64Image = encodedFile.split("data:image/png;base64,")[1];
//     var binaryImg = atob(base64Image);
//     var length = binaryImg.length;
//     var ab = new ArrayBuffer(length);
//     var ua = new Uint8Array(ab);
//     for (var i = 0; i < length; i++) {
//         ua[i] = binaryImg.charCodeAt(i);
//     }

//     var blob = new Blob([ab], {
//         type: "image/jpeg"
//     });

//     return ab;
// }

// <
// /script> <
// /body> <
// /html> </script></script>
