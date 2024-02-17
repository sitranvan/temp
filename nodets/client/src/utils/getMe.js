import axiosClient from "./axios";

const getMe = async (access_token) => {
  try {
    const res = await axiosClient.get("/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const { user } = res.data;
    localStorage.setItem("profile", JSON.stringify(user));
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
};
export default getMe;
