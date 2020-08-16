var map,
  markers = [],
  owerri = { lat: 5.386226, lng: 6.995472 };
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: owerri,
    zoom: 10,
  });

  var marker = new google.maps.Marker({
    position: owerri,
    map: map,
    title: "FUTO",
  });
  infoWindow = new google.maps.InfoWindow();
  searchhalls();
}

function displayhalls(halls) {
  hallhtml = "";

  halls.forEach(function (hall, index) {
    // console.log(hall)
    phone = hall.phoneNumber;
    address = hall.addressLines;
    name = hall.name;
    hallhtml += `
    <div class="hall">
        
        <div class="hall-info-container">
          <div class="hall-address">
            <p><span>${name}</span>
             
            
          </div>
          <div class="hall-phone-number">
            <p>${phone}</p>
          
          </div>
        </div>
        <div class='hall-num'>
          <div class="circle">${index + 1}</div>
        </div>
        
      </div>
    `;
    document.querySelector(".hall-list").innerHTML = hallhtml;
  });
}

function showhallsMArkers(halls) {
  var bounds = new google.maps.LatLngBounds();
  halls.forEach(function (hall, index) {
    var latlng = new google.maps.LatLng(
        hall.coordinates.latitude,
        hall.coordinates.longitude
      ),
      name = hall.name,
      address = hall.addressLines[0];

    status = hall.openStatusText;
    phone = hall.phoneNumber;

    // console.log(latlng)
    createMarker(latlng, name, address, index);
    bounds.extend(latlng);
  });
  map.fitBounds(bounds);
}

function searchhalls() {
  foundhalls = [];
  var zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    halls.forEach(function (hall, index) {
      post_code = hall.address.postalCode.substring(0, 5);
      if (post_code == zipCode) {
        foundhalls.push(hall);
      }
    });
  } else {
    foundhalls = halls;
  }

  clearLocations();
  displayhalls(foundhalls);
  showhallsMArkers(foundhalls);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  var hallElements = document.querySelectorAll(".hall");
  console.log(hallElements);
  hallElements.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function createMarker(latlng, name, address, index) {
  var html = `
    <div class="info-window">
      <div class="info-name">
        ${name}
      </div>
      <div class="info-status">
       ${status}
      </div>
      <div class="info-address">
      <div class="circle1">
        <i class="fas fa-location-arrow fast"></i>
      </div>
      ${address}
      </div>
      <div class="info-phone">
      <div class="circle1">
        <i class="fas fa-phone-volume fast"></i>
      </div>
       ${phone}
      </div>
    </div>
  `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: ` ${index + 1}`,
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
