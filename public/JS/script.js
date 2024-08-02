const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      // try rewriting the code with error part first.
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude }); //send the latitude and longitude to the frontend on send-location
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true, // we need accurate results to true.
      timeout: 5000, // get new position every 5 seconds
      maximumAge: 0, // do not catche the position
    }
  );
}
let map = L.map("map").setView([0, 0], 16); // 0,0 is center of the earth and 10 is the zoom

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Nilesh Shetty",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
