// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {book} from "@prisma/client";
import {BaseApiHandler} from "@/handler/BaseApiHandler";


const apiHandler = new BaseApiHandler<book>('bookcase')
export default apiHandler.handleIndividualResourceUrls
