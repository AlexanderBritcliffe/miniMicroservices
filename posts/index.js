const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto'); //this generates new id to posts user is trying to create
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {} //stores every post that we create (no database)

app.get('/posts', (req, res) => { //someone makes get request to /posts we send all posts
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body; //title that the user just send to us in new post

  posts[id] = { //associates id and the title with posts[id]
    id, title
  };

  await axios.post('http://localhost:4005/events', { //after someone tries to make a post we post this event to event endpoint
    type: 'PostCreated',
    data: {
      id, title
    }
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {

  res.send({});
});

app.listen(4000, () => {
  console.log('Listening on 4000!');
})
