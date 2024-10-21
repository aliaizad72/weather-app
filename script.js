function weatherURL(location) {
  return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=Y3L7NVBBYAKRSQZCZTEBPMKEY`;
}

async function getWeather(location) {
  try {
    const response = await fetch(weatherURL(location));
    const json = await response.json();
    return json;
  } catch (error) {
    throw error;
  }
}

function latLongLocation(lat, lon) {
  return lat + "%2C" + lon;
}

document.body.onload = () => {
  displayWeather("Kuala Lumpur");
};

function displayWeather(param) {
  getWeather(param)
    .then((weather) => {
      print(weather);
    })
    .catch((error) => {
      document.getElementById("error").textContent =
        "Invalid search parameters, try again";
    });
}

function print(weatherReport) {
  clearInfoDiv();
  setAddress(weatherReport.resolvedAddress);
  addGif(weatherReport.currentConditions.icon);
  appendInfo(weatherReport.currentConditions.conditions);
  appendInfo(printTemp(weatherReport.currentConditions.temp));
  appendInfo(
    "Feels like: " + printTemp(weatherReport.currentConditions.feelslike)
  );
  appendInfo(
    "Last updated: " +
      removeSecondsFromDatetime(weatherReport.currentConditions.datetime)
  );
}

function clearInfoDiv() {
  const infoDiv = document.getElementById("info");
  const infoDivDivChildren = [...infoDiv.children].filter(
    (child) => child.localName === "div"
  );
  infoDivDivChildren.forEach((child) => child.remove());
}

function setAddress(location) {
  str = isCoords(location) ? "Your Location" : location.replace(",", ", ");
  document.getElementById("address").textContent = str;
}

function isCoords(location) {
  return Boolean(Number(location.split(",")[0]));
}

function setIcon(condition) {
  document.getElementById("current-icon").src = `../icons/${condition}.svg`;
}

function appendInfo(str) {
  const div = document.createElement("div");
  div.textContent = str;
  document.getElementById("info").appendChild(div);
}

function removeSecondsFromDatetime(datetime) {
  return datetime.slice(0, -3);
}

function printTemp(temp) {
  return `${Math.round(fahrenheitToCelcius(temp))}\u{00B0}C | ${Math.round(
    temp
  )}\u{00B0}F`;
}

function fahrenheitToCelcius(temp) {
  return (temp - 32) / (9 / 5);
}

async function searchGif(condition) {
  const url =
    "https://api.giphy.com/v1/gifs/translate?api_key=El5nO9dR5AvmrnLgHUmG71tmD1A1ArMa&s=" +
    condition +
    " weather";
  const response = await fetch(url, { mode: "cors" });
  const json = await response.json();
  return json;
}

function addGif(condition) {
  searchGif(condition).then((json) => {
    console.log(json.data.images.original.url);
    document.body.style.backgroundImage = `url(${json.data.images.original.url})`;
  });
}

document
  .getElementById("searchbtn")
  .addEventListener("click", () =>
    displayWeather(document.getElementById("textinput").value)
  );

document
  .getElementById("geolocater")
  .addEventListener("click", getWeatherAtUserLocation);

function getWeatherAtUserLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    displayWeather(
      latLongLocation(position.coords.latitude, position.coords.longitude)
    );
  });
}
