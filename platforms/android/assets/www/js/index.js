//function to initialize map with available parking spots
function initializeMap(currentLatitude,currentLongitude, data) {
  //only can press the claim button if you select a spot
    $('#claim').attr('disabled','disabled');
    var mapOptions = {
        center: new google.maps.LatLng(currentLatitude,currentLongitude),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //make map
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    setTimeout(function() {
            google.maps.event.trigger(map,'resize');
        }, 500);

    // Add the markers and infowindows to the map
    var infowindow = new google.maps.InfoWindow({
      content: "none"
    });
    //only can press the claim button if you select a spot
    google.maps.event.addListener(infowindow, 'closeclick', function() {
        $('#claim').attr('disabled','disabled');
    });

    //add markers for each spot
    var marker;
    var markers = new Array();
    for (var i = 0; i < data.length; i++) {  
        console.log(i);
        //make a new marker
      marker = new google.maps.Marker({
              position: new google.maps.LatLng(data[i]["lat"],data[i]["lon"]),
              map: map,
              title: data[i]["miles"]
          });
      //add marker to array
      markers.push(marker);
      //when marker is pressed an info window opens
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            $('#claim').removeAttr('disabled');
            var content = "<h5>"+data[i]["miles"]+" miles</h5>" +
            "<h5>Uploaded By: "+data[i]["uploader"]+"</h5>" +
            "<h5>Uploader's Rating: "+data[i]["reviews"]+"</h5>" +
            "<input type='radio' name='select' checked='checked' value='lat="+data[i]["lat"]+"&lon="+data[i]["lon"]+"' style='display:none;''>";
          infowindow.setContent(content);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
}

//function to initialize map that shows directions to a spot
function destMap(currentLatitude,currentLongitude,destLatitude,destLongitude) {
    var mapOptions = {
        center: new google.maps.LatLng(currentLatitude,currentLongitude),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //make map
    var map = new google.maps.Map(document.getElementById("dest_map_canvas"), mapOptions);
    setTimeout(function() {
            google.maps.event.trigger(map,'resize');
        }, 500);
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
      //start at current location
      var start = new google.maps.LatLng(currentLatitude,currentLongitude);
      //end at closest adderess to spot
      var end = new google.maps.LatLng(destLatitude,destLongitude);
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      //display route
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        }
      });
}

//function called when user wants to find a spot and the gps look up worked
var findSuccess = function(position) {
    //current location
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    //make the request to application server
    var req_val ="http://54.69.224.34:9090/find?username="+document.getElementById('username').value+"&lat="+currentLatitude+"&lon="+currentLongitude+"&dis="+document.getElementById('distance').value+"&size="+$('input[name="car"]:checked').val();
    $.get(req_val, function(data,status){
       //change the page
       $.mobile.changePage( "#mappage");
       //initialize the map
       initializeMap(currentLatitude,currentLongitude, data);
    });    
};

//function called when user wants to claim a spot and the gps look up worked
var claimSuccess = function(position) {
    //current location
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    //get desired spot's location
    var str =$('input[name="select"]:checked').val();
    var res = str.split("&");
    destLatitude = res[0].split("=")[1];
    destLongitude = res[1].split("=")[1];
    //make and show the map with directions to spot
    destMap(currentLatitude,currentLongitude,destLatitude,destLongitude);
    $.mobile.changePage("#destinationpage");
};

//function called when user wants to share a spot and the gps look up worked
var locSuccess = function(position) {
    //current location
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    //make request to application server
    $.get("http://54.69.224.34:9090/share?username="+document.getElementById('username').value+"&lat="+currentLatitude+"&lon="+currentLongitude+"&size="+$('input[name="size"]:checked').val(), function(data,status){
      
    });
    $.mobile.changePage("#completedpage");
};

//error callback function
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

//when user logins in
$(document).on("click", "#submitButton", function(evt) {
    //check if fields weren't empty
   if  (document.getElementById('username').value != "" && document.getElementById('password').value != "") {
    //make request to server
    $.get("http://54.69.224.34:9090/login?username="+document.getElementById('username').value+"&password="+document.getElementById('password').value, function(data,status){
          //if valid credentials
           if (String(data["cred"]) == "true") {
                //the user has no spot calimed
                if (data["spots"] > 0) {
                    $('#find').attr('disabled','disabled');
                }
                //user has a spot claimed that needs to be released
                else {
                    $('#release_main').attr('disabled','disabled');
                    
                    $('#release').attr('disabled','disabled');
                }
            $.mobile.changePage( "#pick");
            }
            //invalid credentials
            else {
                navigator.notification.alert("Try Again!");
            } 
    });
    }
    return false;
});

