import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URl,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.data.message === "Jwt expired"
    ) {
      originalRequest._retry = true;
      try {
        // Tôi muốn khi access_token hết hạn khi nhấn sang trang mới hoặc f5 thì các request yêu cầu phải có access_token mới không bị lỗi
        const refresh_token_old = localStorage.getItem("refresh_token");
        const res = await axiosClient.post("/users/refresh-token", {
          refresh_token: refresh_token_old,
        });
        const { access_token, refresh_token } = res.data.result;
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("access_token", access_token);
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + access_token;
        originalRequest.headers["Authorization"] = "Bearer " + access_token;

        return axiosClient(originalRequest);
      } catch (error) {
        console.log(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
