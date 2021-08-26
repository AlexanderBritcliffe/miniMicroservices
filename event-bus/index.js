const express = require('express');
const bodyParser = require('body-parser');
const axios = require ('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body; //body can be anything all we know is we will send it off to different running services

  axios.post('http://localhost:4000/events', event); //sending off each event to each service
  axios.post('http://localhost:4001/events', event);
  axios.post('http://localhost:4002/events', event);

  res.send({ status: 'OK'});
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
