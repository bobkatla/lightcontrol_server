const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topic_root = `/lightchange/west`;
const topic0 = topic_root + '/0';
const topic1 = topic_root + '/1';

client.on('connect', () => {
    client.subscribe([topic0, topic1]);
    console.log('mqtt connected');
});

client.on('message', (topic, message) => {
    if(topic.substring(topic_root.length+1) === '0') {
        console.log("inside 0");
        if (message.toString() === "true") {
            console.log("it's true")
        } else {
            console.log("it's false")
        }
    }
    if(topic.substring(topic_root.length+1) === '1') {
        console.log("inside 1");
        if (message.toString() === "true") {
            console.log("it's true")
        } else {
            console.log("it's false")
        }
    }
});