import React from 'react';
import {Button, Form} from "react-bootstrap";
import {Bookcase, Shelf} from "@/components/model/prisma-extended-types.model";

type BookListFilterProps = {
    bookcases: Bookcase[],
    shelves: Shelf[],
    bookcaseFilterIdx:number,
    shelfFilterIdx:number,
    setBookcaseFilterIdx:Function,
    setShelfFilterIdx:Function,
    setTitleFilter:Function,
    setAuthorFilter:Function,
    setIdentifierFilter:Function
}

export default function BookListFilterForm(props: BookListFilterProps) {
    const handleBookcaseSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.setBookcaseFilterIdx(parseInt(event.target.value));
        props.setShelfFilterIdx(-1);
    }

    const handleShelfSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.setShelfFilterIdx(parseInt(event.target.value));
    }

    const clearFilters = () => {
        props.setBookcaseFilterIdx(-1);
        props.setShelfFilterIdx(-1);
        props.setAuthorFilter("");
        props.setTitleFilter("");
        props.setIdentifierFilter("");
    }

    return (
        <div className="row pt-3 justify-content-md-center">
            <div className="col-4 col-md-2 col-lg-2 pe-0">
                <Form.Select onChange={handleBookcaseSelectChange} value={props.bookcaseFilterIdx} size={"sm"}>
                    <option key={-1} value={-1}>Bookcase</option>
                    {props.bookcases.map((bookcase:Bookcase) => (
                        <option key={bookcase.id} value={bookcase.id}>{bookcase.name}</option>
                    ))}
                </Form.Select>
            </div>
            <div className="col-4 col-md-2 col-lg-2 px-0">
                <Form.Select onChange={handleShelfSelectChange} value={props.shelfFilterIdx} size={"sm"}>
                    <option key={-1} value={-1}>Shelf</option>
                    {props.shelves.filter(shelf => shelf.bookcase_id === props.bookcaseFilterIdx).map(shelf => (
                        <option key={shelf.id} value={shelf.id}>{shelf.name}</option>
                    ))}
                </Form.Select>
            </div>
            <div className="col-4 col-md-2 col-lg-2 px-0">
                <Form.Control onChange={(e) => {props.setTitleFilter(e.target.value)}} placeholder="Title" size={"sm"}/>
            </div>
            <div className="col-4 col-md-2 col-lg-2 px-0">
                <Form.Control onChange={(e) => {props.setAuthorFilter(e.target.value)}} placeholder="Author" size={"sm"}/>
            </div>
            <div className="col-4 col-md-2 col-lg-2 px-0">
                <Form.Control onChange={(e) => {props.setIdentifierFilter(e.target.value)}} placeholder="Identifier" size={"sm"}/>
            </div>
            <Button onClick={clearFilters} variant="outline-danger" className="col-4 col-md-2 col-lg-2" size={"sm"}>Clear Filters</Button>
        </div>
    )

}