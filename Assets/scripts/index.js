

// 2 calls need to be made 
// current weather
// and then 5 day forecast 
// import fetch from "node-fetch";
// import fetch from "./node_modules/node-fetch/";

let url = "https://api.openweathermap.org/data/2.5/weather?";

const key = "dbd4b78b875c9f3d499f25008225a8e6";

const uvKey = "1507eaf0f2f07c897c72e9272325086f";

let uvCall = "https://api.openuv.io/api/v1/uv";


let geoCall = "http://api.openweathermap.org/geo/1.0/direct?"


// Puts the cities into the DOM on load 
const storage = "cities";
let cityArr = [];
const unparsedCities  = localStorage.getItem(storage);   
const jsonCities = JSON.parse(unparsedCities);
if (jsonCities ) {
    cityArr = jsonCities;
}
for (var i = cityArr.length - 1; i >= 0; i--) {
    const cityButton = $(`<button class='btn button-bg'></button`);
    cityButton.text(cityArr[i]);
    cityButton.on('click', (e) => {
        weatherCall(e);
    });
    $(".resultButtons").append(cityButton);

}


// Updates the localStorage, as well as the result Buttons list 
const setCity = (name) => {
    
    let cityArr = [];
    const unparsedCities  = localStorage.getItem(storage);   
    const jsonCities = JSON.parse(unparsedCities);
    
    if (jsonCities ) {

        cityArr = jsonCities;
    }
    
    if (cityArr.indexOf(name) == -1) {
        if (cityArr.length == 5) {
            cityArr.shift();
        }
        cityArr.push(name);
    }

    localStorage.setItem(storage, JSON.stringify(cityArr));

    if ($(".resultButtons").children().length > 0 ) {
        $(".resultButtons").empty();
    }
    
    for (var i = cityArr.length - 1; i >= 0; i--) {
        // const buttonRow = $("<row></row>");
        const cityButton = $(`<button class='btn button-bg'></button`);
        cityButton.text(cityArr[i]);
        cityButton.on('click', (e) => {
            weatherCall(e);
        });

        $(".resultButtons").append(cityButton);
       
    }

}

$(".search").on('click', (e) => {
    weatherCall(e);

})

const weatherCall = (e) => {

    if (e.target.textContent == "Submit") {
        city = $("#citySearch").val();
    $("#citySearch").val("");
    } else {
        // console.log(e.target.textContent);
        city = e.target.textContent;
    }

    const queryCity = city.replaceAll(" ", "+");
    const query = `q=${queryCity}&appid=dbd4b78b875c9f3d499f25008225a8e6`;
    const fullGeoCall = geoCall + query;

    $.ajax({
        // Ajax call to get the geo information based on a city 
        url: fullGeoCall,
        method: "GET"
    }).then( (value) => {
        const lon = value[0].lon;
        const lat = value[0].lat;
        return [lat, lon];
    }).then( (coords) => {
            // Ajax call to get the information based on 
            // The geo ajax call 
            $.ajax({
                url: `${url}lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`,
                method: "GET"
            }).then( (value) => {
                
                const name = value.name;
                setCity(name);
                
                const temp = value.main.temp;
                const humidity = value.main.humidity;
                const windSpeed = value.wind.speed;
                const visibility = value.weather[0].main;
                const description = value.weather[0].description;
                const icon = value.weather[0].icon;
                const weatherImg = $(`<img src="http://openweathermap.org/img/wn/${icon}.png">`);

                $("#forecast").text(weatherImg);
                $(".cityName").text(name);

                if ( $(".icon").children().length > 0) {
                    $(".icon").empty();
                    $(".UV").empty();
                }

                $(".icon").append(weatherImg);
                $(".temperature").text(`Temperature: ${temp}\u00B0F`);
                $(".windSpeed").text(`Wind speed: ${windSpeed} MPH`);
                $(".humidity").text(`Humidity: ${humidity} %`);
                return [value.coord.lat, value.coord.lon];
                //  Add UV Call
            })
             .then( (value) => {

                const forecast = $(".forecast");
                forecast.empty();
                $.ajax({
                // forecast call 
                url: `http://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`,
                method: "GET"
                }).then( (value) => {
                    final_forecast = [];
                    for (let i = 0; i < value.list.length; i ++ ) {
                        if (value.list[i].dt_txt.split(" ")[1].substr(0, 2) == "00") {
                            final_forecast.push(value.list[i]);
                        }
                    }
                    
                        for (let i of final_forecast) {
                        const date = i.dt_txt.split(" ")[0];
                        const temp = i.main.temp;
                        const icon = i.weather[0].icon;
                        const humidity = i.main.humidity
                        const wind = i.wind.speed;

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
                    return [value.city.coord.lat, value.city.coord.lon];
                }).then( (coords) => {
                    $.ajax({
                        type: "GET",
                        dataTtpe: 'json',
                        beforeSend: (request) => {
                            request.setRequestHeader('x-access-token', uvKey);
                        },
                        url: `${uvCall}?lat=${coords[0]}&lng=${coords[1]}`,
                        success: (value) => {
                            var bg = "";
                            console.log(value);
                            if (value.result.uv < 3) {
                                bg = "low";
                            } else if (value.result.uv < 6) {
                                bg = "mod";
                            } else if (value.result.uv < 8) {
                                bg = "high";
                            } else if (value.result.uv < 11) {
                                bg = "very-high";
                            } else {
                                bg = "extreme"
                            }
                            $(".UV").append(`<div class='col'>UV Index: <span class='${bg}'>${value.result.uv}</span></col>`);
                        },
                        error: (error) => {
                            alert('An error occured');
                        }
                    })
                })
            })

    }

    ).fail( (error) => {
        alert("There was an error getting the city, please try again");
        $("#citySearch").val("");
        console.log(error);
    })
}
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

