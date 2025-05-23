const bcrypt = require("bcryptjs");
const prisma = require("../prisma/queries").prisma;
const { body, validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");
require('dotenv').config();

const validateUser = [
    body("username").trim()
        .notEmpty().withMessage("Username cannot be empty")
        .matches(/^[A-Za-z0-9._]+$/).withMessage("Username cannot contain those characters"),
    body("password").trim()
        .notEmpty().withMessage("Password cannot be empty")
        .matches(/^[A-Za-z0-9._]+$/).withMessage("Password cannot contain those characters"),
    body("passwordRepeat").trim()
        .notEmpty().withMessage("Password cannot be empty")
        .matches(/^[A-Za-z0-9._]+$/).withMessage("Password cannot contain those characters"),

];

const registerPost = [
    validateUser,
    async (req, res) => {
        // Validate fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password, passwordRepeat, type } = req.body;

        // Check if username already exists
        const user = await prisma.user.findUnique( { where: { username: username } });
        if (user) return res.status(400).json({ errors: "Username already exists" });

        // Check if passwords match
        if (password !== passwordRepeat ) {
            return res.status(400).json({ errors: "Passwords don't match" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({ data: { username: username, password: hashedPassword, } });
            return res.json({ message: `${username} account has been created`});
        } catch (err) {
            return res.json({ errors: err });
        }
    }
];

async function loginPost(req, res) {
    try {
        const user = await prisma.user.findUnique({ where: { username: req.body.username } });
        if (!user) return res.json({ message: "Username does not exist" });

        const pass = await bcrypt.compare(req.body.password, user.password);
        if (!pass) return res.json({ message: "Wrong password" });

        const token = sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await res.json({ token: token, username: user.username });
    } catch (err) {
        return res.json({ errors: err });
    }
};

module.exports = { registerPost, loginPost };