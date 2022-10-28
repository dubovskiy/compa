import cities from '../data/cities.json' assert {type: 'json'};

let active = null;
const buttons = document.querySelectorAll('.buttonsWrapper button');
const submit = document.querySelector('.submitWrapper button');
const compass = document.querySelector('.compass img');
const options = {frequency: 30, referenceFrame: "device"};
buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
        const activeItem = document.querySelector('.buttonsWrapper .active');
        if (activeItem === this) {
            active = '';
            this.classList.remove('active');

        } else {
            active = this.innerHTML;
            this.classList.add('active');
            activeItem?.classList.remove('active');
        }
    })
});
const currentLocation = {
    longitude: 35,
    latitude: 48.45,
}


function locationHandler(pos) {
    currentLocation.longitude = pos.coords.longitude;
    currentLocation.latitude = pos.coords.latitude;
}

function convertLonLatToKm (lon, lat) {
    const cityLon = lon * 111.1;
    const oneDegLat = Math.cos(Math.PI * lon / 180) * 111.3;
    const cityLat = lat * oneDegLat;
    return [cityLon, cityLat];
}

Promise.all([
    navigator.permissions.query({name: "accelerometer"}),
    navigator.permissions.query({name: "magnetometer"}),
    navigator.permissions.query({name: "gyroscope"}),
]).then((results) => {
    if (results.every((result) => result.state === "granted")) {
        let angle;
        navigator.geolocation.getCurrentPosition(locationHandler);

        const sensor = new AbsoluteOrientationSensor(options);

        sensor.addEventListener("reading", () => {
            angle = sensor.quaternion[2];
            compass.style.transform = `rotate(${angle * 180}deg)`;
        });
        sensor.start();

        submit.addEventListener('click', () => {
            const [myLon, myLat] = convertLonLatToKm(currentLocation.longitude, currentLocation.latitude);
            const citiesAndDistances = cities.map((city) => {
                const [lon, lat] = city.geometry.coordinates;
                const [cityLon, cityLat] = convertLonLatToKm(lon, lat);

                const name = city.properties.capital + '-' + city.properties.country;
                const longDelta = cityLon - myLon;
                const latDelta = cityLat - myLat;
                const distToCity = Math.sqrt(longDelta * longDelta + latDelta * latDelta);
                const angleToCity = Math.atan(longDelta / -latDelta);
                const angleRocket = angle * Math.PI;
                const dist = Math.abs(Math.sin(angleRocket - angleToCity) * distToCity);
                const isMineCity = distToCity < 100;
                return {
                    isMineCity,
                    name,
                    distToCity,
                    angleToCity,
                    dist,
                }
            });
            citiesAndDistances.sort((item1, item2) => {
                return item1.dist - item2.dist;
            })

            const data = {
                'current position': `long: ${currentLocation.longitude}, lat: ${currentLocation.latitude}`,
                'direction angle': `${angle}deg`,
                'potential target': `${citiesAndDistances[0].isMineCity ? citiesAndDistances[1].name: citiesAndDistances[0].name}`,
            }
            alert(JSON.stringify(data));
        })
    } else {
        console.log("No permissions");
    }
});
