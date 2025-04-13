import axios, { AxiosRequestConfig } from "axios";
import { RegisterUser } from "../page/register/Register";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}

let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    // 请求没有发送成功时，错误对象没有 response 属性
    if (!error.response) {
      return Promise.reject(error);
    }

    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if (res.status === 200 || res.status === 201) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const accessToken = localStorage.getItem("access_token");

    // 如果 token 存在，添加到请求头
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (!accessToken) {
      const refresh_token = localStorage.getItem("refresh_token");
    }

    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}

export async function registerCaptcha(email: string) {
  return await axiosInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post("/user/register", registerUser);
}

export async function updateCaptcha(address: string) {
  return await axiosInstance.get(
    `/user/update_password/captcha?address=${address}`
  );
}

export async function updatePaaword(passwordDto: any) {
  return await axiosInstance.post(`/user/admin/update_password`, passwordDto);
}

export async function fetchInfo() {
  return await axiosInstance.get(`/user/info`);
}

export async function updateInfoCaptcha(address: string) {
  return await axiosInstance.get(`/user/update/captcha?address=${address}`);
}

export async function refreshToken() {
  return await axiosInstance.get(`/user/refresh`);
}

export async function updateInfo(updateInfo: any) {
  return await axiosInstance.post(`/user/update`, updateInfo);
}