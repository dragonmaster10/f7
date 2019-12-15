// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event

$$(document).on('deviceready', function () {
    console.log("Device is ready!");
});




// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})




//app -- user's gps location
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//getting user's gps location
navigator.geolocation.getCurrentPosition(geoCallback, onError);
var lat;
var long;

function onError(error) {
    console.log(error);
};
function geoCallback(position) {
    console.log(position.coords.latitude);

    lat = position.coords.latitude;
    long = position.coords.longitude;
};

function getLocation() {
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
};



//taking user input 
function register() {
    var inputName = document.getElementById('inputName').value;
    var inputEmail = document.getElementById('inputEmail').value;
    var inputPassword = document.getElementById('txtNewPassword').value;

    var confirmPassword = document.getElementById('txtConfirmPassword').value;
    var text;

    //testing if passwords are a match
    if (inputPassword != confirmPassword) {
        text = "Passwords do not match";
        return;
    } else {
        text = "Passwords do not match";
    };
  
    var inputAge = document.getElementById('inputAge').value;

    // When a user clicks on a radio-button, it becomes checked, and all other radio-buttons with equal name become unchecked.
    var form = document.getElementById("smoker_selection");
    var inputSmoker = form.elements["selection"].value;

    var obj = new Object();
    obj.name = inputName;
    obj.password = inputPassword;
    obj.email = inputEmail;
    obj.smoker = inputSmoker;
    obj.age = inputAge;
    obj.latitude = lat;
    obj.longitude = long;

    //parsing json to send user's information to server
    var userDetails = JSON.stringify(obj);

    //API key of the server
    var url = "http://localhost:8082/registerUser";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    };
    //sending user details from registration to be saved into the server using a POST request
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(userDetails);
};

//taking user input for login credentials
function login() {
    var inputEmail = document.getElementById('inputEmail').value;
    var inputPassword = document.getElementById('inputtxtConfirmPassword').value;

    var obj = new Object();

    obj.name = inputEmail;
    obj.password = inputPassword;
    obj.latitude = lat;
    obj.longitude = long;

    //parsing json to send user's credentials to server
    var userCredentials = JSON.stringify(obj);

    //API key of the server
    var url = "http://localhost:8082/login/" + inputEmail + "/" + inputPassword;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Login response \n" + this.responseText);
            var data = JSON.parse(this.responseText);

            // Build HTML header 
            var col = [];
            for (var i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            };

            //create dynamic table
            var table = document.createElement("table");

            //create HTML table header row using the extracted headers above
            var tr = table.insertRow(-1);                   // table row

            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");      // table header
                th.innerHTML = col[i];
                tr.appendChild(th);
            };

            //add JSON data to the table as rows
            for (var i = 0; i < data.length; i++) {

                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = data[i][col[j]];
                }
            };

            //add the newly created table with JSON data to a container
            var divContainer = document.getElementById("showData");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        };
    };
    //sending a GET request to the server so it can bring back the information about the new roomates
    xhttp.open("GET", url, true);
    xhttp.send();
};

//checking if 'password' field mathches 'confirm password' field
function isPasswordMatch() {

    var password = document.getElementById('txtNewPassword').value;
    var confirmPassword = document.getElementById('txtConfirmPassword').value;
    if (password != confirmPassword) {
        alert("Passwords do not match");
    } else {
        alert("Passwords do match");
    }

    $(document).ready(function () {
        $("#txtConfirmPassword").keyup(isPasswordMatch);
    });
};

