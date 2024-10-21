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

document.body.onload = () => {
  getWeather("Kuala Lumpur").then((weather) => {
    print(weather);
  });
};

function print(weatherReport) {
  clearInfoDiv();
  setAddress(weatherReport.address);
  // addGif(weatherReport.currentConditions.icon);
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
  document.getElementById("address").textContent = location.replace(",", ", ");
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

document.getElementById("searchbtn").addEventListener("click", searchLocation);

function searchLocation() {
  const param = document.getElementById("textinput").value;
  getWeather(param).then((weather) => {
    print(weather);
  });
}
