import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getEmailCategories,
  getSingleCategory,
  updateCategory,
} from "../api/categoriesApi";

const useCategories = (email = null, id = null) => {
  const queryClient = useQueryClient();

  const invalidateCategoryCache = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  // Get all categories / Email-wise categories
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: email ? ["categories", email] : ["categories"],
    queryFn: () => (email ? getEmailCategories(email) : getAllCategories()),
  });

  // Get single category by ID
  const {
    data: singleCategory = null,
    isLoading: isSingleCategoryLoading,
    error: singleCategoryError,
  } = useQuery({
    queryKey: ["category", id], // "category"
    queryFn: () => getSingleCategory(id),
    enabled: !!id,
  });

  // Create Category mutation
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      invalidateCategoryCache();
    },
    onError: (error) => {
      console.error("Category Creation Error:", error);
    },
  });

  // Update Category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updateCategoryInfo }) =>
      updateCategory(id, updateCategoryInfo),
    onSuccess: (_, variables) => {
      invalidateCategoryCache();
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
    },
    onError: (error) => {
      console.error("Category Update Error:", error);
    },
  });

  // Delete Category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidateCategoryCache();
    },
    onError: (error) => {
      console.error("Category Delete Error:", error);
    },
  });

  return {
    // Data & Loading States
    categories,
    singleCategory,
    isLoading,
    isSingleCategoryLoading,
    isError,
    error,
    singleCategoryError,
    refetch,

    // Category Actions
    createCategory: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,

    updateCategory: updateCategoryMutation.mutateAsync,
    isUpdating: updateCategoryMutation.isPending,

    deleteCategory: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.isPending,
  };
};

export default useCategories;