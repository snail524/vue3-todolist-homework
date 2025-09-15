import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

// 建立 axios instance
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", 
  timeout: 10000,
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    // 這裡可以加 token
    // config.headers.Authorization = `Bearer ${yourToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 回應攔截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 這裡可以統一處理錯誤
    return Promise.reject(error);
  }
);

// 泛型封裝 request
export const request = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await api.request<T>(config);
  return response.data;
};
