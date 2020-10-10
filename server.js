const cors = require('cors');

// express.js connect later
const express = require('express');
const app = express();

// middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

// set up mqtt
const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// set up mongo
const mongoose = require('mongoose');
const monConnOnline = mongoose.createConnection(
    "mongodb+srv://bobkatla:conmeocon1@sit314.jhepn.mongodb.net/sit314?retryWrites=true&w=majority", 
      { useNewUrlParser: true, useUnifiedTopology: true});
const onlModel = monConnOnline.model('Light', new mongoose.Schema({
    id: Number,
    name: String,
    area: String,
    state: Boolean
}));

app.get('/', (req, res) => {res.json('it is working');});

// for admin work of adding new light
app.post('/add', (req, res) => {
    const {id, name, area} = req.body;

    onlModel.find({id}, (err, docs) => {
      if(err) {
        console.log(err);
      } else {
        if(docs.length === 0){
          const newLight = new onlModel({
              id,
              name,
              area,
              state: false
          });
      
          newLight.save().then(doc => {
              // console.log(doc);
              res.status(200).json("successfully added new light")
          }).catch(err => res.status(400).json('error adding light'));
        } else {
          res.status(400).json("the id already existed");
        }
      }
    });
});

// get all lights
app.get('/getall', (req, res) => {
    onlModel.find({}, (err, docs) => {
        if(err) {
            console.log(err);
          } else {
            if(docs.length === 0){
              res.status(400).json("list is empty");
            } else {
              res.status(200).json(docs);
            }
          }
    });
});

app.get('/get/:id', (req, res) => {
    const {id} = req.params;
    
    onlModel.find({id}, (err, docs) => {
        if(err) {
            console.log(err);
          } else {
            if(docs.length === 0){
              res.status(400).json("list is empty");
            } else {
              res.status(200).json(docs[0]);
            }
          }
    });
});

// switch the light
app.put('/switch', (req, res) => {
    const {id} = req.body;

    onlModel.find({id}, (err, docs) => {
        if(err) {
          console.log(err);
        } else {
          if(docs.length === 0){
            res.status(400).json("error light does not exist");
          } else {
            docs[0].state = !docs[0].state;
            onlModel.updateOne({id}, {state: docs[0].state})
            .then(() => {
                const topic = `/lightchange/${docs[0].area}/${id}`;
                console.log(topic);
                client.publish(topic, docs[0].state.toString(), () => console.log("published"));
                res.status(200).json("switched the light ok");
            });
          }
        }
      });
});

// run on port 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