//when user registers
$(document).on("click", "#regButton", function(evt) {
   //if fields aren't empty
   if  (document.getElementById('regusername').value != "" && document.getElementById('regpassword').value != "" && document.getElementById('regemail').value != "") {
    //make request
    $.get("http://54.69.224.34:9090/register?username="+document.getElementById('regusername').value+"&password="+document.getElementById('regpassword').value+"&email="+document.getElementById('regemail').value, function(data,status){
           //if username is already in use
            if (String(data) == "username") {
                navigator.notification.alert("Username already in use!");
            }
            //if email address is already in use
            else if (String(data) == "email") {
                navigator.notification.alert("Email already in use!");
            }
            //if registration was successful
            else {
                navigator.notification.alert("Account Created! You may Login in now!");
                $.mobile.changePage( "#loginPage");
            }
      });
    }
    return false; 
});

//when user shares location
$(document).on("click", "#shareSubmitButton", function(evt) {
     //get current location and call appropriate function
     navigator.geolocation.getCurrentPosition(locSuccess, onError);
    return false;
});

//when user wants to find location
$(document).on("click", "#findSubmitButton", function(evt) {
    //if fields aren't blank
    if (document.getElementById('distance').value != "") {
      //get current location adn call appropriate function
     navigator.geolocation.getCurrentPosition(findSuccess, onError);
    }
    return false;
});

//when user selects the find option
$( "#find" ).click(function() {
    $.mobile.changePage( "#findpage");
});

//when user selects to register
$( "#regSelButton" ).click(function() {
 $.mobile.changePage( "#registerPage");
    
});

//when user selects the share option
$( "#share" ).click(function() {
 $.mobile.changePage( "#sharepage");
    
});

//when user claims a spot
$( "#claim" ).click(function() {
    //make request to applciations erver
    $.get("http://54.69.224.34:9090/claim?username="+document.getElementById('username').value+"&size="+$('input[name="car"]:checked').val()+"&"+$('input[name="select"]:checked').val(), function(data,status){
           console.log(data);
           //if spot was taken by someone else
           if (String(data) == "spot taken") {
            navigator.notification.alert("Spot Has Been Taken By Someone Else!");
            //refresh the page
            navigator.geolocation.getCurrentPosition(findSuccess, onError);
            }
            //if user needs to release a spot they have themselves
            else if (String(data) == "need to release") {
                console.log(data);
                navigator.notification.alert("You Need To Release Your Spot First!");
                $('#find').attr('disabled','disabled');
                $('#release').removeAttr('disabled');
                $('#release_main').removeAttr('disabled');
                $.mobile.changePage( "#pick");
            }
            //success
            else {
                //get location show directions
                navigator.geolocation.getCurrentPosition(claimSuccess, onError);
                $('#find').attr('disabled','disabled');
                $('#release').removeAttr('disabled');
                $('#release_main').removeAttr('disabled');
            }
    });
  return false;
});

//when user selects to referesh the map with available locations
$( "#refresh" ).click(function() {
    //get lcoation and call appropriate function
    navigator.geolocation.getCurrentPosition(findSuccess, onError);
});

//when user decides to release a spot
$( "#release" ).click(function() {
    //show them review screen
    $.mobile.changePage( "#reviewpage");
});

//when user selects to release a spot from main screen
$( "#release_main" ).click(function() {
    $.mobile.changePage( "#reviewpage");
});

//when user submits the review to release spot
$(document).on("click", "#reviewSubmitButton", function(evt) {
    //make request
    var loc ="http://54.69.224.34:9090/release?username="+document.getElementById('username').value+"&review="+$('input[name="rating"]:checked').val();
     $.get(loc, function(data,status){
    });  
     $('#release').attr('disabled','disabled');
     $('#release_main').attr('disabled','disabled');
     $('#find').removeAttr('disabled');
    $.mobile.changePage("#completedpage");
    return false;
});
