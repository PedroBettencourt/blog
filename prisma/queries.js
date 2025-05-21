const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function getAllPosts() {
    const posts = await prisma.post.findMany();
    return posts;
}

module.exports = { getAllPosts };