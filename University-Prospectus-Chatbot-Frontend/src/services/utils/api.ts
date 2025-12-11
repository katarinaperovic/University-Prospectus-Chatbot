import { API_BASE_URL } from "@/utils/config";
import axios, { AxiosRequestConfig } from 'axios';



type CallApiArgs = {
    url: AxiosRequestConfig['url'];
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    signal?: AxiosRequestConfig['signal'];
    headers?: AxiosRequestConfig['headers'];
    responseType?: AxiosRequestConfig['responseType'];
}


const axiosInstance = axios.create({
    baseURL: API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    }
});



axiosInstance.interceptors.request.use(
    (config) => {
        // const accessToken = tokenService.getTokens().accessToken;
        // if (accessToken) {
        //     config.headers['Authorization'] = `Bearer ${accessToken}`;
        // }
        config.headers['Content-Type'] = !config.headers['Content-Type'] ? 'application/json' : config.headers['Content-Type'];
        
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);



axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('error', error);
        Promise.reject(error);
        // if (error.response && error.response.status === 401) {
        //     // window.location.href = '/login';
        //     tokenService.clearTokens();
        // } else if (error.response && error.response.status === 403) {
        //     console.log('403 error');
        // }
        // else
        //     return Promise.reject(error);
    }
)


export const callApi = <T>({
    url, method, data, signal, headers, responseType
}: CallApiArgs): Promise<T> => axiosInstance.request<T>({
    url,
    method: method || "get",
    data,
    signal,
    headers,
    responseType
}).then(response => response.data);
