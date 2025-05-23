const db = require('../prisma/queries');
const { body, validationResult } = require("express-validator");

async function postsGet(req, res) {
    const posts = await db.getAllPosts();
    res.json(posts);
};

const postNewPost = [
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
        // Check if user is an author
        if (!req.user.author) return res.json({ message: "Only authors can create posts" });

        // Validate fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        // Create post
        const { title, text } = req.body;
        const published = (req.body.published !== null) ? true : false;

        const post = await db.createPost(req.user.id, title, text, published);
        res.json({ post: post });
    }
];


module.exports = { postsGet, postNewPost };