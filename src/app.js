const path = require('path');
const express = require('express');
const request = require('postman-request');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = 3000;

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => res.render('index', { title: "Weather", name: "Mustafa Abdelkawy" }));
app.get('/about', (req, res) => res.render('about', { name: 'Mustafa Abdelkawy', title: 'About me' }));
app.get('/help', (req, res) => res.render('help', { name: 'Mustafa Abdelkawy', title: 'Help', message: 'This is some helpfull article' }));
app.get('/help/*', (req, res) => res.render('error', { name: 'Mustafa Abdelkawy', title: 'Help', message: 'Help article not found' }));
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'You must provide an address!' });
    }
    geocode(req.query.address, (error, { latitude, location, longitude } = {}) => {
        if (error) {
            return res.send({error});
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error});
            }
            res.send({ forecast: forecastData, location, address: req.query.address });
        });
    });
});
app.get('*', (req, res) => res.render('error', { title: '404', name: 'Mustafa Abdelkawy', message: 'Page not found' }));

app.listen(port, () => console.log(`Server is up on port ${port}!`));