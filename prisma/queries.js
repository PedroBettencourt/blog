const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function getAllPosts() {
    const posts = await prisma.post.findMany();
    return posts;
};

async function getUser(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } , include: { posts: true, comments: true } });
    return user;
};

async function getPost(postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    return post;
}

async function updatePost(postId) {
    const post = await prisma.post.update({ where: { id: postId }, data: { title: title, text: text }});
    return post;
}

module.exports = { prisma, getAllPosts, getUser, getPost, updatePost };