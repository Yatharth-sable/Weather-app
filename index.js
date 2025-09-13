const userTab = document.querySelector("[data-userWeather]");
const SearchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const searchInput = document.querySelector("[data-searchInput]");   

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// intially variable need??

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"
currentTab.classList.add("current-tab");  
getfromSessionStorage();


function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab") 

        if (!searchForm.classList.contains("active")) {
            //KYA SEARCH FORM WALA CONTAINER IS VISIBLE THEN MAKE IT VISIBLE
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
        else { 
            // main phle serach wale tab pr tha ab your weather tab visible krna hai means landing page 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active")
            // ab main weather tab me aa gya hu, toh ab weather bhi display krna padega let check first in localstorage 
            // for cordinates , if we haved saved them there
            getfromSessionStorage();

        }
    }

}
userTab.addEventListener("click", () => {
    // pass clicked tab as the input parameter   
    switchTab(userTab);
});

SearchTab.addEventListener("click", () => {
    // pass clicked tab as the input parameter   
    switchTab(SearchTab);
});

// check if cordinated are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active")
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active")
    // take loader visible
    loadingScreen.classList.add("active")

    // api call 
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }

    catch (err) {
        loadingScreen.classList.remove("active");
        console.log("not found");
        // hw 
    }
}

 function renderWeatherInfo(weatherInfo){ 
    // firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch   values form the weatherinfo obj and put it in ui elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getLocation () {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    } else{
        alert("Current version does not support location"); 
    }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" ,getLocation);

function showPosition(position){
    const userCoordinates ={
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    }
     sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}

searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    
    if (cityName === ""){
        return;
    } else{
        fetchSearchWeatherInfo(cityName);
    }
})

    async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")

    try{
         const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data);
    }

   catch (err) {
    loadingScreen.classList.remove("active");
    alert("Failed to fetch weather data. Please try again.");
}

 }