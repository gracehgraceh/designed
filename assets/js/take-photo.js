// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:61173ba7-924f-4405-a319-6647a7c13c62',
});

var recognition = new AWS.Rekognition();

(function () {

    var width = 800; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream
    var streaming = false;

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        // startbutton = document.getElementById('startbutton');

        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
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

        video.addEventListener('click', function (ev) {
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


            //Prepare the input parameters
            var params = {
                Image: {
                    Bytes: getBinary(canvas.toDataURL())
                },
                MinConfidence: 90 //only allow a minimum confidence of 80% for any label
            };

            //Call the service
            recognition.detectLabels(params, function (error, response) {
                if (error) console.log(error, error.stack); // an error occurred
                else {
                    console.log(response);
                    var labels = response.Labels;
                    console.log(labels);

                    // if (labels[0].Name == "Pen") {
                    //     alert("it's a Sharpie!")
                    // }

                    var cameraElement = document.querySelector(".camera");

                    cameraElement.style.display = "none";

                    var pictureWrapperElement = document.querySelector(".picture-wrapper");

                    pictureWrapperElement.style.display = "block";


                    // DICTIONARY

                    var word = labels[0].Name.toLowerCase();;

                    const app_id = "c2d91c0d";
                    const app_key = "acefba79c7d0f69da58b3014b000237a"
                    const language = "en"

                    // Documentation https://developer.oxforddictionaries.com/documentation

                    // The beginning of all API calls
                    const BASEURL = "https://od-api.oxforddictionaries.com:443/api/v2/entries/en-us/";

                    // Options. Limit the returned results to just the 'definition'.
                    const URL_OPTIONS = "fields=definitions&strictMatch=false";

                    // This allows us to get around the CORS issue.
                    const PROXY = "https://cors-anywhere.herokuapp.com/";

                    // Combine the PROXY, BASEURL, word (lowercased), and URL_OPTIONS into the URL
                    var URL = `${PROXY}${BASEURL}${word.toLowerCase()}?${URL_OPTIONS}`;


                    // Call the API
                    fetch(URL, {
                            headers: {
                                "app_id": app_id,
                                "app_key": app_key,
                                "Accept": "application/json"
                            },
                        })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            var results = data.results[0];
                            // console.log(results);

                            // Example: First definition
                            var firstDefinition = results.lexicalEntries[0].entries[0].senses[0].definitions[0];


                            console.log(firstDefinition);

                            var dictionaryTitle = document.querySelector(".dictionary-wrapper .title");
                            var dictionaryBody = document.querySelector(".dictionary-wrapper .body");

                            dictionaryTitle.innerText = word;
                            dictionaryBody.innerText = firstDefinition;

                            // var tab1 = document.querySelector(".tab1red");
                            // tab1.style.display = "block";
                        });


                    // var URL = "https://od-api.oxforddictionaries.com/api/v2/entries/EN-US/" + labels[0].Name.toLowerCase();

                    // const APPID = "c2d91c0d";
                    // const APPKEY = "acefba79c7d0f69da58b3014b000237a";



                    // fetch(URL, {
                    //         headers: {
                    //             "app-id": APPID,
                    //             "app-key": APPKEY,
                    //         }
                    //     })
                    //     .then(function (response) {
                    //         return response.json();
                    //     })
                    //     .then(function (data) {
                    //         var pages = data.query.pages;
                    //         var page = pages[Object.keys(pages)[0]];

                    //         var title = page.title;
                    //         var body = page.extract;



                    //         var dictionaryTitle = document.querySelector(".dictionary-wrapper .title");
                    //         var dictionaryBody = document.querySelector(".dictionary-wrapper .body");

                    //         dictionaryTitle.innerText = title;
                    //         dictionaryBody.innerText = body;

                    //         var tab1 = document.querySelector(".tab1red");
                    //         tab1.style.display = "block";

                    //     })

                    // WIKIPEDIA
                    var URL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&&origin=*&titles=' + labels[0].Name;

                    fetch(URL)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            var pages = data.query.pages;
                            var page = pages[Object.keys(pages)[0]];

                            var title = page.title;
                            var body = page.extract;


                            var wikipediaTitle = document.querySelector(".wikipedia-wrapper .title");
                            var wikipediaBody = document.querySelector(".wikipedia-wrapper .body");
                            wikipediaTitle.innerText = title;
                            wikipediaBody.innerText = body;


                            var tab2 = document.querySelector(".tab2orange");
                            tab2.style.display = "block";

                            var CameraIcon = document.querySelector(".icon2");
                            CameraIcon.style.display = "block";

                        })





                    // STEELCASE INFORMATION


                    var URL = "assets/json/steelcase.json";

                    fetch(URL)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            var pages = data.query.pages;
                            var page = pages[Object.keys(pages)[0]];

                            var title = page.title;
                            var body = page.extract;



                            var Title = document.querySelector(".title");
                            var Body = document.querySelector(".body");

                            Title.innerText = title;
                            Body.innerText = body;

                            var tab3 = document.querySelector(".tab3blue");
                            tab1.style.display = "block";;

                        })


                }
            });

        } else {
            clearphoto();
        }
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString
    });
}

function getBinary(encodedFile) {
    var base64Image = encodedFile.split("data:image/png;base64,")[1];
    var binaryImg = atob(base64Image);
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
        ua[i] = binaryImg.charCodeAt(i);
    }

    var blob = new Blob([ab], {
        type: "image/jpeg"
    });

    return ab;
}


//  Tab switch code
var trigger_dictionary = document.querySelector(".trigger-dictionary");
var trigger_wikipedia = document.querySelector(".trigger-wikipedia");
var trigger_add = document.querySelector(".trigger-add");

var tab_dictionary = document.querySelector(".tab1red");
var tab_wikipedia = document.querySelector(".tab2orange");


trigger_dictionary.addEventListener("click", function () {
    tab_dictionary.style.display = "block";
    tab_wikipedia.style.display = "none";
    // alert("DICTIONARY CLICKED");
});

trigger_wikipedia.addEventListener("click", function () {
    tab_wikipedia.style.display = "block";
    tab_dictionary.style.display = "none";
    // alert("WIKI CLICKED");
});
