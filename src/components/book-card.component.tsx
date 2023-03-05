import {Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Book} from "@/components/model/prisma-extended-types.model";
import ConfirmDeleteModal from "@/components/confirm-delete-modal.component";
import React, {useState,} from "react";
import Image from "next/image";

type BookCardProps = {
    book: Book,
    reloadBooks: Function
}

export const fullTitle = (book:Book):string => {
    const subtitle = (book.subtitle && book.subtitle !== "") ? `, ${book.subtitle}` : '';
    return `${book.title}${subtitle}`
}

const truncatedText = (text:string, length:number) => {
    return (text.length > (length + 3)) ? `${text.substring(0, length)}...` : text
}

export default function BookCard(props:BookCardProps) {
    const [confirmModalShow, setConfirmModalShow] = useState(false);
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
                                target={undefined} trigger={'hover'}
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
                                target={undefined} trigger={'hover'}
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
                        <div className="row">
                            <div className="col-4"><strong>Case:</strong></div>
                            <div className="col-8">{props.book.shelf.bookcase.name}</div>
                        </div>
                        <div className="row">
                            <div className="col-4"><strong>Shelf:</strong></div>
                            <div className="col-8">{props.book.shelf.name}</div>
                        </div>
                    </Card.Body>
                    <Card.Footer className="bg-transparent">
                        <Button variant="outline-danger" size="sm"
                                className="float-end"
                                onClick={() => setConfirmModalShow(true)}>X</Button>
                    </Card.Footer>
                </div>
            </div>
        </Card>

        <ConfirmDeleteModal
            modalShow={confirmModalShow}
            onHide={() => setConfirmModalShow(false)}
            book={props.book}
            reloadBooks={props.reloadBooks}
        />
    </>)
}