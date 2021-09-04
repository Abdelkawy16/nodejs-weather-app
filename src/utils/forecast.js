const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=18facea61227463c97039d0598f79fbd&query=${latitude},${longitude}&units=m`;

    request({ url, json: true }, (err, { body }) => {
        if (err) {
            callback('Unable to connect to weather services!', undefined);
        } else if (body.error) {
            callback('Unable to find location. Try another search!', undefined);
        } else {
            callback(undefined, `${body.current.weather_descriptions[0]}. It's currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out. There is a ${body.current.precip}% chance of rain.`);
        }
    });
};

module.exports = forecast;