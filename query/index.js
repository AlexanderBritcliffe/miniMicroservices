const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data; //if post created true take id and title out of data and insert into posts object on line 9

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId]; //find appropriate post in our posts object
    post.comments.push({ id, content, status })
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts); //anytime someone tries to get posts we send them all posts from posts object on line 9
});

app.post('/events', (req, res) => { //endpoint that receives events from our event bus
  const { type, data } = req.body; //the event that we care about

  handleEvent(type, data);

  res.send({});

});

app.listen(4002, async () => {
  console.log('Listening on 4002');

try {
  const res = await axios.get('http://localhost:4005/events');  //this will give us all; events that have occured over time

  for (let event of res.data) {
    console.log('Processing event:', event.type);

    handleEvent(event.type, event.data);
      }
    } catch (error) {
      console.log(error.message);
  }
});
