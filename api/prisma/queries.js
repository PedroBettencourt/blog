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

async function createPost(postId, title, text, published) {
    const post = await prisma.post.create({ where: { id: postId }, data: { title: title, text: text, published: published }});
}

async function getPost(postId) {
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { comments: true } });
    return post;
};

async function updatePost(postId, title, text, published) {
    const post = await prisma.post.update({ where: { id: postId }, data: { title: title, text: text, published: published }});
    return post;
};

async function deletePost(postId) {
    const deletedPost = await prisma.post.delete( { where: { id: postId } });
    return deletedPost;
};

async function createComment(text, userId, postId) {
    const newComment = await prisma.comment.create({ data: { text: text, authorId: userId, postId: postId } });
    return newComment;
};

async function getComment(commentId) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    return comment;
};

async function updateComment(commentId, text) {
    const updatedComment = await prisma.comment.update({ where: { id: commentId }, data: { text: text } });
    return updatedComment;
};

async function deleteComment(commentId) {
    const deletedComment = await prisma.comment.delete({ where: { id: commentId } });
    return deletedComment;
}

module.exports = { prisma, getAllPosts, getUser, createPost, getPost, updatePost, deletePost, createComment, getComment, updateComment, deleteComment };