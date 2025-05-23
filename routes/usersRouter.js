const express = require('express');
const usersRouter = express.Router();
const usersController = require('../controllers/usersController');
const passport = require('passport')

 usersRouter.get("/:userId", usersController.userGet);
// Maybe edit and delete?

usersRouter.get("/:userId/posts", usersController.userPostsGet);

usersRouter.get("/:userId/comments", usersController.userCommentsGet);


usersRouter.get("/:userId/:postId", usersController.postGet);

usersRouter.put("/:userId/:postId", 
                    passport.authenticate("jwt", { session: false }), 
                    usersController.postPut);

usersRouter.delete("/:userId/:postId", 
                    passport.authenticate("jwt", { session: false }), 
                    usersController.postDelete);


usersRouter.post("/:userId/:postId/newcomment", 
                    passport.authenticate("jwt", { session: false }), 
                    usersController.newCommentPost);

usersRouter.put("/:userId/:postId/:commentId", 
                    passport.authenticate("jwt", { session: false }), 
                    usersController.commentPut);
                    
usersRouter.delete("/:userId/:postId/:commentId", 
                    passport.authenticate("jwt", { session: false }), 
                    usersController.commentDelete);

module.exports = usersRouter;