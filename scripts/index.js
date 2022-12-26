class EventHandler {

    typing = false;

    inactive = document.querySelector('.inactive');
    cityWeatherDetails = document.querySelector('.city-weather-details');

    typeInFeid() {
        this.searchFeild.addEventListener('input', () => {
            this.toggleDetails();
        })

        this.searchFeild.addEventListener('keyup', () => {
            this.typing = true;
            this.toggleDetails();
        })
        this.searchFeild.addEventListener('keydown', () => {
            this.typing = true;
            this.toggleDetails();
        })
    }

    toggleDetails() {
        if ( this.typing ) {
            this.refreshBtn.classList.remove('active');
            this.searchBtn.classList.add('active');
        } else {
            this.refreshBtn.classList.add('active');
            this.searchBtn.classList.remove('active');
            this.inactive.classList.remove('show-f');
            this.cityWeatherDetails.classList.add('show-f');
        }
    }

}

class Weather extends EventHandler {

    searchFeild = document.querySelector('input');
    searchControl = document.querySelector('.search-control');
    searchBtn = this.searchControl.querySelector('.bi-search');
    refreshBtn = this.searchControl.querySelector('.bi-arrow-clockwise');
    weatherStatusImage = document.querySelector('.city-weather-details img');

    error = false;
    errorMessage = null;

    search() {
        if( this.searchBtn.classList.contains('active') ) {
            this.getLocation();
        }
        
    }

    async fetchData(url) {

        return new Promise((resolve, reject) => {
            const response = fetch(url);
            if ( response ) {
                console.log('Good response');
                resolve(response);
            } else {
                console.log('Bad respose');
                reject(response);
            }
        }).then(res => res.json())
    }

    async getLocation() {

        const searchValue = document.querySelector('input').value.toLowerCase();

        const KEY = 'c765905bf9ec88f22af316e9698e709a';

        const URL  = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${KEY}`;

        this.fetchData(URL)
        .then(data => {
            console.log(data);
            const name = data.name;
            const temp = data.main.temp;
            const desc = data.weather[0].description;
            const weatherStatus = data.weather[0].main;

            const weatherData = {
                name,
                temp,
                desc,
                status: weatherStatus
            }

            this.renderUI(weatherData);
        })
        .catch(err => {
            this.error = true;
            this.errorMessage = err.message;
            this.renderError(this.errorMessage);
        })

    }

    renderUI(weatherData) {
        const celcius  = document.querySelector('.celcius h1');
        const weatherDescription  = document.querySelector('.weather-description h2');
        const city  = document.querySelector('.city h2');

        const { name, temp, desc, status } = weatherData;

        if( status == 'Clear' ) this.weatherStatusImage.src = './svgs/sunny.svg';
        if( status == 'Clouds' ) this.weatherStatusImage.src = './svgs/cloudy.svg';
        if( status == 'Rainy' ) this.weatherStatusImage.src = './svgs/cloudy.svg';

        celcius.textContent = `${(temp - 273).toFixed(2)}`;
        weatherDescription.textContent = `${desc}`;
        city.textContent = `${name}`;

    }

    renderError(errorMessage) {
        if( this.error ) {
            this.cityWeatherDetails.innerHTML = 
            /*html*/
            `
            <div class="error-block f-centralize-block-xy">
                <h1>City not found!</h1>
                <h2>Check spelling</h2>
                <span>${errorMessage}</span>
            </div>
            `;
        }
    }

    refresh() {
        if( this.refreshBtn.classList.contains('active') ) {
            location.reload();
        }
       
    }

    run() {
        this.typeInFeid();
        this.refreshBtn.addEventListener('click', () => {
            this.refresh();
        })
        this.searchBtn.addEventListener('click', () => {
            this.typing = false;
            this.search();
            this.toggleDetails();
        })
       
    }
}



class App {
    static init () {
        const weatherApp = new Weather();
        weatherApp.run();
    }
}

App.init();
