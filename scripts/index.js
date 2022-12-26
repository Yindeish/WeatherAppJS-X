// const axios  = require('axios');

class Weather {
    searchFeild = document.querySelector('input');
    searchControl = document.querySelector('.search-control');
    searchBtn = this.searchControl.querySelector('.bi-search');
    refreshBtn = this.searchControl.querySelector('.bi-arrow-clockwise');

    searchValue = this.searchFeild.value;

    typing = false;

    countriesIsoCodes = null;

    currentCityGeoDetails = null;

    search() {
        if( this.searchBtn.classList.contains('active') ) {
            console.log('searching...');

            this.useRapidAPI();
            // this.useOpenWeatherAPI();
        }
        
    }

    useRapidAPI() {
        this.getAllCountriesIsoCodes();
    }

    useOpenWeatherAPI() {
        this.getLocation()
    }

    async getLocation() {
        const searchValue = document.querySelector('input').value.toLowerCase();

        const KEY = 'c765905bf9ec88f22af316e9698e709a';

        // https://api.openweathermap.org/data/2.5/weather?q=lagos&appid=c765905bf9ec88f22af316e9698e709a
        const URL  = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${KEY}`;

        this.fetchData('GET', URL)
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })

    }

    async fetchData(method, url= null, key = null, host = null, other = null) {
        return new Promise((resolve, reject) => {
            const xhr  =  new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.responseType = 'json';
            

            if( other ) {
                const { url } = other;
                xhr.open(method, url);
                xhr.setRequestHeader("accept", "*/*");
            } 

             else {
                xhr.open(method, url);
                xhr.setRequestHeader("X-RapidAPI-Key", key);
                xhr.setRequestHeader("X-RapidAPI-Host", host);
            }

            xhr.onload = () => {
                if (xhr.status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.response);
                }
            }
            xhr.onerror = () => {
                reject(xhr.response);
            }

            xhr.send();
           
        })
    }

    async getAllCountriesIsoCodes() {
        const URL = "https://countries-cities.p.rapidapi.com/location/country/list";
        const KEY = "7cfe79fb4cmsha97c9c0ea2a5ac4p1fd173jsn0f3c71c9c278";
        const HOST = 'countries-cities.p.rapidapi.com';
        
        this.fetchData('GET', URL, KEY, HOST)
        .then(data => {
            this.countriesIsoCodes = Object.keys(data.countries);

            for(let countryIsoCode of this.countriesIsoCodes) {
                this.getAllCitiesInCountry(countryIsoCode);
            }
        })
        .catch(err => console.error(err))
    }

    async getAllCitiesInCountry(countryIsoCode) {
       
        const URL  = `https://countries-cities.p.rapidapi.com/location/country/${countryIsoCode}/city/list?page=2&per_page=20&population=1501`;
        const KEY = "7cfe79fb4cmsha97c9c0ea2a5ac4p1fd173jsn0f3c71c9c278";
        const HOST = 'countries-cities.p.rapidapi.com';

        this.fetchData('GET', URL, KEY, HOST)
        .then(data => {

            const citiesInCountry = Object.values(data.cities);
            const citiesDetails = Object.values(citiesInCountry);

            for(let cityDetails of Object.values(citiesDetails)) {

                const gottenCityDetails = this.searchCityInCities(cityDetails);
                const gottenCityLat = gottenCityDetails.latitude;
                const gottenCityLong = gottenCityDetails.longitude;

                this.currentCityGeoDetails = {
                    lat: gottenCityLat,
                    long: gottenCityLong
                }

                console.log(this.currentCityGeoDetails, 'currentCityGeoDetails')
                this.getCityWeatherDetails(this.currentCityGeoDetails);
            }
        })
        .catch(err => console.error(err))
    }

    searchCityInCities(cityDetails) {
        const searchValue = document.querySelector('input').value;
        // console.log( searchValue, 'searchValue', cityDetails.name, 'cityName')
        if( cityDetails.name.toLowerCase() == searchValue.toLowerCase() ) {
            return cityDetails;
        } else return;
    }

    async getCityWeatherDetails(geoDetails) {
        console.log('getting weather the weather details...');
        const { lat, long } = geoDetails;
        console.log(lat, long);

        const KEY = 'c765905bf9ec88f22af316e9698e709a';
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${KEY}`;
        const weatherParameters = {
            url: weatherURL,
            key: KEY
        }

        this.fetchData('GET', null, null, null, weatherParameters)
        .then(data => {
            const weatherInfos = data.weather;
            console.log(data, weatherInfos);
        })
        .catch(err => {
            console.log(err);
        })

        // this.renderUI()

    }

    renderUI() {

    }

    refresh() {
        if( this.refreshBtn.classList.contains('active') ) {
            location.reload();
        }
        this.searchFeild.addEventListener('keyup', () => {
            this.typing = true;
        })
    }
}

class EventHandler extends Weather {

    typeInFeid() {
        this.searchFeild.addEventListener('input', event => {
            this.typing = true;
            if ( this.typing ) {
                this.refreshBtn.classList.remove('active');
                this.searchBtn.classList.add('active');
            } else {
                this.refreshBtn.classList.add('active');
                this.searchBtn.classList.remove('active');
            }
        })

    }

    run() {
        this.typeInFeid();
        this.refreshBtn.addEventListener('click', () => {
            this.refresh();
        })
        this.searchBtn.addEventListener('click', () => {
            this.search();
        })
    }

}

class App {
    static init () {
        const weatherApp = new EventHandler();
        weatherApp.run();
    }
}

App.init();

// export default App;