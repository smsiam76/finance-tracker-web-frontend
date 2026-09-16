import { useQuery } from "@tanstack/react-query";
import { getSingleUser } from "../api/usersApi";

const useSingleUser = (email = null) => {
   
  const {
    data: user = null,
    isLoading,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", email], // Unique cache key per email
    queryFn: () => getSingleUser(email),
    enabled: !!email, //if email exists then query run
  });
  return {

    user,
    isLoading,
    isPending,
    error,
    refetch,
  }
};

export default useSingleUser;
