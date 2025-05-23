const db = require("../prisma/queries");
const { body, validationResult } = require("express-validator");

async function userGet(req, res) {
    const userId = parseInt(req.params.userId);
    const user = await db.getUser(userId);
    
    if (!user) return res.status(400).json({ message: "User does not exist" });
    res.json({ username: user.username, author: user.author, posts: user.posts, comments: user.comments });
};

// The next 2 are kinda redundant
async function userPostsGet(req, res) {
    const userId = parseInt(req.params.userId);
    const user = await db.getUser(userId);
    
    if (!user) return res.status(400).json({ message: "User does not exist" });
    res.json({ username: user.username, posts: user.posts });
};

async function userCommentsGet(req, res) {
    const userId = parseInt(req.params.userId);
    const user = await db.getUser(userId);
    
    if (!user) return res.status(400).json({ message: "User does not exist" });
    res.json({ username: user.username, comments: user.comments });
};

async function postGet(req, res) {
    const postId = parseInt(req.params.postId);
    const post = await db.getPost(postId);
    
    if (!post) return res.status(400).json({ message: "Post does not exist" });
    res.json({ post: post });
};

const postPut = [
    [
        body("title").trim()
            .notEmpty().withMessage("Title cannot be empty")
            .matches(/^[A-Za-z0-9._ ]+$/).withMessage("Title cannot contain those characters"),
        body("text").trim()
            .notEmpty().withMessage("Text cannot be empty")
            .matches(/^[A-Za-z0-9._ !]+$/).withMessage("Text cannot contain those characters"),
        body("published")
            //hmm
    ],
    async(req, res) => {
        // Check if post exists
        const postId = parseInt(req.params.postId);
        const post = await db.getPost(postId);
        if (!post) return res.status(400).json({ message: "Post does not exist" });

        // Check if user can edit post
        const userId = parseInt(req.user.id);
        if (post.authorId !== userId) return res.status(400).json({ message: "Only the author can edit their posts" });

        // Validate fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        
        // Update post
        const { title, text } = req.body;
        const published = (req.body.published !== null) ? true : false;

        const newPost = await db.updatePost(postId, title, text, published);
        res.json({ post: newPost });
    },
];

async function postDelete(req, res) {
    // Check if post exists
    const postId = parseInt(req.params.postId);
    const post = await db.getPost(postId);
    if (!post) return res.status(400).json({ message: "Post does not exist" });

    // Check if user can edit post
    const userId = parseInt(req.user.id);
    if (post.authorId !== userId) return res.status(400).json({ message: "Only the author can delete their posts" });

    // Delete post
    const deletedPost = await db.deletePost(postId);
    res.json({ post: deletedPost });
};

const validateComment = [
    body("text").trim()
        .notEmpty().withMessage("Text cannot be empty")
        .matches(/^[A-Za-z0-9._ !]+$/).withMessage("Text cannot contain those characters"),
];

const newCommentPost = [
    validateComment,
    async(req, res) => {
        // Validate fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        };

        // Get fields
        const { text } = req.body;
        const postId = parseInt(req.params.postId);
        const userId = parseInt(req.user.id);

        // Create comment
        const newComment = await db.createComment(text, userId, postId);
        res.json({ comment: newComment });
    },
];

const commentPut = [
    validateComment,
    async(req, res) => {
        // Check if comment exists
        const commentId = parseInt(req.params.commentId);
        const comment = await db.getComment(commentId);
        if (!comment) return res.status(400).json({ message: "Comment does not exist" });

        // Check if user can edit comment
        const userId = parseInt(req.user.id);
        if (comment.authorId !== userId) return res.status(400).json({ message: "Only the author can edit their comments" });

        // Validate fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        };

        // Get fields
        const { text } = req.body;

        // Create comment
        const updatedComment = await db.updateComment(commentId, text);
        res.json({ comment: updatedComment });
    },
];

async function commentDelete(req, res) {
    // Check if comment exists
    const commentId = parseInt(req.params.commentId);
    const comment = await db.getComment(commentId);
    if (!comment) return res.status(400).json({ message: "Comment does not exist" });
    
    // Check if user can delete comment
    const userId = parseInt(req.user.id);
    if (comment.authorId !== userId) return res.status(400).json({ message: "Only the author can delete their comments" });

    // Delete comment
    const deletedComment = await db.deleteComment(commentId);
    res.json({ comment: deletedComment });
};

module.exports = { userGet, userPostsGet, userCommentsGet, postGet, postPut, postDelete, 
                    newCommentPost, commentPut, commentDelete }