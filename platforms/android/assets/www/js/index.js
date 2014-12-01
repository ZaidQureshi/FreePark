function initializeMap(currentLatitude,currentLongitude, data) {
    $('#claim').attr('disabled','disabled');
    var mapOptions = {
        center: new google.maps.LatLng(currentLatitude,currentLongitude),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    setTimeout(function() {

            google.maps.event.trigger(map,'resize');
        }, 500);
    var infowindow = new google.maps.InfoWindow({
      content: "none"
    });
    google.maps.event.addListener(infowindow, 'closeclick', function() {
        $('#claim').attr('disabled','disabled');
    });
    var marker;
    var markers = new Array();
    
    // Add the markers and infowindows to the map
    for (var i = 0; i < data.length; i++) {  
        console.log(i);
      marker = new google.maps.Marker({
              position: new google.maps.LatLng(data[i]["lat"],data[i]["lon"]),
              map: map,
              title: data[i]["miles"]
          });

      markers.push(marker);

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

function destMap(currentLatitude,currentLongitude,destLatitude,destLongitude) {
    var mapOptions = {
        center: new google.maps.LatLng(currentLatitude,currentLongitude),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("dest_map_canvas"), mapOptions);
    setTimeout(function() {

            google.maps.event.trigger(map,'resize');
        }, 500);
    // var infowindow = new google.maps.InfoWindow({
    //       content: "none"
    //   });
    // var curMark = new google.maps.Marker({
    //           position: new google.maps.LatLng(currentLatitude,currentLongitude),
    //           map: map,
    //           title: "You"
    //       });
    // var destMark = new google.maps.Marker({
    //           position: new google.maps.LatLng(destLatitude,destLongitude),
    //           map: map,
    //           title: "Spot"
    //       });
    // google.maps.event.addListener(curMark, 'click', function() {
    //     infowindow.setContent("You");
    //     infowindow.open(map,curMark);
    //   });
    // google.maps.event.addListener(destMark, 'click', function() {
    //     infowindow.setContent("Spot");
    //     infowindow.open(map,destMark);
    //   });
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    
      directionsDisplay = new google.maps.DirectionsRenderer();
      
      directionsDisplay.setMap(map);
        
      var start = new google.maps.LatLng(currentLatitude,currentLongitude);
      var end = new google.maps.LatLng(destLatitude,destLongitude);
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        }
      });


}
var findSuccess = function(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    var req_val ="http://54.69.224.34:9090/find?username="+document.getElementById('username').value+"&lat="+currentLatitude+"&lon="+currentLongitude+"&dis="+document.getElementById('distance').value+"&size="+$('input[name="car"]:checked').val();
    //alert(req_val);
    $.get(req_val, function(data,status){
        //alert(data.length);
         $.mobile.changePage( "#mappage");
       initializeMap(currentLatitude,currentLongitude, data);
       // function initializeMap() {
       //      var mapOptions = {
       //          center: new google.maps.LatLng(43.069452, -89.411373),
       //          zoom: 11,
       //          mapTypeId: google.maps.MapTypeId.ROADMAP
       //      };
       //      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
       //      google.maps.event.addDomListener(window, 'load', initialize);
       //      var marker = new google.maps.Marker({
       //          position: new google.maps.LatLng(43.069452, -89.411373),
       //          map: map,
       //          title: "This is a marker!",
       //          animation: google.maps.Animation.DROP
       //      });
       //  }
       // for (var i =0;i < data.length; i++) {
       //  alert(data[i]["miles"]);
       // }
       // new GMaps({
       //    div: '#map',
       //    lat: -12.043333,
       //    lng: -77.028333
       //  });
        
        //$.mobile.changePage("#pagetwo");
        //navigator.notification.alert(data);
        //document.getElementById("dead").innerHTML = data;
    });
    // alert('Latitude: '          + position.coords.latitude          + '\n' +
    //       'Longitude: '         + position.coords.longitude         + '\n' +
    //       'Altitude: '          + position.coords.altitude          + '\n' +
    //       'Accuracy: '          + position.coords.accuracy          + '\n' +
    //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //       'Heading: '           + position.coords.heading           + '\n' +
    //       'Speed: '             + position.coords.speed             + '\n' +
    //       'Timestamp: '         + position.timestamp                + '\n');
};

