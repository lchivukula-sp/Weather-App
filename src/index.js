//Getting Current Date and Time
let currentDate = new Date();

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let currentDay = days[currentDate.getDay()];

let currentDt = currentDate.getDate();

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

let currentYear = currentDate.getFullYear();

let currentHour = currentDate.getHours();

function addZero(min) {
  if (min < 10) {
    min = "0" + min;
    return min;
  } else {
    return min;
  }
}

let currentMinute = addZero(currentDate.getMinutes());

let h3 = document.querySelector("h3");
h3.innerHTML = ` ${currentDay} ${currentMonth} ${currentDt} ${currentYear} ${currentHour}:${currentMinute}`;

//Getting Real Data

function getWeather(response) {
  //Setting the City Name on the App
  document.querySelector("h1").innerHTML = response.data.name;

  //Setting the Current Temp
  document.getElementById("currTemp").innerHTML = `${Math.round(
    response.data.main.temp
  )} °F`;

  //Setting the Feels Like Temp
  document.getElementById("feels-like").innerHTML = `Feels like ${Math.round(
    response.data.main.feels_like
  )} °F`;

  //Setting the High Temp
  document.getElementById("high").innerHTML = Math.round(
    response.data.main.temp_max
  );

  //Setting the Low Temp
  document.getElementById("low").innerHTML = Math.round(
    response.data.main.temp_min
  );

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

searchForCity("New York");
