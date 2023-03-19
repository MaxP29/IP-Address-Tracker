// Elements
const search = document.querySelector(`.search`);
const button = document.querySelector(`.search-button`);
const IPA = document.querySelector(`.IPA`);
const Location = document.querySelector(`.LOCATION`);
const timezone = document.querySelector(`.TMZ`);
const ISPV = document.querySelector(`.ISPV`);

fetch(
  `https://api.bigdatacloud.net/data/ip-geolocation?localityLanguage=en&key=bdc_64b55ab820604619a4ef332d798df262`
)
  .then((response) => response.json())
  .then((data) => {
    // Adjusting The Values Based Off Current User Location
    Location.textContent = `${data.location.localityName}, ${data.location.principalSubdivision}`;
    timezone.textContent = data.location.timeZone.displayName.split(` `)[0];
    ISPV.textContent = data.network.carriers[0].organisation;
    IPA.textContent = data.ip;

    const latitude = data.location.latitude;
    const longitude = data.location.longitude;

    let coords = [latitude, longitude];

    // Sets Map With Current Coordinates & Remove Zoom Control Buttons
    let map = L.map("map", { zoomControl: false }).setView(coords, 17);

    const myIcon = L.icon({
      iconUrl: "/images/icon-location.svg",
      iconSize: [46, 56],
    });

    // Creates Map
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Adds Marker to Map Location
    L.marker(coords, { icon: myIcon }).addTo(map);

    // Event Listener Upon Search
    button.addEventListener(`click`, function (e) {
      e.preventDefault();
      const request = search.value;

      if (!request == "") {
        fetch(
          `https://api-bdc.net/data/ip-geolocation?ip=${request}&localityLanguage=en&key=bdc_64b55ab820604619a4ef332d798df262`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            // Adjusting The Values Based Off Current User Location
            Location.textContent = `${data.location.localityName}, ${data.location.principalSubdivision}`;
            timezone.textContent =
              data.location.timeZone.displayName.split(` `)[0];
            ISPV.textContent = data.network.carriers[0].organisation;
            IPA.textContent = data.ip;

            const latitude = data.location.latitude;
            const longitude = data.location.longitude;

            let coords = [latitude, longitude];

            // Deleting Old Map and Loading New Map Location
            map.remove();
            map = L.map("map").setView(coords, 17);

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            // Adds Marker to Map Location
            L.marker(coords, { icon: myIcon }).addTo(map);
          });
      } else {
        return;
      }
    });
  });

// REMINDER - ADD Error Message If Request isn't correct - Fix Spacing and Text Alignment Issues, Then Fix Mobile Media Queries
