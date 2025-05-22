const express = require('express');
const postsRouter = express.Router();
const postsController = require('../controllers/postsController');

postsRouter.get("/", postsController.postsGet);
postsRouter.post("/new", postsController.postNewPost);

module.exports = postsRouter;