var claimSuccess = function(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    var str =$('input[name="select"]:checked').val();
    var res = str.split("&");
    //alert(res);
    destLatitude = res[0].split("=")[1];
    destLongitude = res[1].split("=")[1];
    //alert(destLatitude+","+destLongitude);
    destMap(currentLatitude,currentLongitude,destLatitude,destLongitude);
    $.mobile.changePage("#destinationpage");
    // $.mobile.navigate( "#completedpage", { transition : "slide", info: "info about the #bar hash" });
    // alert('Latitude: '          + position.coords.latitude          + '\n' +
    //       'Longitude: '         + position.coords.longitude         + '\n' +
    //       'Altitude: '          + position.coords.altitude          + '\n' +
    //       'Accuracy: '          + position.coords.accuracy          + '\n' +
    //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //       'Heading: '           + position.coords.heading           + '\n' +
    //       'Speed: '             + position.coords.speed             + '\n' +
    //       'Timestamp: '         + position.timestamp                + '\n');
};


var locSuccess = function(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;

    $.get("http://54.69.224.34:9090/share?username="+document.getElementById('username').value+"&lat="+currentLatitude+"&lon="+currentLongitude+"&size="+$('input[name="size"]:checked').val(), function(data,status){
        //alert(data);
       
        //$.mobile.changePage("#pick");
        
        //document.getElementById("dead").innerHTML = data;
    });
    $.mobile.changePage("#completedpage");
    // $.mobile.navigate( "#completedpage", { transition : "slide", info: "info about the #bar hash" });
    // alert('Latitude: '          + position.coords.latitude          + '\n' +
    //       'Longitude: '         + position.coords.longitude         + '\n' +
    //       'Altitude: '          + position.coords.altitude          + '\n' +
    //       'Accuracy: '          + position.coords.accuracy          + '\n' +
    //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //       'Heading: '           + position.coords.heading           + '\n' +
    //       'Speed: '             + position.coords.speed             + '\n' +
    //       'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
// $("#submitButton").on("click",function(e) {
$(document).on("click", "#submitButton", function(evt) {
   if  (document.getElementById('username').value != "" && document.getElementById('password').value != "") {
// $("#loginForm").on("submit",function(e) {
    // alert("suuccess");
    //$.mobile.navigate( "#pagetwo", { transition : "slide", info: "info about the #bar hash" });
    $.get("http://54.69.224.34:9090/login?username="+document.getElementById('username').value+"&password="+document.getElementById('password').value, function(data,status){
           //navigator.geolocation.getCurrentPosition(onSuccess, onError);
           //alert(data["cred"]);
           if (String(data["cred"]) == "true") {
                if (data["spots"] > 0) {
                    $('#find').attr('disabled','disabled');
                    //$('#release_main').attr('disabled','enabled');
                }
                else {
                    $('#release_main').attr('disabled','disabled');
                    
                    $('#release').attr('disabled','disabled');
                    //$('#find').attr('disabled','enabled');
                }
            $.mobile.changePage( "#pick");
            }
            else {
                navigator.notification.alert("Try Again!");
            }
        
    });
    }
    return false;
    
});

$(document).on("click", "#regButton", function(evt) {
   if  (document.getElementById('regusername').value != "" && document.getElementById('regpassword').value != "" && document.getElementById('regemail').value != "") {
// $("#loginForm").on("submit",function(e) {
    // alert("suuccess");
    //$.mobile.navigate( "#pagetwo", { transition : "slide", info: "info about the #bar hash" });
    $.get("http://54.69.224.34:9090/register?username="+document.getElementById('regusername').value+"&password="+document.getElementById('regpassword').value+"&email="+document.getElementById('regemail').value, function(data,status){
           //navigator.geolocation.getCurrentPosition(onSuccess, onError);
           //alert(data["cred"]);
           if (String(data) == "username") {
                navigator.notification.alert("Username already in use!");
            
            }
            else if (String(data) == "email") {
                navigator.notification.alert("Email already in use!");
            }
            else {
                navigator.notification.alert("Account Created! You may Login in now!");
                $.mobile.changePage( "#loginPage");
            }
        
    });
    }
    return false;
    
});

$(document).on("click", "#shareSubmitButton", function(evt) {
// $("#loginForm").on("submit",function(e) {
    // alert("suuccess");
    
     navigator.geolocation.getCurrentPosition(locSuccess, onError);
        
    
    return false;
});

$(document).on("click", "#findSubmitButton", function(evt) {
// $("#loginForm").on("submit",function(e) {
    // alert("suuccess");
    if (document.getElementById('distance').value != "") {
     navigator.geolocation.getCurrentPosition(findSuccess, onError);
    }
        
    
    return false;
});
$( "#find" ).click(function() {
    $.mobile.changePage( "#findpage");
    
  // navigator.notification.alert("Find");
});

$( "#regSelButton" ).click(function() {
 $.mobile.changePage( "#registerPage");
        //$.mobile.changePage("#pagetwo");
        //navigator.notification.alert(data);
        //document.getElementById("dead").innerHTML = data;
    
});
$( "#share" ).click(function() {
 $.mobile.changePage( "#sharepage");
        //$.mobile.changePage("#pagetwo");
        //navigator.notification.alert(data);
        //document.getElementById("dead").innerHTML = data;
    
});

$( "#claim" ).click(function() {
    //alert($('input[name="select"]:checked').val());
    //$.mobile.changePage( "#findpage");
    $.get("http://54.69.224.34:9090/claim?username="+document.getElementById('username').value+"&size="+$('input[name="car"]:checked').val()+"&"+$('input[name="select"]:checked').val(), function(data,status){
           //navigator.geolocation.getCurrentPosition(onSuccess, onError);
           console.log(data);
           if (String(data) == "spot taken") {
            navigator.notification.alert("Spot Has Been Taken By Someone Else!");
            navigator.geolocation.getCurrentPosition(findSuccess, onError);
            }
            else if (String(data) == "need to release") {
                console.log(data);
                navigator.notification.alert("You Need To Release Your Spot First!");
                $('#find').attr('disabled','disabled');
                $('#release').removeAttr('disabled');
                $('#release_main').removeAttr('disabled');
                $.mobile.changePage( "#pick");
            }
            else {
                navigator.geolocation.getCurrentPosition(claimSuccess, onError);
                $('#find').attr('disabled','disabled');
                $('#release').removeAttr('disabled');
                $('#release_main').removeAttr('disabled');
            }
        
    });
    //navigator.geolocation.getCurrentPosition(claimSuccess, onError);
  // navigator.notification.alert("Find");
  return false;
});


$( "#refresh" ).click(function() {
    navigator.geolocation.getCurrentPosition(findSuccess, onError);
    //$.mobile.changePage( "#findpage");
    
  // navigator.notification.alert("Find");
});
$( "#release" ).click(function() {
    $.mobile.changePage( "#reviewpage");
});
$( "#release_main" ).click(function() {
    $.mobile.changePage( "#reviewpage");
});
$(document).on("click", "#reviewSubmitButton", function(evt) {
// $("#loginForm").on("submit",function(e) {

    var loc ="http://54.69.224.34:9090/release?username="+document.getElementById('username').value+"&review="+$('input[name="rating"]:checked').val();
    //alert(loc);
     $.get(loc, function(data,status){
        //alert(data);
       
        //$.mobile.changePage("#pick");
        
        //document.getElementById("dead").innerHTML = data;
    });  
     $('#release').attr('disabled','disabled');
     $('#release_main').attr('disabled','disabled');
     $('#find').removeAttr('disabled');
    $.mobile.changePage("#completedpage");
    return false;
});
