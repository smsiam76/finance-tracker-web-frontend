import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewUser, getAllUser } from "../api/usersApi";

const useUsers = () => {
  const queryClient = useQueryClient();

  // common success function for reduce duplication
  const invalidateUsersCache = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  // get data
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });


  // createUserMutation
  const createUserMutation = useMutation({
    mutationFn: createNewUser,
    onSuccess: () => {
      invalidateUsersCache();
    },
    onError: (error) => {
      console.error("Creation error:", error);
    },
  });

  return {
    // All
    users,
    isLoading,
    error,
    refetch,

    // Action
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    createError: createUserMutation.error,
  };
};

export default useUsers;
