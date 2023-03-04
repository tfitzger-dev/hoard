import {Book} from "@/components/model/prisma-extended-types.model";
import {book} from "@prisma/client";
import {searchBook} from "@/components/book-form-modal.component";

export const baseOpenLibraryUrl:string = 'https://openlibrary.org'

const getMetadata = async (key:string, value:string) => {
    if(!['OCLC', 'ISBN', 'LCCN', 'OLID', 'OCAID'].includes(key)) {
        throw new Error("key must be one of OCLC, OLID, ISBN, OCAID, or LCCN")
    }

    let searchKey:string = `${key}:${value}`
    let searchPath = `${baseOpenLibraryUrl}/api/books.json?bibkeys=${searchKey}`
    let response = await fetch(searchPath).then(resp => resp.json())
    return response[searchKey]
}

const extractOlidFromUrl = (bookUrl: string, urlType:string) => {
    const olUrlPattern = new RegExp(`[/]${urlType}[/]([0-9a-zA-Z]+)`)
    var matches = olUrlPattern.exec(bookUrl)
    if(matches) {
        return matches[1]
    }
}

const getOlid = async (key:string, value:string) => {
    let metadata = await getMetadata(key, value);
    if(metadata) {
        let bookUrl = metadata['info_url']
        return extractOlidFromUrl(bookUrl, 'books')
    }
}

const getAuthors = async (authors:{key: string}[]) => {
    let authorDetails:string[] = []
    for (const author of authors) {
        let response = await fetch(`${baseOpenLibraryUrl}${author.key}.json`).then(resp => resp.json())
        if(response && ('name' in response)) {
            authorDetails.push(response.name)
        }
    }
    return authorDetails.join('; ')

}
export const lookupBookByIdent = async (identifier:string, identifierType:string):Promise<searchBook|undefined> => {
    let olid = await getOlid(identifierType, identifier)
    if(olid){
        let response = await fetch(`${baseOpenLibraryUrl}/books/${olid}.json`).then(resp => resp.json())
        if(response) {
            let foundBook:searchBook = {
                identifier,
                identifier_type: identifierType,
                title: ('title' in response) ? response.title : "",
                subtitle:('subtitle' in response) ? response.subtitle: "",
                authors: ('authors' in response) ? await getAuthors(response.authors) : "",
                thumbnailUrl: `https://covers.openlibrary.org/b/olid/${olid}-M.jpg`,
                shelf_id: undefined,
                bookcase_id: undefined
            }
            return foundBook
        }
    }
}