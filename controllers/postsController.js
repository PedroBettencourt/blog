const db = require('../prisma/queries');
const { body, validationResult } = require("express-validator");

async function postsGet(req, res) {
    const posts = await db.getAllPosts();
    res.json(posts);
};

function postNewGet(req, res) {
    //hmm
};

const postNewPost = [
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
        // Validate fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        const { title, text, published } = req.body;
        const post = await db.createPost(title, text, published);
        // req.user.id hmmm -- also missing user authentication
        res.redirect(`/users/${req.user.id}/${post.id}`);
    }
];


module.exports = { postsGet, postNewGet, postNewPost };