const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const postsRouter = require('./routes/postsRouter');
const usersRouter = require('./routes/usersRouter');
const passport = require('passport');
const initPassport = require('./passport');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
initPassport(app);

app.use("/", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.get(
    "/protected", 
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        res.send(req.user);
    }
);

app.listen(3000);