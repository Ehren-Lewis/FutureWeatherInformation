
let url = "https://api.openweathermap.org/data/2.5/weather?";
const key = "dbd4b78b875c9f3d499f25008225a8e6";         
const uvKey = "1507eaf0f2f07c897c72e9272325086f";
let uvCall = "'https://api.openuv.io/api/v1/uv";
let geoCall = "https://api.openweathermap.org/geo/1.0/direct?"


// Puts the cities into the DOM on load 
const storage = "cities";
let cityArr = [];
const unparsedCities  = localStorage.getItem(storage);   
const jsonCities = JSON.parse(unparsedCities);
if (jsonCities ) {
    cityArr = jsonCities;
}
for (var i = cityArr.length - 1; i >= 0; i--) {
    const cityButton = $(`<button class='btn button-bg mb-1'></button`);
    cityButton.text(cityArr[i]);
    cityButton.on('click', (e) => {
        weatherCall(e);
    });
    $(".resultButtons").append(cityButton);

}

// Updates the localStorage, as well as the result Buttons list 
// Used after the first then to make sure there is no error thus far 
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
        const cityButton = $(`<button class='btn button-bg mb-1'></button`);
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

        // call used only for geo information 
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
                
                // gathering the needed data 
                const temp  = value.main.temp;
                const humidity = value.main.humidity;
                const windSpeed = value.wind.speed;
                const visibility = value.weather[0].main;
                const description = value.weather[0].description;
                const icon = value.weather[0].icon;
                const weatherImg = $(`<img src="https://openweathermap.org/img/wn/${icon}.png">`);

                $("#forecast").text(weatherImg);
                $(".cityName").text(name);

                // If there is any present information, remove anything that was appended 
                if ( $(".icon").children().length > 0) {
                    $(".icon").empty();
                    $(".UV").empty();
                }

                // Using .text overwrites, no need to remove the children 
                $(".icon").append(weatherImg);
                $(".temperature").text(`Temperature: ${temp}\u00B0F`);
                $(".windSpeed").text(`Wind speed: ${windSpeed} MPH`);
                $(".humidity").text(`Humidity: ${humidity} %`);
                return [value.coord.lat, value.coord.lon];
            })
             .then( (value) => {

                const forecast = $(".forecast");
                forecast.empty();
                $.ajax({
                // forecast call 
                url: `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${key}&units=imperial`,
                method: "GET"
                }).then( (value) => {

                    final_forecast = [];
                    for (let i = 0; i < value.list.length; i ++ ) {

                        // Gets the forecast at 3pm every day, since original data is 40 long
                        if (value.list[i].dt_txt.split(" ")[1].substr(0, 2) == "15") {
                            final_forecast.push(value.list[i]);
                        }
                    }
                    
                        // Gets the needed data for the future forecast 
                        for (let i of final_forecast) {
                        const date = i.dt_txt.split(" ")[0];
                        const temp = i.main.temp;
                        const icon = i.weather[0].icon;
                        const humidity = i.main.humidity
                        const wind = i.wind.speed;

                        // appending to the dom the new information 
                        const newForecast = $("<div class='col-2 py-2 bg-dark text-light'></div>");
                        const dayRow = $(`<div class='row'>${date}</div>`);
                        const iconRow = $("<div class='row w-50'></div>");
                        iconRow.append($(`<img src="https://openweathermap.org/img/wn/${icon}.png">`));
                        const tempRow = $( `<div class='row'>Temperature: ${temp}\u00B0F</div>`);
                        const humidityRow = $(`<div class='row'>Humidity: ${humidity}%</div>`);
                        const windRow = $(`<div class='row'>wind: ${wind}MPH</div>`);

                        // No need to remove the children since it's a fresh row every time 
                        newForecast.append(dayRow);
                        newForecast.append(iconRow);
                        newForecast.append(tempRow);
                        newForecast.append(humidityRow);
                        newForecast.append(windRow);
                        forecast.append(newForecast);
                    }

                    // return coords for the OpenUV call 
                    return [value.city.coord.lat, value.city.coord.lon];

                    // OpenUV is last since it does not have a return type since its a success and not a .then 
                }).then( (coords) => {
                    $.ajax({
                        type: "GET",
                        dataType: 'json',
                        beforeSend: (request) => {
                            request.setRequestHeader('x-access-token', 'fc039e52d40f69b0474509511aacef2c');
                        },

                        // Had to use success and error in the ajax because OpenUV required a beforesend 
                        url: 'https://api.openuv.io/api/v1/uv?lat=' + coords[0] + '&lng=' + coords[1],
                        success: (value) => {

                            var bg = "";
                            // changes bg based on uv index to a certain css class 
                            if (value.result.uv < 3) {
                                bg = "low";
                            } else if (value.result.uv < 6) {
                                bg = "mod";
                            } else if (value.result.uv < 8) {
                                bg = "high";
                            } else if (value.result.uv < 11) {
                                bg = "very-high";
                            } else {
                                bg = "extreme";
                            }
                            $(".UV").append(`<div class='col mb-2'>UV Index: <span class='${bg} p-1 rounded'>${value.result.uv}</span></col>`);
                        },

                        // special error message if only in the OpenUV call 
                        error: (error) => {
                            alert('The number of daily UV quota calls has been reached, unable to provide the information');
                            $("#citySearch").val("");
                        }
                    })
                })
            })
        }
    ).fail( (error) => {
    alert("There was an error getting the city, please try again");
    $("#citySearch").val("");
    })
}

