import axios from "axios";
import {useUserStore} from "@/store/modules/user";
import router from "@/router";

export const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
const userStore = useUserStore();
const instance = axios.create({
  baseURL,
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    const {profile} = userStore;
    if (profile.token) {
      if (config && config?.headers) {
        config.headers.Authorization = `Bearer ${profile.token}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response && err.response.status === 401) {
      userStore.clearUser();
      //encodeURIComponent 转换uri编码,防止解析地址出问题
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath);
      router.push("/login?redirectUrl=" + fullPath);
    }
    return Promise.reject(err);
  }
);

export default (url: string, method: string, submitData: any = {}) => {
  return instance({
    url,
    method,
    // 1.如果是get请求，需要使用params来传递submitData ?a=10&c=10
    // 2.如果不是get请求，需要使用data来传递submitData 请求体传参
    // [] 设置一个动态的key，写js表达式，js表达式的执行结果当作KEY
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};
