const express = require('express');
const app = express();
const postsRouter = require('./routes/postsRouter');
const usersRouter = require('./routes/usersRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", postsRouter);
//app.use("/users", usersRouter);

app.listen(3000);