import useAxios from "../hooks/useAxios";


// get all users
export const getAllUser = async () => {
    const res = await useAxios.get("/users");
    return res.data;
}
// get single user
export const getSingleUser = async (email) => {
  const res = await useAxios.get(`/users?email=${email}`);
  return res.data;
}

// create new user
export const createNewUser = async (userInfo) => {
  const res = await useAxios.post("/users", userInfo);
  return res.data;
};


