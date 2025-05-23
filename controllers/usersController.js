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
            .matches(/^[A-Za-z0-9._ ]+$/).withMessage("Text cannot contain those characters"),
        body("published")
            //hmm
    ],
    async(req, res) => {
        // Check if post exists
        const postId = parseInt(req.params.postId);
        const post = await db.getPost(postId);
        if (!post) return res.status(400).json({ message: "Post does not exist" });

        // Validate fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        // Update post
        const { title, text, published } = req.body;
        const newPost = await db.updatePost(title, text, published);
        res.json({ post: postNew });
    },
];

async function postDelete(req, res) {

};

async function newCommentPost(req, res) {

};

async function commentPut(req, res) {

};

async function commentDelete(req, res) {

};

module.exports = { userGet, userPostsGet, userCommentsGet, postGet, postPut, postDelete, 
                    newCommentPost, commentPut, commentDelete }