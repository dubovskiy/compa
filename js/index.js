import cities from '../data/cities.json' assert {type: 'json'};
let active = null;
const buttons = document.querySelectorAll('.buttonsWrapper button');



const acl = new Accelerometer({ frequency: 60 });
acl.addEventListener("reading", () => {
    console.log(`Acceleration along the X-axis ${acl.x}`);
    console.log(`Acceleration along the Y-axis ${acl.y}`);
    console.log(`Acceleration along the Z-axis ${acl.z}`);
});




// const options = { frequency: 60, referenceFrame: "device" };
// const sensor = new AbsoluteOrientationSensor(options);
//
// sensor.addEventListener("reading", () => {
//     // model is a Three.js object instantiated elsewhere.
//     console.log(sensor);
// });

start()


Promise.all([
    navigator.permissions.query({ name: "accelerometer" }),
    navigator.permissions.query({ name: "magnetometer" }),
    navigator.permissions.query({ name: "gyroscope" }),
]).then((results) => {
    if (results.every((result) => result.state === "granted")) {

        function start () {
            console.log('start')
        }

        buttons.forEach((button) => {
            button.addEventListener('click', function (e) {
                const activeItem = document.querySelector('.buttonsWrapper .active');
                if (activeItem === this) {
                    active = '';
                    this.classList.remove('active');
                    acl.stop();
                } else {
                    active = this.innerHTML;
                    this.classList.add('active');
                    activeItem.target.classList.remove('active');
                    acl.start();
                }
            })
        })



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
