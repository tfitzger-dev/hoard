import '@/styles/vapor.min.css'
import type { AppProps } from 'next/app'
import {Container, Nav, Navbar} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Head from 'next/head';
import AppNav from "@/components/app-nav.component";
import BookListFilterForm from "@/components/book-list-filter.component";
import BookList from "@/components/book-list.component";
import {Bookcase, Shelf, Book} from "@/components/model/prisma-extended-types.model";
import {filter} from "dom-helpers";
import {fullTitle} from "@/components/book-card.component";
import BookFormModal from "@/components/book-form-modal.component";


export default function App() {
    const [modalShow, setModalShow] = useState(false);
    const [bookcases, setBookcases] = useState<Bookcase[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [books, setBooks] = useState<Book[]>([])

    const [bookcaseFilterIdx, setBookcaseFilterIdx] = useState<number>(-1)
    const [shelfFilterIdx, setShelfFilterIdx] = useState<number>(-1)
    const [titleFilter, setTitleFilter] = useState("")
    const [authorFilter, setAuthorFilter] = useState("")
    const [identifierFilter, setIdentifierFilter] = useState("")

    useEffect(() => {
        fetchBookcases();
        fetchShelves();
        fetchBooks();
    }, [])

    const fetchBookcases = () => {
        fetch("/api/bookcases/")
            .then(res => res.json())
            .then(
                (result) => {
                    setBookcases(result)
                }
            )
    }

    const fetchShelves = () => {
        fetch("/api/shelves/")
            .then(res => res.json())
            .then(
                (result) => {
                    setShelves(result)
                }
            )
    }
    const fetchBooks = () => {
        fetch("/api/books/")
            .then(res => res.json())
            .then(
                (result) => {
                    setBooks(result)
                }
            )
    }

    const filteredBooks = () => {
        return books.filter(book => {
            return [book.shelf.bookcase.id, -1].includes(bookcaseFilterIdx) &&
                [book.shelf.id, -1].includes(shelfFilterIdx) &&
                fullTitle(book).toUpperCase().includes(titleFilter.toUpperCase()) &&
                book.authors.toUpperCase().includes(authorFilter.toUpperCase()) &&
                book.identifier.toUpperCase().includes(identifierFilter.toUpperCase())
        })
    }

  return(
          <Container fluid="true">
              <AppNav setModalShow={setModalShow} />
              <BookListFilterForm
                  bookcases={bookcases}
                  shelves={shelves}
                  bookcaseFilterIdx={bookcaseFilterIdx}
                  shelfFilterIdx={shelfFilterIdx}
                  setAuthorFilter={setAuthorFilter}
                  setBookcaseFilterIdx={setBookcaseFilterIdx}
                  setIdentifierFilter={setIdentifierFilter}
                  setShelfFilterIdx={setShelfFilterIdx}
                  setTitleFilter={setTitleFilter}
              />
{/*              <h3>Bookcase Filter: {bookcaseFilterIdx}</h3>
              <h3>Shelf Filter: {shelfFilterIdx}</h3>
              <h3>Title Filter: {titleFilter}</h3>
              <h3>Author Filter: {authorFilter}</h3>
              <h3>Identifier Filter: {identifierFilter}</h3>*/}
              <BookList
                  bookcases={bookcases}
                  shelves={shelves}
                  books={filteredBooks()}
                  reloadBooks={fetchBooks}
              />
              <BookFormModal
            show={modalShow}
            bookcases={bookcases}
            shelves={shelves}
            onHide={setModalShow}
            reloadBooks={fetchBooks}
        />
          </Container>

  )
}
