const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const id = 0;
const topic = `/lightchange/${id}`;

client.on('connect', () => {
    client.subscribe(topic);
    console.log('mqtt connected');
});

client.on('message', (topic, meg) => {
    console.log("message is " + meg);
})