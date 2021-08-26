const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => { //this is where we deal with incoming events
  const event = req.body; //this is the event we receive

  events.push(event); //pushing all events into events array


  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "OK" });
});

app.get('/events', (req, res) => {  //if anyone makes request to /events we send big list of events
  res.send(events);
})

app.listen(4005, () => {
  console.log("Listening on 4005");
});
