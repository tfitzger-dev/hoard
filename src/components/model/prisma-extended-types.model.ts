
import {bookcase, shelf, book} from "@prisma/client";

export interface Book extends book {
    shelf: Shelf;
}

export type Shelf = shelf & {
    bookcase: Bookcase;
}

export type Bookcase = bookcase;