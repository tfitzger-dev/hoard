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

    const createPaginationItem = (i:number):JSX.Element => {
        return <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
            {i}
        </Pagination.Item>
    }

    const createPaginationItems = ():JSX.Element[] => {
        let items:JSX.Element[] = []
        let maxPage = maxPages();
        let maxPageItem = createPaginationItem(maxPage);
        items.push(createPaginationItem(1))
        if(maxPage <= 6) {
            for(let i = 2; i <= 6; i++) {
                if(i <= maxPage) {
                    items.push(createPaginationItem(i))
                }
            }
        }
        else if(maxPage - page <= 3) {
            items.push(<Pagination.Ellipsis key={-4}/>)
            for(let i = maxPage - 4; i <= maxPage; i++) {
                items.push(createPaginationItem(i))
            }
        }
        else if(page < 5) {
            for(let i = 2; i < 6; i++) {
                if(i <= maxPage) {
                    items.push(createPaginationItem(i))
                }
            }
            if(items.length == 5) {
                if(maxPage > 6) {
                    items.push(<Pagination.Ellipsis key={-4}/>)
                }
                items.push(maxPageItem);
            }
        }
        else if(page >= 5){
            items.push(<Pagination.Ellipsis key={-3} />)
            for(let i = page - 1; i <= page + 1; i++) {
                if(i <= maxPage) {
                    items.push(createPaginationItem(i))
                }
            }
            if(items.length == 5) {
                if(maxPage - page > 2) {
                    items.push(<Pagination.Ellipsis key={-4}/>)
                }
                items.push(maxPageItem);
            }
        }
        return items;
    }

    return (
        <>
            <div className="row pt-3">
                <div className="col-12 text-center">
                    <Pagination className="d-inline-flex" size={"sm"}>
                        <Pagination.Prev onClick={() => {
                            updatePage(page - 1)
                        }} disabled={page === 1}/>
                        {createPaginationItems()}
                        <Pagination.Next onClick={() => {
                            updatePage(page + 1)
                        }} disabled={page === maxPages()}/>
                        <li className="ps-3">
                            <select className="form-select" value={pageSize} onChange={(event) => {
                            setPageSize(parseInt(event.target.value))
                        }}>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                            <option value="60">60</option>
                            <option value={props.books.length}>All</option>
                        </select></li>
                    </Pagination>
                </div>
                <div className="col-3 offset-3 col-md-3">

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