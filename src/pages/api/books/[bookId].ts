// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {book, PrismaClient} from "@prisma/client";
import {BaseApiHandler} from "@/handler/BaseApiHandler";


const bookApiHandler = new BaseApiHandler<book>('book', {shelf: {include: {bookcase: true}}})
export default bookApiHandler.handleIndividualResourceUrls
