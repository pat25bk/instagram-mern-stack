import axios from "axios"
import { SOCKET_ENDPOINT } from "./utils/constants";

const axiosInstance = axios.create({
    baseURL:SOCKET_ENDPOINT,
    withCredentials: true
})

export default axiosInstance;