-- CreateTable
CREATE TABLE "book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "identifier_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "authors" TEXT NOT NULL,
    "shelf_id" INTEGER,
    "thumbnailUrl" TEXT NOT NULL,
    CONSTRAINT "book_shelf_id_fkey" FOREIGN KEY ("shelf_id") REFERENCES "shelf" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "bookcase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "shelf" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bookcase_id" INTEGER NOT NULL,
    CONSTRAINT "shelf_bookcase_id_fkey" FOREIGN KEY ("bookcase_id") REFERENCES "bookcase" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
CREATE INDEX "api_book_shelf_id_fbe848aa" ON "book"("shelf_id");

-- CreateIndex
CREATE INDEX "api_shelf_bookcase_id_b997fc86" ON "shelf"("bookcase_id");
