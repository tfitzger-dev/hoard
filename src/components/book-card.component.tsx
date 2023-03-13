import {Button, ButtonGroup, Card, FormSelect, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Book, Bookcase, Shelf} from "@/components/model/prisma-extended-types.model";
import ConfirmDeleteModal from "@/components/confirm-delete-modal.component";
import React, {useState,} from "react";
import Image from "next/image";
import {FaEdit, FaSave, FaTrashAlt, FaWindowClose} from "react-icons/fa";
import {book} from "@prisma/client";
import {Override} from "@/components/book-form-modal.component";

export type UpdateBook = Override<book, { id: number|undefined, shelf: Shelf|undefined }>

type BookCardProps = {
    book: Book,
    bookcases: Bookcase[],
    shelves: Shelf[],

    reloadBooks: Function
}

export const fullTitle = (book:Book):string => {
    const subtitle = (book.subtitle && book.subtitle !== "") ? `, ${book.subtitle}` : '';
    return `${book.title}${subtitle}`
}

export default function BookCard(props:BookCardProps) {
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newBookcase, setNewBookcase] = useState(props.book.shelf.bookcase_id);

    const truncatedText = (text:string, length:number) => {
        return (text.length > (length + 3)) ? `${text.substring(0, length)}...` : text
    }

    const saveBookUpdate = () => {
        let updateBook:UpdateBook = Object.assign({}, props.book)
        delete updateBook.id
        delete updateBook.shelf

        const requestOptions = {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updateBook)
        }
        fetch(`/api/books/${props.book.id}/`, requestOptions)
            .then(r => r.json)
            .then(ignored => {
                setEditing(false);
                props.reloadBooks()
            })
    }

    const updateBookcase = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let bookcaseId: number = parseInt(event.target.value)
        setNewBookcase(bookcaseId);
        let newShelfId:number|undefined = props.shelves.find(shelf => shelf.bookcase_id === bookcaseId)?.id;
        props.book.shelf_id = (newShelfId) ? newShelfId : props.book.shelf_id
    }

    const locationDisplay = () => {
        return editing ?
            (
                <>
                    <div className="row">
                        <div className="col-4"><strong>Case:</strong></div>
                        <div className="col-8">
                            <FormSelect size={"sm"} defaultValue={props.book.shelf.bookcase_id} onChange={updateBookcase} >
                                {props.bookcases.map(bookcase => (<option key={bookcase.id} value={bookcase.id}>{bookcase.name}</option>))}
                            </FormSelect>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4"><strong>Shelf:</strong></div>
                        <div className="col-8">
                            <FormSelect size={"sm"} defaultValue={props.book.shelf.id} onChange={(event) => {props.book.shelf_id = parseInt(event.target.value)}}>
                                {props.shelves.filter(shelf => shelf.bookcase_id === newBookcase).map(shelf => (<option key={shelf.id} value={shelf.id}>{shelf.name}</option>))}
                            </FormSelect>
                        </div>
                    </div>
                </>
            ):
            (
                <>
                    <div className="row">
                        <div className="col-4"><strong>Case:</strong></div>
                        <div className="col-8">{props.book.shelf.bookcase.name}</div>
                    </div>
                    <div className="row">
                        <div className="col-4"><strong>Shelf:</strong></div>
                        <div className="col-8">{props.book.shelf.name}</div>
                    </div>
                </>
            )
    }

    const createButtons = () => {
        return editing ?
            (
                <ButtonGroup className="float-end">
                    <Button variant="outline-success"
                            onClick={() => saveBookUpdate()}><FaSave /></Button>
                    <Button variant="outline-danger"
                            onClick={() => setEditing(false)}><FaWindowClose/></Button>

                </ButtonGroup>
            )
            : (
                <ButtonGroup className="float-end">
                    <Button variant="outline-info"
                            onClick={() => setEditing(true)}><FaEdit/></Button>
                    <Button variant="outline-danger"
                            onClick={() => setConfirmModalShow(true)}><FaTrashAlt/></Button>

                </ButtonGroup>
            )
    }



    return (<>
        <Card className="card w-100">
            <div className="row g-0">
                <div className="col-3 my-auto image-placeholder">
                    <Image loader={() => props.book.thumbnailUrl} src={props.book.thumbnailUrl} alt="No Cover Found" width={100} height={100}/>
                </div>
                <div className="col-9">
                    <Card.Header>
                        <Card.Title>
                            <OverlayTrigger
                                placement="top"
                                delay={{show: 250, hide: 400}}
                                defaultShow={false}
                                flip={false}
                                onHide={undefined}
                                onToggle={undefined}
                                popperConfig={{}}
                                show={undefined}
                                target={undefined} trigger={['hover', 'focus']}
                                overlay={
                                    <Tooltip id={`title-tooltip-${props.book.id}`}>
                                        {fullTitle(props.book)}
                                    </Tooltip>
                                } >
                                <span>{truncatedText(fullTitle(props.book), 20)}</span>
                            </OverlayTrigger>
                        </Card.Title>
                        <Card.Subtitle>
                            <OverlayTrigger
                                placement="bottom"
                                delay={{show: 250, hide: 400}}
                                defaultShow={false}
                                flip={false}
                                onHide={undefined}
                                onToggle={undefined}
                                popperConfig={{}}
                                show={undefined}
                                target={undefined} trigger={['hover', 'focus']}
                                overlay={
                                    <Tooltip id={`authors-tooltip-${props.book.id}`}>
                                        {props.book.authors}
                                    </Tooltip>
                                }>
                                <em>{truncatedText(props.book.authors, 25)}</em>
                            </OverlayTrigger>
                        </Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                        {locationDisplay()}
                    </Card.Body>
                    <Card.Footer className="bg-transparent">
                        {createButtons()}
                    </Card.Footer>
                </div>
            </div>
        </Card>

        <ConfirmDeleteModal
            modalShow={confirmModalShow}
            onHide={() => {
                setConfirmModalShow(false)
            }}
            book={props.book}
            reloadBooks={props.reloadBooks}
        />
    </>)
}