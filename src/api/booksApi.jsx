import useAxios from "../hooks/useAxios"

//get all books
export const getAllBooks = async () => {
    const res = await useAxios.get("/books");
    return res.data;
}

//get books by emails
export const getEmailBooks = async (email) => {
    const res = await useAxios.get(`/books?email=${email}`);
    return res.data;
}

//get books by id
export const getSingleBooks = async (id) => {
    const res = await useAxios.get(`/books/${id}`);
    return res.data;
}

//create a new book
export const createBook = async (bookInfo) => {
    const res = await useAxios.post("/books", bookInfo);
    return res.data;
}

//update a book by ID
export const updateBook = async (id, updateBookInfo) => {
    const res = await useAxios.patch(`/books/${id}`, updateBookInfo);
    return res.data;
}

//delete book
export const deleteBook = async (id) => {
    const res = await useAxios.delete(`/books/${id}`);
    return res.data;
}



