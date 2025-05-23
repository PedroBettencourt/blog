const express = require('express');
const postsRouter = express.Router();
const postsController = require('../controllers/postsController');
const passport = require('passport');

postsRouter.get("/", postsController.postsGet);
postsRouter.post("/new", 
                        passport.authenticate("jwt", { session: false }),
                        postsController.postNewPost);

module.exports = postsRouter;