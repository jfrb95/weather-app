import './style.css';
import { component } from './modules/component.js';
import { formatDate } from './modules/format-date.js';

const log = console.log;
const body = document.body;

//CURENTLY DOES NOT HANDLE ERRORS

//IDEAS FOR NEXT TIME:

//Design a function that takes the webpage layout as an object
// and uses the component factory to generate the website.
// Then, the website can be created using object literals and
// will be easier to read. The object could also take in existing
// elements from the html using querySelector.
//MAY NEED to change how component module works

//Store any fetched data retrieved before using it. This way it
// can be used in other places too.

//Storing data is also good because it means we can round
// the numbers for display purposes while still allowing
// for accurate back-and-forthing between units such as C/F

(async function() {
    let data;
    let temperatureUnit = 'F';

    const wrapper = 
        component('div')
            .id('wrapper')
            .render();

    const inputSection =
        component('div')
            .id('input-section')
            .render(wrapper);

    const h1 = 
        component('h1')
            .text('Weather App')
            .render(inputSection);

    const infoText = 
        component('p')
            .text('Enter a location to see the current weather conditions:')
            .render(inputSection);
    
    const searchWrapper =
        component('div')
            .addClass('search-wrapper')
            .render(inputSection);

    const locationInput = 
        component('input')
            .id('location')
            .setAttribute('name', 'location')
            .render(searchWrapper);
    
    const toggleTempButton = 
        component('button')
            .text('\u00B0F')
            .addClass('temp-toggle')
            .addListener('click', function toggleTemperatureUnits(temperature) {
                if (temperatureUnit === 'F') {
                    temperatureUnit = 'C';
                    toggleTempButton.text('\u00B0C');
                    if(data) { dropMenu.updateDisplay(data) };                    
                } else if (temperatureUnit ==='C') {
                    temperatureUnit = 'F';
                    toggleTempButton.text('\u00B0F');
                    if(data) { dropMenu.updateDisplay(data) }; 
                } else {
                    throw new Error('Something went wrong: temperature is not set to F or C.');
                }
            })
            .render(searchWrapper)
    
    const submitBtn =
        component('button')
            .text('Check Weather')
            .addListener('click', function() {
                log('temp units:', temperatureUnit);
                dropMenuLoading.show();
                dropMenu.hide();
                fetchData(locationInput.value)
                    .then(function(result) {
                        data = result;
                        dropMenu.updateDisplay(result);
                    })
                    .then(function() {
                        dropMenuLoading.hide();
                        dropMenu.show();
                    });
            })
            .render(searchWrapper);
    
    const dropMenu =
        component('ul')
            .id('drop-menu')
            .wrap(
                component('li').id('conditions').wrap(
                    component('p')
                        .text('Conditions:')
                        .addClass('title'),
                    component('p')
                        .addClass('data-display')
                        .text()
                ),
                component('li').id('temperature').wrap(
                    component('p')
                        .text('Temperature:')
                        .addClass('title'),
                    component('p')
                        .addClass('data-display')
                        .text()
                ),
                component('li').id('humidity').wrap(
                    component('p')
                        .text('Humidity:')
                        .addClass('title'),
                    component('p')
                        .addClass('data-display')
                        .text()
                ),
                component('li').id('sunset').wrap(
                    component('p')
                        .text('Sunset at:')
                        .addClass('title'),
                    component('p')
                        .addClass('data-display')
                        .text()
                ),
                component('li').id('description').wrap(
                    component('p')
                        .text('Description:')
                        .addClass('title'),
                    component('p')
                        .addClass('data-display')
                        .text()
                )
            )
            .hide()
            .render(wrapper);
    
    const dropMenuLoading =
        component('div')
            .id('drop-menu-loading')
            .wrap(
                component('p')
                    .text('fetching data...')
            )
            .hide()
            .render(wrapper);


    dropMenu.updateDisplay = function(weatherData) {
        dropMenu.children.forEach((child) => {
            child.element
                .querySelector('.data-display')
                .textContent = weatherData[child.element.id];
        })
        if (temperatureUnit === 'C') {
            dropMenu.element.querySelector('#temperature .data-display')
                .textContent = fahrenheitToCelcius(weatherData.temperature);
        }
    }

    const rootUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
    const apiKey = '5LQKM8SLBW54XG8SVFVN3E78Q';

    function fetchData(location) {
        const date1 = formatDate.yyyyMmDd(new Date(Date.now()));
        const url = `${rootUrl}/${location}/${date1}?key=${apiKey}`;
        const req = new Request(url, {
            method: 'get',
            mode: 'cors'
        })

        return fetch(req)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Response not ok');
                }
                return response.json();
            })
            .then((response) => {
                return processData(response);
            })
            .catch((error) => {
                log('Error:', error.message);
            })
    }
    function processData(data) {
        const current = data.currentConditions;
        return {
            conditions: current.conditions,
            temperature: current.temp,
            sunset: current.sunset,
            humidity: current.humidity,
            description: data.description
        }
    }

    function celciusToFahrenheit(C) {
        return (C * 9 / 5) + 32;
    }

    function fahrenheitToCelcius(F) {
        return (F - 32) * 5 / 9;
    }


})();