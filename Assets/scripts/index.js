

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
const city = "Fort+Worth";

const query = `q=${city}&appid=dbd4b78b875c9f3d499f25008225a8e6`;

const fullGeoCall = geoCall + query;

// fetch(fullGeoCall).then(
//     (value) => {
//         console.log(value);
//     }, (error) => {
//         console.log(error);
//     }
// )

// $("#currentCity").load(fullGeoCall);

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
            url: `${url}lat=${coords[0]}&lon=${coords[1]}&appid=${key}`,
            method: "GET"
        }).then( (value) => {
            console.log(value);
        })

}

).fail( (error) => {
    console.log(error);
})