const express = require('express');
const app = express();
const cors = require('cors');
const authentication = require('./passport');
const authRouter = require('./routes/authRouter');
const postsRouter = require('./routes/postsRouter');
const usersRouter = require('./routes/usersRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(authentication);

app.use("/", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.listen(3000);