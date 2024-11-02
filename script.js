'use strict';

const searchButton = document.querySelector('button');
const forecastElement = document.querySelector('.forecast');
const sidebarElement = document.querySelector('.table');
const daysForecastElement =  document.querySelector('.future');

const searchInput = document.querySelector('input');
const searchList = document.querySelector('.searchList');
const apikey='AY8ARGU6JCGAMR6ASKCBSZQ7H';



// Function to get the trimmed search term from the input
const getSearchTerm = () => {
  const searchInput = document.querySelector('input');
  return searchInput.value.trim();
};

async function getUserLocation() {
  if (!navigator.geolocation) {
    throw new Error('Geolocation not supported by this browser.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};




const fetchWeatherData = async () => {
  try {
    const coords = await getUserLocation();
    const location = await fetch(`https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}&api_key=66ed3b80d326f482083849rtke61975`);
    const locationData = await location.json();
    const weatherResponse = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationData.address.city},${locationData.address.country}?key=${apikey} `);
    
    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! status: ${weatherResponse.status}`);
    }
    const weatherData = await weatherResponse.json();
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

  // Main function
window.onload = async () => {
    const data = await fetchWeatherData();
    if (data) {
      renderWeatherData(data);
    }
    console.log(data);
    

    
  };

let locations = [];

  const handleSearch = async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') return;
    const searchWeather = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchInput.value}?key=${apikey}`);
  
    const data = await searchWeather.json();
    console.log(data);
    

    if (data) {
      renderWeatherData(data);
    }
    if(!data){
      alert('No results found');
    }
   
     locations = data.Search || [];
     return locations.filter((city) => {
      return city.city.toUpperCase().includes(searchTerm.toUpperCase());
    })

  };
  
  searchButton.addEventListener('click', handleSearch);

  // const renderCity = () => {
  //   searchList.innerHTML = '';

  //   const searchTerm = searchInput.value.toUpperCase();
  //   const filteredLocation = locations.filter(location => location.address.city.toUpperCase().includes(searchTerm.toUpperCase()));


  //   filteredLocation.map((city) => {
  //     const cityElement = document.createElement('li');
  //     cityElement.textContent = city.address.city;
  //     searchList.appendChild(cityElement);
  //   });


  // };

    // searchInput.addEventListener('input', renderCity);




  // Function to render weather data
const renderWeatherData = (data) => {
  forecastElement.innerHTML = '';
  sidebarElement.innerHTML = '';
  
  const celsius = Math.round( (5/9) *((data.days[0].tempmax) -32));
  console.log();
  
    const html = `
      <h1>${celsius}°</h1>
      <div class="txt">
        <h2>${data.resolvedAddress}</h2>
        <h3>${data.currentConditions.datetime}, ${data.days[0].datetime
        }</h3>
      </div>
      <i class="bi bi-clouds"></i>
    `;
  
    const sidebarHtml = `
    <h3>${data.description}
    </h3>
      <table>
        <tbody>
          <tr>
            <td>Temp max</td>
            <td>${celsius}° <i class="text-danger bi bi-thermometer-half"></i></td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>${data.currentConditions.humidity}% <i class="bi bi-droplet"></i></td>
          </tr>
          <tr>
            <td>Cloudy</td>
            <td>${data.currentConditions.cloudcover}% <i class="bi bi-clouds"></i></td>
          </tr>
          <tr>
            <td>Wind</td>
            <td>${data.currentConditions.windspeed}km/h <i class="bi bi-wind"></i></td>
          </tr>
        </tbody>
      </table>
    `;
    const futureForecast = `
        <div class="forecast-list">
      <div class="forecast-item">
        <span class="forecast-icon"><i class="bi bi-snow"></i></span>
        <span class="forecast-time">${data.days[0].hours[5].datetime
        }</span>
        <span class="forecast-condition">Snow</span>
        <span class="forecast-temperature">Max 19°</span>
        <span class="forecast-temperature">Min 19°</span>

      </div>
      <div class="forecast-item">
        <span class="forecast-icon"><i class="bi bi-cloud-sun"></i></i></span>
        <span class="forecast-time">12:00</span>
        <span class="forecast-condition">Cloudy</span>
        <span class="forecast-temperature">18°</span>
      </div>
      <div class="forecast-item">
        <span class="forecast-icon"><i class="bi bi-sun-fill"></i></span>
        <span class="forecast-time">15:00</span>
        <span class="forecast-condition">Sunny</span>
        <span class="forecast-temperature">21°</span>
      </div>
    
    `
  
    forecastElement.insertAdjacentHTML('beforeend', html);
    sidebarElement.insertAdjacentHTML('beforeend', sidebarHtml);
    daysForecastElement.insertAdjacentHTML('beforeend', futureForecast);
  };
  

  
  






