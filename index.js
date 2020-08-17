var map,
  markers = [],
  owerri = { lat: 5.384522, lng: 6.994986 };
var infoWindow;

let dark = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

let threeDStyle = [
  {
    featureType: "administrative",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];
let mapOptions = {
  panControl: true,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  overviewMapControl: true,
  rotateControl: true,
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: owerri,
    zoom: 15,
    styles: null,
    ...mapOptions,
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
    info = hall.info;
    hallhtml += `
    <div class="hall">
        
        <div class="hall-info-container">
          <div class="hall-address">
           <span>${name}</span>            
          </div>
          <div class="hall-phone-number">
            <p>${info}</p>
          
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
      info = hall.info;
    imgUrl = hall.imgUrl;

    address = hall.addressLines[0];
    status = hall.openStatusText;
    phone = hall.phoneNumber;

    // console.log(latlng)
    createMarker(latlng, name, info, imgUrl, index);
    bounds.extend(latlng);
  });
  map.fitBounds(bounds, 0);
}

function searchhalls() {
  console.log("search starting");
  let foundhalls = [];
  const queryString = document.getElementById("zip-code-input").value;
  if (queryString) {
    halls.forEach(function (hall, index) {
      const hallName = hall.name;
      console.log(hallName, queryString);
      if (hallName.toLowerCase().indexOf(queryString) !== -1) {
        foundhalls.push(hall);
        console.log("found one");
      }
      console.log(foundhalls);
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

function createMarker(latlng, name, info, imgUrl, index) {
  let mode = document.querySelector(".mode");
  var html =
    mode.textContent === "Dark Mode "
      ? `
    <div class="info-window dark">
      <div class="info-name">
        ${name}
      </div>
      <div class="info-img">
        <img height=80px src=${imgUrl}>
      </div>
      <div class="info-phone">
      <div class="circle1">
        <i class="fas fa-info-circle fast"></i>
      </div>
       ${info}
      </div>
    </div>
  `
      : `
  <div class="info-window ">
    <div class="info-name">
      ${name}
    </div>
    <div class="info-img">
      <img height=80px src=${imgUrl}>
    </div>
    <div class="info-phone">
    <div class="circle1">
      <i class="fas fa-info-circle fast"></i>
    </div>
     ${info}
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

let mode = document.querySelector(".mode");
mode.addEventListener("click", (event) => {
  if (mode.textContent === "Dark Mode ") {
    toggleDarkModeStyles();
    searchhalls();
    map.setOptions({ styles: dark });
    mode.innerHTML = `Light Mode <i class="fas fa-sun"></i>`;
  } else {
    toggleDarkModeStyles();
    searchhalls();
    map.setOptions({ styles: null });
    mode.innerHTML = `Dark Mode <i class="fas fa-adjust"></i>`;
  }
});

const toggleDarkModeStyles = () => {
  const footer = document.querySelector(".footer");
  const title = document.querySelector(".title");
  const hallListContainer = document.querySelector(".hall-list-container");

  if (mode.textContent === "Dark Mode ") {
    footer.style.color = "white";
    title.style.color = "whitesmoke";
    hallListContainer.classList.add("hall-list-dark");
  } else {
    footer.style.color = "black";
    title.style.color = "black";
    hallListContainer.classList.remove("hall-list-dark");
  }
};
