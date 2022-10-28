import cities from '../data/cities.json' assert {type: 'json'};

const l = document.querySelector('.submitWrapper');

const options = { frequency: 60, referenceFrame: "device" };
const sensor = new AbsoluteOrientationSensor(options);

sensor.addEventListener("reading", () => {
    // model is a Three.js object instantiated elsewhere.
    console.log(sensor);
});

Promise.all([
    navigator.permissions.query({ name: "accelerometer" }),
    navigator.permissions.query({ name: "magnetometer" }),
    navigator.permissions.query({ name: "gyroscope" }),
]).then((results) => {
    if (results.every((result) => result.state === "granted")) {
        sensor.start();
    } else {
        console.log("No permissions to use AbsoluteOrientationSensor.");
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
//
// let magSensor = new Magnetometer({frequency: 60});
//
// magSensor.addEventListener('reading', (e) => {
//     l.innerHTML = `Magnetic field along the X-axis ${magSensor.x} Magnetic field along the Y-axis ${magSensor.y} Magnetic field along the Z-axis ${magSensor.z}`;
// });
// magSensor.start();
