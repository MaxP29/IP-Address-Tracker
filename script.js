// Elements
const search = document.querySelector(`.search`);
const button = document.querySelector(`.search-button`);
const IPA = document.querySelector(`.IPA`);
const Location = document.querySelector(`.LOCATION`);
const timezone = document.querySelector(`.TMZ`);
const ISPV = document.querySelector(`.ISPV`);

// Map Icon
const myIcon = L.icon({
  iconUrl: "/images/icon-location.svg",
  iconSize: [46, 56],
});

// Functions
const updateValue = function (data) {
  Location.textContent = `${data.location.localityName}, ${data.location.principalSubdivision}`;
  timezone.textContent = data.location.timeZone.displayName.split(` `)[0];
  ISPV.textContent = data.network.carriers[0].organisation;
  IPA.textContent = data.ip;
};

const generateMap = function (map) {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
};

const generateIcon = function (map, coords, myIcon) {
  L.marker(coords, { icon: myIcon }).addTo(map);
};

// Fetch Requests & Event Listener

fetch(
  `https://api.bigdatacloud.net/data/ip-geolocation?localityLanguage=en&key=bdc_64b55ab820604619a4ef332d798df262`
)
  .then((response) => response.json())
  .then((data) => {
    // Collects Data
    const latitude = data.location.latitude;
    const longitude = data.location.longitude;
    let coords = [latitude, longitude];

    let map = L.map("map", { zoomControl: false }).setView(coords, 17);

    // Updates UI
    updateValue(data);
    generateMap(map);
    generateIcon(map, coords, myIcon);

    // Event Listener Upon Search
    button.addEventListener(`click`, function () {
      const request = search.value;

      if (request === "" || !request.includes(`.`))
        throw new Error(`Invalid Format, try again!`);

      fetch(
        `https://api-bdc.net/data/ip-geolocation?ip=${request}&localityLanguage=en&key=bdc_64b55ab820604619a4ef332d798df262`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (!data.isReachableGlobally)
            throw new Error(`That Ip Address Doesn't Exist, please try again!`);

          updateValue(data);

          const latitude = data.location.latitude;
          const longitude = data.location.longitude;

          let coords = [latitude, longitude];

          // Deleting Old Map
          map.remove();

          // Set Map to Map Id - Html
          map = L.map("map", { zoomControl: false }).setView(coords, 17);

          // Creates new Map
          generateMap(map);
          generateIcon(map, coords, myIcon);
        })
        .catch((error) => console.error(error));
    });
  });
