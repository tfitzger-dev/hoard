import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './ConfirmDeleteModal.module.scss';
import {Button, Modal, ModalHeader} from "react-bootstrap";
import {Book} from "@/components/model/prisma-extended-types.model";
import {fullTitle} from "@/components/book-card.component";

type ConfirmDeleteModalProps = {
    book:Book,
    modalShow: boolean,
    onHide: Function,
    reloadBooks: Function
}

export default function ConfirmDeleteModal(props:ConfirmDeleteModalProps) {

    const deleteBook =() => {
        const requestOptions = {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        }
        fetch(`/api/books/${props.book.id}/`, requestOptions)
            .then(r => r.json)
            .then(d => {
                props.onHide()
                props.reloadBooks()
            })

    }

    return (
        <Modal show={props.modalShow} aria-labelledby="confirm-delete-modal">
            <ModalHeader>Confirm Delete</ModalHeader>
            <Modal.Body>Are you sure you want to delete <strong>{fullTitle(props.book)}</strong></Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={() => props.onHide}>Cancel</Button>
                <div className="vr"/>
                <Button variant="outline-success" onClick={deleteBook} form="new-book-form">Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}