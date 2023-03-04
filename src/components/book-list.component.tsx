import React, {useState} from 'react';
import {Form, Button, Pagination} from "react-bootstrap";
import {Bookcase, Shelf, Book} from "@/components/model/prisma-extended-types.model";
import BookCard from "@/components/book-card.component";

type BookListProps = {
    bookcases: Bookcase[],
    shelves: Shelf[],
    books: Book[]
}

export default function BookList(props: BookListProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(30)

    const maxPages = () => {
        return Math.ceil(props.books.length / pageSize)
    }

    const updatePage = (newPage:number) => {
        if (!isNaN(newPage)) {
            setPage(Math.min(Math.max(0, newPage), maxPages()));
        }
    }

    return (
        <>
            <div className="row pt-3">
                <div className="col-8 offset-2 text-center">
                    <Pagination className="d-inline-flex">
                        <Pagination.First onClick={() => {
                            setPage(1)
                        }} disabled={page === 1}/>
                        <Pagination.Prev onClick={() => {
                            updatePage(page - 1)
                        }} disabled={page === 1}/>
                        <li>
                            <label id="paginationInputLabel" htmlFor="paginationInput"
                                   className="col-form-label me-2 ms-1">Page</label>
                        </li>
                        <li>
                            <Form.Control id="paginationInput" type="text" inputMode="numeric" pattern="[0-9]*"
                                          value={page} onChange={(event) => {
                                updatePage(parseInt(event.target.value))
                            }} style={{width: "3.5rem"}}/>
                        </li>
                        <li>
                            <span id="paginationDescription"
                                  className="col-form-label text-nowrap px-2 d-inline-block">of {maxPages()}</span>
                        </li>
                        <Pagination.Next onClick={() => {
                            updatePage(page + 1)
                        }} disabled={page === maxPages()}/>
                        <Pagination.Last onClick={() => {
                            setPage(maxPages())
                        }} disabled={page === maxPages()}/>
                    </Pagination>
                </div>
                <div className="col-2">
                    <select className="form-select" value={pageSize} onChange={(event) => {
                        setPageSize(parseInt(event.target.value))
                    }}>
                        <option value="15">15 per page</option>
                        <option value="30">30 per page</option>
                        <option value="45">45 per page</option>
                        <option value="60">60 per page</option>
                        <option value={props.books.length}>All</option>
                    </select>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-6">
                {
                    props.books.slice((page - 1) * pageSize, page * pageSize).map((book:Book) => (
                        <div key={book.id} className="col d-flex align-items-stretch">
                            <BookCard book={book} />
                        </div>
                    ))
                }
            </div>
        </>
    )
}