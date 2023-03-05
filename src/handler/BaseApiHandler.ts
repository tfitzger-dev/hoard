// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from "@prisma/client";

const prismaClient:any = new PrismaClient()

type ApiError = {
    error: string
}

export class BaseApiHandler<T>{
    private model:string
    private readonly modelId: string
    private readonly includeArgs:{}

    private modelClient:any
    constructor(model:string, includeArgs:{} = {}) {
        this.model = model
        this.modelId = `${model.toLowerCase()}Id`
        this.includeArgs = includeArgs
        this.handleBaseResourceUrls = this.handleBaseResourceUrls.bind(this)
        this.handleIndividualResourceUrls = this.handleIndividualResourceUrls.bind(this)
        this.modelClient = prismaClient[model];
    }

    async handleBaseResourceUrls(req: NextApiRequest, res: NextApiResponse<T[]|T|ApiError>) {
        switch(req.method) {
            case 'GET':
                const queryArgs:any = {}
                if(Object.keys(this.includeArgs).length > 0) {
                    queryArgs['include'] = this.includeArgs
                }
                res.status(200).json(await this.modelClient.findMany(queryArgs))
                break
            case 'POST':
                try {
                    const created = await this.modelClient.create(req.body)
                    res.status(201).json(created)
                }
                catch(err) {
                    let errMessage:ApiError = {error: ""}
                    if(err instanceof Error) {
                        errMessage.error = err.message
                    }
                    res.status(400).json(errMessage)
                }
                break
            default:
                res.status(405).json({error: `Method '${req.method} ${req.url}' is not allowed`})
        }
    }

    async handleIndividualResourceUrls(req: NextApiRequest, res: NextApiResponse<T[]|T|ApiError>) {
        let id:number = parseInt(<string>req.query[this.modelId]);
        if(isNaN(id)) {
            res.status(400).json({error: `Invalid parameter for ${this.modelId} provided: ${req.query[this.modelId]}`})
        }

        switch(req.method) {
            case 'GET':
                const queryArgs:any = {where: {id}}
                if(Object.keys(this.includeArgs).length > 0) {
                    queryArgs['include'] = this.includeArgs
                }
                res.status(200).json(await this.modelClient.findUnique(queryArgs))
                break
            case 'PUT':
                try {
                    const updated = await this.modelClient.update({
                        where: {id},
                        data: req.body
                    })
                    res.status(204).json(updated)
                }
                catch(err) {
                    let errMessage:ApiError = {error: ""}
                    if(err instanceof Error) {
                        errMessage.error = err.message
                    }
                    res.status(400).json(errMessage)
                }
                break
            case 'DELETE':
                try {
                    const deleted = await this.modelClient.delete({
                        where: {id}
                    })
                    res.status(204).json(deleted)
                }
                catch(err) {
                    let errMessage:ApiError = {error: ""}
                    if(err instanceof Error) {
                        errMessage.error = err.message
                    }
                    res.status(400).json(errMessage)
                }
                break
            default:
                res.status(405).json({error: `Method '${req.method} ${req.url}' is not allowed`})
        }

    }

}