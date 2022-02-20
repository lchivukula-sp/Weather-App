//Getting Current Date and Time
let currentDate = new Date();

function getDay(timestamp) {
  let currentDate = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDay = days[currentDate.getDay()];
  return currentDay;
}

function getMonth() {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentMonth = months[currentDate.getMonth()];
  return currentMonth;
}

//funtion to add zeros to minutes
function addZero(min) {
  if (min < 10) {
    min = "0" + min;
    return min;
  } else {
    return min;
  }
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  forecastHTML = `<ul class="table" id="forecast-table">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `   <li class="col">
            ${formatForecastTimeStamp(forecastDay.dt)} <br/>
            <br />
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="${forecastDay.weather[0].description}" width="50" />
             <br/>
             <pre class="high">Hi ${Math.round(forecastDay.temp.max)}°</pre>
             <pre class="low">Lo ${Math.round(forecastDay.temp.min)}°</pre>
          </li>`;
    }
  });

  forecastHTML = forecastHTML + `</ul>`;
  forecastElement.innerHTML = forecastHTML;
}

//Getting Real Data

//Funtion to format the Unix time stamp
function formatDate(timestamp) {
  let dt = new Date(timestamp);
  let hrs = dt.getHours();
  let mins = addZero(dt.getMinutes());
  let updatedDay = getDay(dt.getDay());
  let month = getMonth(dt.getMonth());
  let year = dt.getFullYear();
  let currentDt = dt.getDate();

  let lastUpdatedTime = `${updatedDay} ${month} ${currentDt} ${year} ${hrs}:${mins}`;
  let sunRiseSetTime = `${hrs}:${mins}`;
  return [lastUpdatedTime, sunRiseSetTime];
}

function formatForecastTimeStamp(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = getDay(date.getDay(timestamp));
  let forecastDate = date.getDate();

  let formatDate = `${day} ${forecastDate}`;
  return formatDate;
}

function getCoordinates(coordinates) {
  console.log(coordinates);
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=Imperial`;
  console.log(apiURL);
  axios.get(`${apiURL}`).then(displayForecast);
}

function getWeather(response) {
  //Setting the City Name on the App
  document.querySelector("h1").innerHTML = response.data.name;

  //Setting the Current Temp
  tempInF = response.data.main.temp;
  document.getElementById("currTemp").innerHTML = `${Math.round(tempInF)} °F`;

  //Setting the Feels Like Temp
  feelsLikeTempInF = response.data.main.feels_like;
  document.getElementById("feels-like").innerHTML = `Feels like ${Math.round(
    feelsLikeTempInF
  )} °F`;

  //Setting the High Temp
  highTempInF = response.data.main.temp_max;
  document.getElementById("high").innerHTML = Math.round(highTempInF);

  //Setting the Low Temp
  lowTempInF = response.data.main.temp_min;
  document.getElementById("low").innerHTML = Math.round(lowTempInF);

  //Setting the Current Condition
  document.getElementById("currCondition").innerHTML =
    response.data.weather[0].description;

  //Setting the Wind
  document.getElementById("wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )} mph`;

  //Setting the Visibility
  visibilityInMiles = Math.round(response.data.visibility / 1600);
  document.getElementById(
    "visibility"
  ).innerHTML = `${visibilityInMiles} miles`;

  //Setting the updated by Time
  let formatUpdatedDate = formatDate(response.data.dt * 1000);
  document.getElementById("updatedTime").innerHTML = formatUpdatedDate[0];

  //Setting the Sunrise Time
  let formatSunriseDate = formatDate(response.data.sys.sunrise * 1000);
  document.getElementById("sunrise").innerHTML = formatSunriseDate[1];

  //Setting the Sunset Time
  let formatSunsetDate = formatDate(response.data.sys.sunset * 1000);
  document.getElementById("sunset").innerHTML = formatSunsetDate[1];

  //Setting the Weather icon
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  //Setting the alt text
  icon.setAttribute("alt", response.data.weather[0].description);

  getCoordinates(response.data.coord);
}

let apiKey = "cf8267c6600edc57b47b1e642c93512f";

function searchForCity(city) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=${apiKey}`;
  axios.get(`${apiURL}`).then(getWeather);
}

function getCityName(event) {
  event.preventDefault();
  let city = document.querySelector("#citySearch").value;
  searchForCity(city);
}

let form = document.querySelector("form");
form.addEventListener("submit", getCityName);

function showCurrentLocation(position) {
  let apiURLCurrLoc = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${apiKey}`;
  axios.get(`${apiURLCurrLoc}`).then(getWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let currLocBtn = document.querySelector("#currLocation");
currLocBtn.addEventListener("click", getCurrentPosition);

//Function to convert temperature to Celsius
function convertTemp() {
  let metricBtn = document.getElementById("chngeMetric");
  if (metricBtn.innerHTML.trim() === "°C") {
    metricBtn.innerHTML = "°F";
    metricBtn.style.backgroundColor = "#3e8e41";
    metricBtn.style.color = "#FFFF";

    //Converting temperature from Farenheit to Celsius
    let currTempInCel = ((tempInF - 32) * 5) / 9;
    let feelsLikeTempInCel = ((feelsLikeTempInF - 32) * 5) / 9;
    let highTempInCel = ((highTempInF - 32) * 5) / 9;
    let lowTempInCel = ((lowTempInF - 32) * 5) / 9;

    //Setting the current temp in Celsius
    document.getElementById("currTemp").innerHTML = `${Math.round(
      currTempInCel
    )} °C`;

    //Setting the feels like temp in Celsius
    document.getElementById("feels-like").innerHTML = `Feels like ${Math.round(
      feelsLikeTempInCel
    )} °C`;

    //Setting the high temp in Celsius
    document.getElementById("high").innerHTML = `${Math.round(highTempInCel)}`;

    //Setting the low temp in Celsius
    document.getElementById("low").innerHTML = `${Math.round(lowTempInCel)}`;
  } else {
    metricBtn.innerHTML = "°C";
    metricBtn.style.backgroundColor = "#FFFF";
    metricBtn.style.color = "black";
    console.log(`${Math.round(tempInF)} °F`);
    document.getElementById("currTemp").innerHTML = `${Math.round(tempInF)} °F`;

    document.getElementById("feels-like").innerHTML = `Feels like ${Math.round(
      feelsLikeTempInF
    )} °F`;

    document.getElementById("high").innerHTML = `${Math.round(highTempInF)}`;

    document.getElementById("low").innerHTML = `${Math.round(lowTempInF)}`;
  }
}

let tempInF = null;
let feelsLikeTempInF = null;
let highTempInF = null;
let lowTempInF = null;

searchForCity("New York");
