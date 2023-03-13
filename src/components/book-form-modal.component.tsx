import {Bookcase, Shelf} from "@/components/model/prisma-extended-types.model";
import {Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {lookupBookByIdent} from "@/handler/open-api.handler";
import {book} from "@prisma/client";

export type Override<T1, T2> = Omit<T1, keyof  T2> & T2;

type searchBookOverride = Override<book, { shelf_id: string|number|undefined, subtitle: string|undefined, bookcase_id: string|undefined }>
export type searchBook = Omit<searchBookOverride, keyof {id: number}>

const BLANK_BOOK:searchBook = {
    identifier: "",
    identifier_type: "ISBN",
    title: "",
    subtitle: "",
    authors: "",
    thumbnailUrl: "",
    bookcase_id: "",
    shelf_id: ""
}

type BookFormModalProps = {
    show:boolean,
    bookcases:Bookcase[],
    shelves:Shelf[],
    onHide: Function,
    reloadBooks: Function
}

export default function BookFormModal(props:BookFormModalProps) {
    const [book, setBook] = useState(BLANK_BOOK)

    const setBookField = (event: React.ChangeEvent<HTMLSelectElement|HTMLInputElement|HTMLTextAreaElement>) => {
        let newBook = Object.assign({}, book, {[event.target.name]: event.target.value});
        if(event.target.name === "shelf_id") {
            newBook.shelf_id = parseInt(event.target.value)
        }
        setBook(newBook);
    }

    const lookupBook = () => {
        lookupBookByIdent(book.identifier, book.identifier_type).then(foundBook => {
            if(foundBook) {
                let newBook = Object.assign({}, foundBook, {bookcase_id: undefined, shelf_id: undefined})
                setBook(newBook)
            }
        })
    }

    const saveBook = (ignored:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let bookToSave = Object.assign({}, book)
        delete bookToSave.bookcase_id
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data: bookToSave})
        }
        fetch('/api/books/', requestOptions).then(r => r.json()).then(() => {
            props.onHide(false)
            props.reloadBooks()
        })
    }
    return (
        <Modal
            show={props.show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => {setBook(BLANK_BOOK)}}
            onHide={() => props.onHide(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Book
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container-fluid" id="new-book-form">
                    <div className="row pb-1">
                        <div className="col-6 pe-1">
                            <Form.Control type="text" name="identifier" value={book.identifier} placeholder={['OTHER', ''].includes(book.identifier_type) ? 'Identifier' : book.identifier_type }
                                          onChange={setBookField}/>
                        </div>
                        <div className="col-3 px-1">
                            <Form.Select name="identifier_type" value={book.identifier_type}
                                         placeholder="identifier_type" onChange={setBookField}>
                                <option value="">Type</option>
                                <option>ISBN</option>
                                <option>LCCN</option>
                                <option>OLID</option>
                                <option>OTHER</option>
                            </Form.Select>
                        </div>
                        <div className="col-3 d-grid ps-1">
                            <Button variant="outline-dark" onClick={lookupBook} disabled={book.identifier_type === "OTHER"}>Lookup</Button>
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <Form.Control type="text" placeholder="Title" name="title" value={book.title}
                                          onChange={setBookField}/>
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <Form.Control type="text" placeholder="Subtitle" name="subtitle" value={book.subtitle}
                                          onChange={setBookField}/>
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <Form.Control type="text" placeholder="Authors" name="authors" value={book.authors}
                                          onChange={setBookField}/>
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <Form.Control type="text" placeholder="Thumbnail Link" name="thumbnailUrl"
                                          value={book.thumbnailUrl} onChange={setBookField}/>
                        </div>
                    </div>
                    <div className="row py-1">
                        <Form.Group className="col-6">
                            <Form.Label>Bookcase</Form.Label>
                            <Form.Select value={book.bookcase_id} name="bookcase_id" onChange={setBookField}>
                                <option></option>
                                {props.bookcases.map(bookcase => (
                                    <option key={bookcase.id} value={bookcase.id}>{bookcase.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-6">
                            <Form.Label>Shelf</Form.Label>
                            <Form.Select value={book.shelf_id} name="shelf_id" onChange={setBookField}>
                                <option></option>
                                {props.shelves.filter(shelf => book.bookcase_id && shelf?.bookcase_id === parseInt(book.bookcase_id)).map(shelf => (
                                    <option key={shelf.id} value={shelf.id}>{shelf.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={() => props.onHide(false)}>Cancel</Button>
                <div className="vr"/>
                <Button variant="outline-success" onClick={saveBook} form="new-book-form">Save</Button>
            </Modal.Footer>
        </Modal>
    )
}