const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts); //anytime someone tries to get posts we send them all posts from posts object on line 9
});

app.post('/events', (req, res) => { //endpoint that receives events from our event bus
  const { type, data } = req.body; //the event that we care about

  if (type === 'PostCreated') {
    const { id, title } = data; //if post created true take id and title out of data and insert into posts object on line 9

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;

    const post = posts[postId]; //find appropriate post in our posts object
    post.comments.push({ id, content })
  }

  res.send({});

});

app.listen(4002, () => {
  console.log('Listening on 4002');
});
