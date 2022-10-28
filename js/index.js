import cities from '../data/cities.json' assert {type: 'json'};
window.cities = cities
let active = null;
const buttons = document.querySelectorAll('.buttonsWrapper button');
const submit = document.querySelector('.submitWrapper button');
const compass = document.querySelector('.compass img');
const options = { frequency: 30, referenceFrame: "device" };
const location = {
    longitude: 0,
    latitude: 0,
}
function locationHandler(pos) {
    location.longitude = pos.coords.longitude;
    location.latitude = pos.coords.latitude;
}


Promise.all([
    navigator.permissions.query({ name: "accelerometer" }),
    navigator.permissions.query({ name: "magnetometer" }),
    navigator.permissions.query({ name: "gyroscope" }),
    navigator.permissions.query({name:"geolocation"}),
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

        submit.addEventListener('click', () => {
            const citiesAndDistances = cities.map((city) => {
                const [lon,lat] = city.geometry.coordinates;
                const name = city.properties.capital + '-' + city.properties.country;
                const longDelta = lon - location.longitude;
                const latDelta = lat - location.latitude;
                const distToCity = Math.sqrt(longDelta * longDelta + latDelta * latDelta);
                const angleToCity = Math.atan(longDelta / latDelta);
                const angleRocket = angle * Math.PI;
                const dist = sin(angleRocket - angleToCity) * distToCity;
                return {
                   name,
                   dist,
                }
            });

            let nearest = citiesAndDistances[0];
            for (item of citiesAndDistances) {
                if (nearest.dist > item.dist) {
                    nearest = item
                }
            }

            const data = {
                'current position': `long: ${lon}, lat: ${lat}`,
                'direction angle': `${angle}deg`,
                'potential target': `${nearest.name}`,
            }
            alert(JSON.stringify(data));
        })



    } else {
        console.log("No permissions to use AbsoluteOrientationSensor.");
    }
});
