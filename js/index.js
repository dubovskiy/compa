import cities from '../data/cities.json' assert {type: 'json'};

const l = document.querySelector('.submitWrapper');
alert('100');
navigator.permissions.query({ name: 'geolocation' }).then((result) => {
    if (result.state === 'granted') {
        l.innerHtml = 'ok';
    }
});


// const acl = new Accelerometer({ frequency: 60 });
// acl.addEventListener("reading", () => {
//     console.log(`Acceleration along the X-axis ${acl.x}`);
//     console.log(`Acceleration along the Y-axis ${acl.y}`);
//     console.log(`Acceleration along the Z-axis ${acl.z}`);
// });
//
// acl.start();

let magSensor = new Magnetometer({frequency: 60});

magSensor.addEventListener('reading', (e) => {
    l.innerHTML = `Magnetic field along the X-axis ${magSensor.x} Magnetic field along the Y-axis ${magSensor.y} Magnetic field along the Z-axis ${magSensor.z}`;
});
magSensor.start();
