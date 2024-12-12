const Book = require('../models/bookModel')

const createBook = async (req, res) => {
    const { goodreads_book_id,
    best_book_id, work_id,
    books_count,
    isbn,
    isbn13,
    authors,
    original_publication_year, 
    original_title, title, language_code, average_rating,
    ratings_count,
    work_ratings_count ,
    work_text_reviews_count,    
    ratings_1,
    ratings_2,
    ratings_3,
    ratings_4,
    ratings_5,
    image_url
    } = req.body;

    try {
        const book = await Book.create({
            goodreads_book_id,
            best_book_id, work_id,
            books_count,
            isbn,
            isbn13,
            authors,
            original_publication_year, 
            original_title, title, language_code, average_rating,
            ratings_count,
            work_ratings_count ,
            work_text_reviews_count,    
            ratings_1,
            ratings_2,
            ratings_3,
            ratings_4,
            ratings_5,
            image_url})
        res.status(201).json({message:"Book successfully created", details: book})

    } catch (err) {
        res.status(500).json({message:"Failed to create book", details: err})
    }
};


const updateBook = async (req, res) => {
    const { id } = req.params;
    const { 
        goodreads_book_id,
        best_book_id, work_id,
        books_count,
        isbn,
        isbn13,
        authors,
        original_publication_year, 
        original_title, title, language_code, average_rating,
        ratings_count,
        work_ratings_count ,
        work_text_reviews_count,    
        ratings_1,
        ratings_2,
        ratings_3,
        ratings_4,
        ratings_5,
        image_url
        } = req.body;

    try {
        const book = await Book.update(
            { goodreads_book_id,
                best_book_id, work_id,
                books_count,
                isbn,
                isbn13,
                authors,
                original_publication_year, 
                original_title, title, language_code, average_rating,
                ratings_count,
                work_ratings_count ,
                work_text_reviews_count,    
                ratings_1,
                ratings_2,
                ratings_3,
                ratings_4,
                ratings_5,
                image_url },
            { where: {book_id:id } }
        );
        if (book[0]) {
            res.json({ message: `Book with ID ${id} updated successfully` });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book', details:error });
    }
};


const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Book.destroy({ where: {book_id:id } });
        if (result) {
            res.json({ message: `Book with ID ${id} deleted successfully` });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
};


module.exports = { createBook, updateBook, deleteBook};

