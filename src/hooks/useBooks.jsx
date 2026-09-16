import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getEmailBooks,
  getSingleBooks,
  updateBook,
} from "../api/booksApi";

const useBooks = (email = null, id = null) => {
  const queryClient = useQueryClient();

  const invalidateDataCache = () => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  // get all books data / email wise
  const {
    data: books = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: email ? ["books", email] : ["books"],
    queryFn: () => (email ? getEmailBooks(email) : getAllBooks()),
  });

  const {
    data: singleBook = null,
    isLoading: isSingleBookLoading,
    error: singleBookError,
  } = useQuery({
    queryKey: ["books", id],
    queryFn: () => getSingleBooks(id),
    enabled: !!id, //if there is no id, the query will be not run
  });

//   create book mutation
  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.log("Creation Error", error);
    },
  });

  // book update mutation
  const updateBookMutation = useMutation({
    mutationFn: ({ id, updateBookInfo }) => updateBook(id, updateBookInfo),
    onSuccess: (_, variables) => {
      invalidateDataCache();
      queryClient.invalidateQueries({ queryKey: ["books", variables.id] });
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });

  //   deleteMutation
  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      invalidateDataCache();
    },
    onError: (error) => {
      console.error("Delete error:", error);
    },
  });

  return {
    // data and states
    books,
    singleBook,
    isLoading,
    isSingleBookLoading,
    isError,
    error,
    singleBookError,
    refetch,

    // actions (mutations)
    createBook: createBookMutation.mutateAsync,
    isCreating: createBookMutation.isPending,

    updateBook: updateBookMutation.mutateAsync,
    isUpdating: updateBookMutation.isPending,

    deleteBook: deleteBookMutation.mutateAsync,
    isDeleting: deleteBookMutation.isPending,
  };
};

export default useBooks;
