// const express = require('express');
// const bodyParser = require('body-parser');
// const { randomBytes } = require('crypto');
// const cors = require('cors');
// const axios = require('axios');
//
// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
//
// const commentsByPostId = {};  //stores all comments
//
// app.get('/posts/:id/comments', (req, res) => {
//   res.send(commentsByPostId[req.params.id] || []);
// });
//
// app.post('/posts/:id/comments', async (req, res) => {
//   const commentId = randomBytes(4).toString('hex');
//   const { content } = req.body; //this is the content of the comment or comment itself
//
//   const comments = commentsByPostId[req.params.id] || []; //this will give us an array or undefined if we have never had a comment created associated with the post before
//   //req.params.id is checking for comments associated with the id in commentsByPostId object on line 11
//   comments.push({ id: commentId, content, status: 'pending' }); //content is the content the user just provided and id being pushed into comments array on line 21
//
//   commentsByPostId[req.params.id] = comments; //assigns comments array back to given post inside commentsByPostId object
//
//   await axios.post('http://localhost:4005/events', { //after we add comment into array we post event
//     type: 'CommentCreated',
//     data: {
//       id: commentId,
//       content,
//       postId: req.params.id,
//       status: 'pending'
//     }
//   });
//
//   res.status(201).send(comments);  //send back entire array of comments
// });
//
// app.post('/events', async (req, res) => {  //this communicates event to necessary services (handles incoming events)
//   const { type, data } = req.body; //this is pulling off type and data from body
//
//   if (type === 'CommentModerated') {
//     const { postId, id, status, content } = data;
//     const comments = commentsByPostId[postId];
//
//     const comment = comments.find(comment => {
//       return comment.id === id;  //is comment id equal to id from the event on line 44
//     });
//
//     comment.status = status; //status is equal to the status on line 44
//
//     await axios.post('http://localhost:4005', {
//       type: 'CommentUpdated',
//       data: {
//         id,
//         status,
//         postId,
//         content
//       }
//     })
//   }
//
//   res.send({});
// })
//
// app.listen(4001, () => {
//   console.log('Listening on 4001');
// });


const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
