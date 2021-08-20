const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};  //stores all comments

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; //this will give us an array or undefined if we have never had a comment created associated with the post before

  comments.push({ id: commentId, content }); //content is the content the user just provided

  commentsByPostId[req.params.id] = comments; //assigns comments array back to given post inside commentsByPostId object

  res.status(201).send(comments);  //send back entire array of comments
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
