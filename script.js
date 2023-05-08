const userTab= document.querySelector( "[data-userweather]" )
const searchTab= document.querySelector( "[data-searchweather]" );
const userContainer= document.querySelector(".weather-Container")

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// initial need

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(clickedTab){
    console.log("switch tab fired");
    if(clickedTab!= currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            console.log("search form class added");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // means m phle search val tab pr tha ,ab your weather wale tab visible krna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",function () {
    //pass click tab as input parameter.
    switchTab(userTab);
})

searchTab.addEventListener("click",function () {
    //pass click tab as input parameter.
    switchTab(searchTab);
})

function getfromSessionStorage(){
    console.log("session storage function fired");
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = json.parse[localCoordinates];
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    console.log("fetch info function fired");
    const{lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json(); 
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(error){
        loadingScreen.classList.remove("active");

    }
}

function renderWeatherInfo(weatherInfo){
  const cityName = document.querySelector("[data-cityname]");
  const countryIcon = document.querySelector("[data-countryicon]");
  const desc = document.querySelector("[data-weatherdesc]");
  const weatherIcon = document.querySelector("[data-weathericon]");
  const temp  = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("There is no such geolocation support available");
    }
}

function showPosition(position){
    console.log("show position function fired")
    const userCoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinate));
    fetchUserWeatherInfo(userCoordinate);
}




const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
    return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(cityName){
     loadingScreen.classList.add("active")
     userInfoContainer.classList.remove("active")
     grantAccessContainer.classList.remove("active")

     try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        console.log(data);
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
     }
     
     catch(err){

     }
}