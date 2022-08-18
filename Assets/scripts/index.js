

// 2 calls need to be made 
// current weather
// and then 5 day forecast 
// import fetch from "node-fetch";
// import fetch from "./node_modules/node-fetch/";

let url = "https://api.openweathermap.org/data/2.5/weather?";

const key = "dbd4b78b875c9f3d499f25008225a8e6"

let geoCall = "http://api.openweathermap.org/geo/1.0/direct?"

// get input.
// then create the query param, q=citbane&appid=key;

// q={city name}&appid={API key}"
const city = "Fort Worth";

const queryCity = city.replaceAll(" ", "+");
const query = `q=${queryCity}&appid=dbd4b78b875c9f3d499f25008225a8e6`;


const fullGeoCall = geoCall + query;

$.ajax({
    url: fullGeoCall,
    method: "GET"
}).then( (value) => {
    // console.log(value);
    const lon = value[0].lon;
    const lat = value[0].lat;
    return [lat, lon];
}).then( (coords) => {
        $.ajax({
            url: `${url}lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`,
            method: "GET"
        }).then( (value) => {
            
            const name = value.name;
            const temp = value.main.temp;
            const humidity = value.main.humidity;
            const windSpeed = value.wind.speed;
            const visibility = value.weather[0].main;
            const description = value.weather[0].description;
            const icon = value.weather[0].icon;
            const weatherImg = $(`<img src="http://openweathermap.org/img/wn/${icon}.png">`);
            $("#forecast").append(weatherImg);
            $(".cityName").text(name);
            $(".icon").append(weatherImg);
            $(".temperature").text(`Temperature: ${temp}`);
            $(".windSpeed").text(`Wind speed: ${windSpeed} MPH`);
            $(".humidity").text(`Humidity: ${humidity} %`);
            return [value.coord.lat, value.coord.lon];
            //  Add UV Call
        }).then ( (coords) => {
            console.log(coords);
            $.ajax({
            // forecast call 
            url: `http://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`,
            method: "GET"
            }).then( (value ) => {
                console.log(value);
            })
        })

}

).fail( (error) => {
    console.log(error);
})

// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

