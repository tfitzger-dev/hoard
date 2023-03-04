// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {book, PrismaClient} from "@prisma/client";
import {BaseApiHandler} from "@/handler/BaseApiHandler";


const apiHandler = new BaseApiHandler<book>('bookcase')
export default apiHandler.handleIndividualResourceUrls
