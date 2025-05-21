const express = require('express');
const app = express();

app.listen(3000);


import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()