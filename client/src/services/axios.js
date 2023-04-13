import axios from "axios";
import { API_URL, API_URLS } from "@/config/api-routes";
import TokenService from "@/services/TokenService";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();

    console.log("url from request", config.url);
    if (token && config.baseURL + config.url !== API_URLS.REFRESH_TOKEN) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    console.log(res.data);
    return res;
  },
  (error) => {
    const originalRequest = error.config;
    if (originalRequest.url !== "/auth/login" && error.response) {
      // Access Token was expired
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // console.log(originalRequest._retry);
        try {
          instance.defaults.withCredentials = true;
          const config = {
            headers: {},
          };
          const rs = instance
            .post("/auth/refresh", {}, config)
            .then((response) => {
              console.log("token requested, saving token");
              TokenService.setToken(response.data.token);
              return response.data.token;
            });
          console.log("response from refresh", rs);
          return instance(originalRequest);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default instance;