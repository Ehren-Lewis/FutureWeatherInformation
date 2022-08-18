

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
// const city = "Fort Worth";


const city = "Austin";






$(".search").on('click', (e) => {
    weatherCall();
})

const weatherCall = (e) => {
    const city = $("#citySearch").val();
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
                $(".temperature").text(`Temperature: ${temp}\u00B0F`);
                $(".windSpeed").text(`Wind speed: ${windSpeed} MPH`);
                $(".humidity").text(`Humidity: ${humidity} %`);
                return [value.coord.lat, value.coord.lon];
                //  Add UV Call
            }).then ( (coords) => {
                const forecast = $(".forecast");
                forecast.empty();
                $.ajax({
                // forecast call 
                url: `http://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`,
                method: "GET"
                }).then( (value ) => {
                    final_forecast = [];
                    console.log(value.list[0]);
                    for (let i = 0; i < value.list.length; i ++ ) {
                        if (value.list[i].dt_txt.split(" ")[1].substr(0, 2) == "00") {
                            final_forecast.push(value.list[i]);
                        }
                    }
                    
                        for (let i of final_forecast) {
                        const date = i.dt_txt.split(" ")[0];
                        const temp = i.main.temp;
                        const icon = i.weather[0].icon;
                        console.log(icon)
                        const humidity = i.main.humidity
                        const wind = i.wind.speed;

                        console.log(date, temp, humidity, wind);

                        const newForecast = $("<div class='col-2 py-2 bg-dark text-light'></div>");
                        const dayRow = $(`<div class='row'>${date}</div>`);
                        const iconRow = $("<div class='row w-50'></div>");
                        iconRow.append($(`<img src="http://openweathermap.org/img/wn/${icon}.png">`));
                        const tempRow = $( `<div class='row'>Temperature: ${temp}\u00B0F</div>`);
                        const humidityRow = $(`<div class='row'>Humidity: ${humidity}%</div>`);
                        const windRow = $(`<div class='row'>wind: ${wind}MPH</div>`);
                        newForecast.append(dayRow);
                        newForecast.append(iconRow);
                        newForecast.append(tempRow);
                        newForecast.append(humidityRow);
                        newForecast.append(windRow);
                        forecast.append(newForecast);

                    }
                })
            })

    }

    ).fail( (error) => {
        console.log(error);
    })
}
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

