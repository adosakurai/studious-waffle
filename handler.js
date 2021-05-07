const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
 name, author, summary, publisher, year, pageCount, readPage, reading,
} = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
        if (name === undefined) {
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            }).code(400);
        } if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            }).code(400);
        }
            try {
             if (books.filter((book) => book.id === id)) {
                const newbook = {
                    name, 
                    author,
                    summary,
                    publisher,
                    id,
                    year,
                    pageCount,
                    readPage,
                    insertedAt,
                    updatedAt,
                    reading,
                    finished,
                    };
                    books.push(newbook);
                return h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                    bookId: newbook.id,
                        },
                    }).code(201);
                } 
            } catch (error) {
                return h.response({
                 status: 'error',
                 message: 'Buku gagal ditambahkan',
               }).code(500);
             } return books;
        };

const getAllBooksHandler = () => ({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
        })),
        },
      });
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const bookId = books.filter((b) => b.id === id)[0];

    if (bookId !== undefined) {
        if (bookId === undefined) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
            }).code(404);
        } return h.response({
            status: 'success',
                data: {
                    books: books.map((book) => ({
                        id: book.id,
                        name: book.name, 
                        author: book.author,
                        year: book.year,
                        summary: book.summary,
                        publisher: book.publisher,
                        pageCount: book.pageCount,
                        readPage: book.readPage,
                        finished: book.finished,
                        reading: book.reading,
                        insertedAt: book.insertedAt,
                        updatedAt: book.updatedAt,
                    
                    })),
                },
            }).code(200);
        } return h;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {
        name, author, summary, publisher, year, pageCount, readPage, reading,
       } = request.payload;
    
    const updatedAt = new Date().toISOString();

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        };
    
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
          });
          response.code(200);
          return response;
        }
       
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }
     
     const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    };

module.exports = {
 addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};